import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/revenue - Get daily revenue summary
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get('date');
        
        // Default to today
        const targetDate = dateParam ? new Date(dateParam) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Get all orders for the day (excluding voided orders)
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                voidedAt: null // Exclude voided orders
            },
            include: {
                items: true,
                drinks: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate totals
        const completedOrders = orders.filter(o => o.status === 'COMPLETED');
        const pendingOrders = orders.filter(o => ['PENDING', 'PREPARING', 'READY'].includes(o.status));
        
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
        const cashRevenue = completedOrders
            .filter(o => o.paymentMethod === 'CASH')
            .reduce((sum, o) => sum + o.totalPrice, 0);
        const transferRevenue = completedOrders
            .filter(o => o.paymentMethod === 'TRANSFER')
            .reduce((sum, o) => sum + o.totalPrice, 0);
        
        const avgTicket = completedOrders.length > 0 
            ? Math.round(totalRevenue / completedOrders.length) 
            : 0;

        // Calculate hourly trend
        const hourlyTrend: { hour: string; count: number; revenue: number }[] = [];
        for (let h = 10; h <= 22; h += 2) {
            const hourStart = new Date(startOfDay);
            hourStart.setHours(h, 0, 0, 0);
            const hourEnd = new Date(startOfDay);
            hourEnd.setHours(h + 2, 0, 0, 0);
            
            const hourOrders = completedOrders.filter(o => {
                const orderHour = new Date(o.createdAt);
                return orderHour >= hourStart && orderHour < hourEnd;
            });
            
            hourlyTrend.push({
                hour: `${h.toString().padStart(2, '0')}:00`,
                count: hourOrders.length,
                revenue: hourOrders.reduce((sum, o) => sum + o.totalPrice, 0)
            });
        }

        // Calculate popular toppings
        const toppingCounts: Record<string, number> = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                item.toppings.forEach(topping => {
                    toppingCounts[topping] = (toppingCounts[topping] || 0) + 1;
                });
            });
        });
        
        const popularToppings = Object.entries(toppingCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Get yesterday's revenue for comparison
        const yesterdayStart = new Date(startOfDay);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        const yesterdayEnd = new Date(yesterdayStart);
        yesterdayEnd.setHours(23, 59, 59, 999);

        const yesterdayOrders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: yesterdayStart,
                    lte: yesterdayEnd
                },
                status: 'COMPLETED',
                voidedAt: null
            }
        });
        
        const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
        const revenueChange = yesterdayRevenue > 0 
            ? ((totalRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1)
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                date: startOfDay.toISOString().split('T')[0],
                totalRevenue,
                cashRevenue,
                transferRevenue,
                completedCount: completedOrders.length,
                pendingCount: pendingOrders.length,
                avgTicket,
                hourlyTrend,
                popularToppings,
                revenueChange: Number(revenueChange),
                orders: orders.map(o => ({
                    id: o.id,
                    queueNumber: o.queueNumber,
                    customerName: o.customerName,
                    totalPrice: o.totalPrice,
                    paymentMethod: o.paymentMethod,
                    status: o.status,
                    createdAt: o.createdAt
                }))
            }
        });

    } catch (error) {
        console.error('Revenue fetch error:', error);
        return NextResponse.json(
            { success: false, error: 'Gagal mengambil data pendapatan' },
            { status: 500 }
        );
    }
}
