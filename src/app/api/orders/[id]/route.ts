import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { notifyOrderUpdate } from '@/lib/sse';

// ==================== GET - Single Order ====================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        drinks: true,
      }
    });
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// ==================== PATCH - Edit Order ====================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { items, drinks, specialRequest, totalPrice } = body;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true, drinks: true }
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Pesanan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Can only edit orders that are not completed or cancelled
    if (['COMPLETED', 'CANCELLED'].includes(existingOrder.status)) {
      return NextResponse.json(
        { success: false, error: 'Pesanan tidak dapat diedit' },
        { status: 400 }
      );
    }

    // Update order with transaction
    const updatedOrder = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Delete existing items and drinks
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      await tx.orderDrink.deleteMany({ where: { orderId: id } });

      // Create new items
      if (items && items.length > 0) {
        await tx.orderItem.createMany({
          data: items.map((item: { levelPedas: string; kuah: string; rasa: string; telur: string; sayur: string; toppings: string[]; price: number }) => ({
            orderId: id,
            levelPedas: item.levelPedas,
            kuah: item.kuah,
            rasa: item.rasa,
            telur: item.telur,
            sayur: item.sayur,
            toppings: item.toppings,
            price: item.price
          }))
        });
      }

      // Create new drinks
      if (drinks && drinks.length > 0) {
        await tx.orderDrink.createMany({
          data: drinks.map((drink: { name: string; quantity: number; price: number }) => ({
            orderId: id,
            name: drink.name,
            quantity: drink.quantity,
            price: drink.price
          }))
        });
      }

      // Update order total
      return tx.order.update({
        where: { id },
        data: {
          totalPrice: totalPrice || existingOrder.totalPrice,
          specialRequest: specialRequest !== undefined ? specialRequest : existingOrder.specialRequest
        },
        include: {
          items: true,
          drinks: true
        }
      });
    });

    // Notify via SSE
    notifyOrderUpdate(updatedOrder);

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: `Pesanan ${updatedOrder.queueNumber} berhasil diupdate`
    });

  } catch (error) {
    console.error('Error editing order:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengedit pesanan' },
      { status: 500 }
    );
  }
}

// ==================== DELETE - Cancel Order ====================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const order = await prisma.order.delete({
      where: { id }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `Order ${order.queueNumber} deleted` 
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
