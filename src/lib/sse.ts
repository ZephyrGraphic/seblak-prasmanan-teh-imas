import { OrderStatus } from '@prisma/client';

// Store for SSE connections
// Note: In serverless (Vercel), this in-memory store will only work for connections on the same lambda instance.
// For production scale, use Redis or a dedicated SSE service (like Pusher or Ably).
export const clients = new Set<ReadableStreamDefaultController>();

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
