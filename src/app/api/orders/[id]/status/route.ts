import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

// Valid status transitions
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  PREPARING: [OrderStatus.READY, OrderStatus.CANCELLED],
  READY: [OrderStatus.COMPLETED],
  COMPLETED: [],
  CANCELLED: [],
};

// ==================== PATCH - Update Order Status ====================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    
    // Validate status
    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be one of: PENDING, PREPARING, READY, COMPLETED, CANCELLED' },
        { status: 400 }
      );
    }
    
    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id }
    });
    
    if (!currentOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Validate transition
    const allowedTransitions = VALID_TRANSITIONS[currentOrder.status];
    if (!allowedTransitions.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot change status from ${currentOrder.status} to ${status}. Allowed: ${allowedTransitions.join(', ') || 'none'}` 
        },
        { status: 400 }
      );
    }
    
    // Update order
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
        drinks: true,
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: order,
      message: `Order ${order.queueNumber} status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
