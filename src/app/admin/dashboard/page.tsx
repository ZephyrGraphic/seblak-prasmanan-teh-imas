"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { AdminBottomNav } from '@/components/layout/AdminBottomNav';

interface OrderItem {
    id: string;
    levelPedas: string;
    kuah: string;
    rasa: string;
    telur: string;
    sayur: string;
    toppings: string[];
    price: number;
}

interface OrderDrink {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    queueNumber: string;
    customerName: string;
    diningOption: 'DINE_IN' | 'TAKEAWAY';
    paymentMethod: 'CASH' | 'TRANSFER';
    status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
    specialRequest: string | null;
    totalPrice: number;
    items: OrderItem[];
    drinks: OrderDrink[];
    createdAt: string;
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return date.toLocaleDateString('id-ID');
}

function formatOrderItems(order: Order): string {
    const bowlsText = order.items.map((item, i) => 
        `Bowl ${i+1}: ${item.levelPedas}, ${item.toppings.slice(0, 2).join(', ')}${item.toppings.length > 2 ? '...' : ''}`
    ).join('; ');
    
    const drinksText = order.drinks.length > 0 
        ? ` + ${order.drinks.map(d => `${d.quantity}x ${d.name}`).join(', ')}`
        : '';
    
    return bowlsText + drinksText;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [voidingOrderId, setVoidingOrderId] = useState<string | null>(null);
    const [voidReason, setVoidReason] = useState('');
    const [showVoidModal, setShowVoidModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    // Play notification sound
    const playNotification = useCallback((customerName: string) => {
        if (!soundEnabled) return;
        
        audioRef.current?.play().catch(e => console.error("Audio blocked:", e));
        
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const u = new SpeechSynthesisUtterance(`Pesanan baru dari ${customerName}`);
            u.lang = 'id-ID';
            window.speechSynthesis.speak(u);
        }
    }, [soundEnabled]);

    // Fetch initial orders
    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch('/api/orders?today=true');
            const result = await response.json();
            if (result.success) {
                // Filter to show only active orders
                const activeOrders = result.data.filter((o: Order) => 
                    ['PENDING', 'PREPARING', 'READY'].includes(o.status)
                );
                setOrders(activeOrders);
                
                // Calculate revenue
                const revenue = result.data
                    .filter((o: Order) => o.status === 'COMPLETED')
                    .reduce((acc: number, o: Order) => acc + o.totalPrice, 0);
                setTotalRevenue(revenue);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Setup SSE connection
    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        
        fetchOrders();
        
        // Connect to SSE stream
        const eventSource = new EventSource('/api/orders/stream');
        eventSourceRef.current = eventSource;
        
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data.type === 'initial_orders') {
                    const activeOrders = data.orders.filter((o: Order) => 
                        ['PENDING', 'PREPARING', 'READY'].includes(o.status)
                    );
                    setOrders(activeOrders);
                    setIsLoading(false);
                }
                
                if (data.type === 'new_order') {
                    setOrders(prev => [data.order, ...prev]);
                    playNotification(data.order.customerName);
                }
                
                if (data.type === 'order_update') {
                    setOrders(prev => prev.map(o => 
                        o.id === data.order.id ? { ...o, status: data.order.status } : o
                    ));
                }
            } catch (e) {
                // Heartbeat or invalid message, ignore
            }
        };
        
        eventSource.onerror = () => {
            console.log('SSE connection error, reconnecting...');
            eventSource.close();
            // Reconnect after 3 seconds
            setTimeout(() => {
                fetchOrders();
            }, 3000);
        };
        
        return () => {
            eventSource.close();
        };
    }, [fetchOrders, playNotification]);

    // Update order status
    const updateStatus = async (orderId: string, newStatus: 'PREPARING' | 'READY' | 'COMPLETED') => {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            
            const result = await response.json();
            
            if (result.success) {
                if (newStatus === 'COMPLETED') {
                    // Remove from active list and add to revenue
                    setOrders(prev => prev.filter(o => o.id !== orderId));
                    const completedOrder = orders.find(o => o.id === orderId);
                    if (completedOrder) {
                        setTotalRevenue(prev => prev + completedOrder.totalPrice);
                    }
                } else {
                    // Update status in list
                    setOrders(prev => prev.map(o => 
                        o.id === orderId ? { ...o, status: newStatus } : o
                    ));
                }
            } else {
                alert(result.error || 'Gagal mengupdate status');
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Gagal mengupdate status pesanan');
        }
    };

    const getStatusButton = (order: Order) => {
        switch (order.status) {
            case 'PENDING':
                return (
                    <button 
                        onClick={() => updateStatus(order.id, 'PREPARING')} 
                        className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg shadow-sm active:scale-95"
                    >
                        Proses
                    </button>
                );
            case 'PREPARING':
                return (
                    <button 
                        onClick={() => updateStatus(order.id, 'READY')} 
                        className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm active:scale-95"
                    >
                        Siap Antar
                    </button>
                );
            case 'READY':
                return (
                    <button 
                        onClick={() => updateStatus(order.id, 'COMPLETED')} 
                        className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg shadow-sm active:scale-95"
                    >
                        Selesai
                    </button>
                );
            default:
                return null;
        }
    };

    // Void order
    const openVoidModal = (orderId: string) => {
        setVoidingOrderId(orderId);
        setVoidReason('');
        setShowVoidModal(true);
    };

    const confirmVoid = async () => {
        if (!voidingOrderId) return;
        
        try {
            const response = await fetch(`/api/orders/${voidingOrderId}/void`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: voidReason || 'Dibatalkan oleh admin' })
            });
            
            const result = await response.json();
            
            if (result.success) {
                setOrders(prev => prev.filter(o => o.id !== voidingOrderId));
                setShowVoidModal(false);
                setVoidingOrderId(null);
            } else {
                alert(result.error || 'Gagal membatalkan pesanan');
            }
        } catch (error) {
            console.error('Failed to void order:', error);
            alert('Gagal membatalkan pesanan');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-yellow-100 text-yellow-700">Pending</span>;
            case 'PREPARING':
                return <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-orange-100 text-orange-700">Diproses</span>;
            case 'READY':
                return <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-green-100 text-green-700">Siap</span>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#e6dfdb] dark:border-[#3d2c22] p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={() => router.push('/admin')} className="material-symbols-outlined text-[#181411] dark:text-white">logout</button>
                    <h2 className="text-[#181411] dark:text-white text-lg font-bold">Admin Dashboard</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={fetchOrders}
                        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                    <button 
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={clsx("p-2 rounded-full", soundEnabled ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400")}
                    >
                        <span className="material-symbols-outlined">{soundEnabled ? 'volume_up' : 'volume_off'}</span>
                    </button>
                </div>
            </header>

            {/* Stats */}
            <section className="p-4 flex gap-3">
                <div className="flex-1 bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                    <p className="text-[#8a7260] text-xs font-bold uppercase">Aktif</p>
                    <p className="text-3xl font-extrabold text-[#181411] dark:text-white">{orders.length}</p>
                </div>
                <div className="flex-1 bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                    <p className="text-[#8a7260] text-xs font-bold uppercase">Pendapatan Hari Ini</p>
                    <p className="text-2xl font-extrabold text-primary">Rp {totalRevenue.toLocaleString('id-ID')}</p>
                </div>
            </section>

             {/* Order List */}
             <main className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[#181411] dark:text-white">Pesanan Aktif</h3>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">progress_activity</span>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">inbox</span>
                        <p className="text-gray-500">Belum ada pesanan aktif</p>
                        <p className="text-gray-400 text-sm">Pesanan baru akan muncul di sini</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className={clsx(
                            "flex flex-col rounded-xl shadow-sm border bg-white dark:bg-white/5 overflow-hidden transition-all",
                            order.status === 'READY' ? "border-green-500/50 ring-2 ring-green-500/20" : 
                            order.status === 'PENDING' ? "border-yellow-500/50" : "border-gray-200 dark:border-white/10"
                        )}>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-lg font-extrabold text-[#181411] dark:text-white">{order.queueNumber}</p>
                                        <p className="text-primary text-sm font-bold">{order.customerName}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {getStatusBadge(order.status)}
                                        <span className={clsx(
                                            "px-2 py-0.5 text-[10px] font-bold uppercase rounded",
                                            order.paymentMethod === 'CASH' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                        )}>
                                            {order.paymentMethod === 'CASH' ? 'Tunai' : 'Transfer'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="py-2 border-t border-dashed border-gray-100 dark:border-white/10 mt-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{formatOrderItems(order)}</p>
                                    {order.specialRequest && (
                                        <p className="text-xs text-orange-600 mt-1 italic">📝 {order.specialRequest}</p>
                                    )}
                                    <p className="text-primary font-mono font-bold mt-2">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                                </div>

                                <div className="flex justify-between items-center mt-3">
                                    <p className="text-xs text-gray-400 font-medium">{formatTimeAgo(order.createdAt)}</p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => openVoidModal(order.id)} 
                                            className="px-3 py-2 bg-red-100 text-red-600 text-sm font-bold rounded-lg active:scale-95"
                                            title="Batalkan Pesanan"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                        {getStatusButton(order)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>

            {/* Admin Nav */}
            <AdminBottomNav />

            {/* Void Order Modal */}
            {showVoidModal && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-sm p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-full">
                                <span className="material-symbols-outlined text-red-600">warning</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#181411] dark:text-white">Batalkan Pesanan?</h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Pesanan yang dibatalkan tidak akan dihitung dalam pendapatan.
                        </p>
                        
                        <input
                            type="text"
                            placeholder="Alasan pembatalan (opsional)"
                            value={voidReason}
                            onChange={(e) => setVoidReason(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl mb-4 text-sm focus:ring-2 focus:ring-red-500/50 dark:bg-stone-800"
                        />
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowVoidModal(false)}
                                className="flex-1 py-3 bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl active:scale-95"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={confirmVoid}
                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl active:scale-95"
                            >
                                Ya, Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
