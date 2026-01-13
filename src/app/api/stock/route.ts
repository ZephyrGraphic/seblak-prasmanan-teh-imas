import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StockStatus } from '@prisma/client';

// ==================== GET - List Stock Items ====================
export async function GET() {
  try {
    const items = await prisma.stockItem.findMany({
      orderBy: [
        { status: 'asc' },  // OUT first, then LOW, then OK
        { name: 'asc' }
      ]
    });
    
    // Calculate stats
    const stats = {
      total: items.length,
      lowStock: items.filter(i => i.status === 'LOW').length,
      outOfStock: items.filter(i => i.status === 'OUT').length,
    };
    
    return NextResponse.json({ success: true, data: items, stats });
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock items' },
      { status: 500 }
    );
  }
}

// ==================== POST - Add Stock Item ====================
export async function POST(request: NextRequest) {
  try {
    const { name, unit, stock } = await request.json();
    
    if (!name || !unit) {
      return NextResponse.json(
        { success: false, error: 'Name and unit are required' },
        { status: 400 }
      );
    }
    
    // Determine status based on stock level
    let status: StockStatus = StockStatus.OK;
    if (stock === 0) {
      status = StockStatus.OUT;
    } else if (stock <= 3) {
      status = StockStatus.LOW;
    }
    
    const item = await prisma.stockItem.create({
      data: {
        name,
        unit,
        stock: stock || 0,
        status
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: item,
      message: `Stock item "${name}" created`
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating stock item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create stock item' },
      { status: 500 }
    );
  }
}
