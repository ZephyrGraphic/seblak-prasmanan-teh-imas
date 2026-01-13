import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyOrderUpdate } from '../../stream/route';

// PATCH /api/orders/[id]/void - Void an order
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { reason } = body;

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { id }
        });

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Pesanan tidak ditemukan' },
                { status: 404 }
            );
        }

        // Check if order can be voided (not already completed or voided)
        if (order.status === 'COMPLETED') {
            return NextResponse.json(
                { success: false, error: 'Pesanan yang sudah selesai tidak bisa dibatalkan' },
                { status: 400 }
            );
        }

        if (order.voidedAt) {
            return NextResponse.json(
                { success: false, error: 'Pesanan sudah dibatalkan sebelumnya' },
                { status: 400 }
            );
        }

        // Void the order
        const voidedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                voidedAt: new Date(),
                voidReason: reason || 'Dibatalkan oleh admin'
            },
            include: {
                items: true,
                drinks: true
            }
        });

        // Notify via SSE
        notifyOrderUpdate(voidedOrder);

        return NextResponse.json({
            success: true,
            data: voidedOrder,
            message: `Pesanan ${order.queueNumber} berhasil dibatalkan`
        });

    } catch (error) {
        console.error('Void order error:', error);
        return NextResponse.json(
            { success: false, error: 'Gagal membatalkan pesanan' },
            { status: 500 }
        );
    }
}
