import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DiningOption, PaymentMethod, OrderStatus } from '@prisma/client';
import { notifyNewOrder } from '@/lib/sse';

// Helper to get today's date string
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper to get next queue number
async function getNextQueueNumber(diningOption: DiningOption): Promise<string> {
  const today = getTodayDate();
  
  // Get or create queue counter for today
  let counter = await prisma.queueCounter.findUnique({
    where: { id: 'default' }
  });
  
  if (!counter || counter.date !== today) {
    // Reset counter for new day
    counter = await prisma.queueCounter.upsert({
      where: { id: 'default' },
      update: { date: today, dineIn: 0, takeaway: 0 },
      create: { id: 'default', date: today, dineIn: 0, takeaway: 0 }
    });
  }
  
  // Increment the appropriate counter
  const prefix = diningOption === 'DINE_IN' ? 'DIA' : 'TAK';
  const field = diningOption === 'DINE_IN' ? 'dineIn' : 'takeaway';
  
  const updated = await prisma.queueCounter.update({
    where: { id: 'default' },
    data: { [field]: { increment: 1 } }
  });
  
  const number = diningOption === 'DINE_IN' ? updated.dineIn : updated.takeaway;
  return `${prefix}-${String(number).padStart(3, '0')}`;
}

// ==================== GET - List Orders ====================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const today = searchParams.get('today') === 'true';
    
    const where: { status?: OrderStatus; createdAt?: { gte: Date } } = {};
    
    if (status) {
      where.status = status;
    }
    
    if (today) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      where.createdAt = { gte: startOfDay };
    }
    
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        drinks: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// ==================== POST - Create Order ====================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      customerName,
      diningOption,
      paymentMethod,
      specialRequest,
      bowls = [],
      drinks = [],
      totalPrice
    } = body;
    
    // Validate required fields
    if (!customerName || !diningOption || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: customerName, diningOption, paymentMethod' },
        { status: 400 }
      );
    }

    // Check if store is open
    const settings = await prisma.storeSettings.findUnique({
      where: { id: 'default' }
    });

    if (settings && !settings.isOpen) {
      return NextResponse.json(
        { success: false, error: 'Maaf, toko sedang tutup. Tidak dapat menerima pesanan baru.' },
        { status: 400 }
      );
    }
    
    if (bowls.length === 0 && drinks.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must have at least one item' },
        { status: 400 }
      );
    }
    
    // Map dining option
    const diningOptionEnum = diningOption === 'Dine-in' || diningOption === 'DINE_IN' 
      ? DiningOption.DINE_IN 
      : DiningOption.TAKEAWAY;
    
    // Map payment method  
    const paymentMethodEnum = paymentMethod === 'Cash' || paymentMethod === 'CASH'
      ? PaymentMethod.CASH
      : PaymentMethod.TRANSFER;
    
    // Generate queue number
    const queueNumber = await getNextQueueNumber(diningOptionEnum);
    
    // Create order with items and drinks
    const order = await prisma.order.create({
      data: {
        queueNumber,
        customerName,
        diningOption: diningOptionEnum,
        paymentMethod: paymentMethodEnum,
        status: OrderStatus.PENDING,
        specialRequest: specialRequest || null,
        totalPrice: totalPrice || 0,
        items: {
          create: bowls.map((bowl: {
            levelPedas: string;
            kuah: string;
            rasa: string;
            telur: string;
            sayur: string;
            toppings: string[];
            price: number;
          }) => ({
            levelPedas: bowl.levelPedas,
            kuah: bowl.kuah,
            rasa: bowl.rasa,
            telur: bowl.telur,
            sayur: bowl.sayur,
            toppings: bowl.toppings,
            price: bowl.price,
          }))
        },
        drinks: {
          create: drinks.map((drink: { name: string; quantity: number; price: number }) => ({
            name: drink.name,
            quantity: drink.quantity,
            price: drink.price,
          }))
        }
      },
      include: {
        items: true,
        drinks: true,
      }
    });
    
    // Notify clients about new order
    notifyNewOrder(order);

    return NextResponse.json({ 
      success: true, 
      data: order,
      message: `Order created with queue number ${queueNumber}`
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
