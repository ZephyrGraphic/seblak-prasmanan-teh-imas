import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StockStatus } from '@prisma/client';

// ==================== PATCH - Update Stock Item ====================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, unit, stock, status, isAvailable, emoji } = body;
    
    // Build update data
    const updateData: { 
      name?: string; 
      unit?: string; 
      stock?: number; 
      status?: StockStatus;
      isAvailable?: boolean;
      emoji?: string;
    } = {};
    
    if (name !== undefined) updateData.name = name;
    if (unit !== undefined) updateData.unit = unit;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (emoji !== undefined) updateData.emoji = emoji;
    if (stock !== undefined) {
      updateData.stock = stock;
      // Auto-update status based on stock if not explicitly provided
      if (status === undefined) {
        if (stock === 0) {
          updateData.status = StockStatus.OUT;
        } else if (stock <= 3) {
          updateData.status = StockStatus.LOW;
        } else {
          updateData.status = StockStatus.OK;
        }
      }
    }
    if (status !== undefined) updateData.status = status;
    
    const item = await prisma.stockItem.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json({ 
      success: true, 
      data: item,
      message: `Stock item "${item.name}" updated`
    });
    
  } catch (error) {
    console.error('Error updating stock item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update stock item' },
      { status: 500 }
    );
  }
}

// ==================== DELETE - Remove Stock Item ====================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const item = await prisma.stockItem.delete({
      where: { id }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `Stock item "${item.name}" deleted`
    });
    
  } catch (error) {
    console.error('Error deleting stock item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete stock item' },
      { status: 500 }
    );
  }
}
