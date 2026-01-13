import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

// Store for SSE connections
const clients = new Set<ReadableStreamDefaultController>();

// Export for use in other routes when new orders are created
export function notifyNewOrder(order: { id: string; queueNumber: string; customerName: string }) {
  const message = `data: ${JSON.stringify({ type: 'new_order', order })}\n\n`;
  clients.forEach((controller) => {
    try {
      controller.enqueue(new TextEncoder().encode(message));
    } catch {
      clients.delete(controller);
    }
  });
}

export function notifyOrderUpdate(order: { id: string; queueNumber: string; status: OrderStatus }) {
  const message = `data: ${JSON.stringify({ type: 'order_update', order })}\n\n`;
  clients.forEach((controller) => {
    try {
      controller.enqueue(new TextEncoder().encode(message));
    } catch {
      clients.delete(controller);
    }
  });
}

// ==================== GET - SSE Stream ====================
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      clients.add(controller);
      
      // Send initial connection message
      const connectMsg = `data: ${JSON.stringify({ type: 'connected', message: 'SSE connection established' })}\n\n`;
      controller.enqueue(encoder.encode(connectMsg));
      
      // Send current pending/preparing orders
      try {
        const activeOrders = await prisma.order.findMany({
          where: {
            status: {
              in: [OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.READY]
            }
          },
          include: {
            items: true,
            drinks: true,
          },
          orderBy: { createdAt: 'desc' }
        });
        
        const initialData = `data: ${JSON.stringify({ type: 'initial_orders', orders: activeOrders })}\n\n`;
        controller.enqueue(encoder.encode(initialData));
      } catch (error) {
        console.error('Error fetching initial orders:', error);
      }
      
      // Keep connection alive with heartbeat
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          clearInterval(heartbeatInterval);
          clients.delete(controller);
        }
      }, 30000);
      
      // Handle disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        clients.delete(controller);
        controller.close();
      });
    },
    cancel() {
      // Cleanup handled in abort handler
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
