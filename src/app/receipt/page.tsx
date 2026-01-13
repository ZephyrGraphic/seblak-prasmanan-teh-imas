"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Suspense } from 'react';
import html2canvas from 'html2canvas';

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
    diningOption: string;
    paymentMethod: string;
    totalPrice: number;
    createdAt: string;
    items: OrderItem[];
    drinks: OrderDrink[];
}

function ReceiptContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const receiptRef = useRef<HTMLDivElement>(null);
    
    // Get params
    const queueParam = searchParams.get('queue');
    const idParam = searchParams.get('id');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!idParam) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/orders/${idParam}`);
                const result = await response.json();
                if (result.success) {
                    setOrder(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [idParam]);

    const handleNewOrder = () => {
        router.push('/');
    };

    const handleSaveImage = async () => {
        if (receiptRef.current) {
            try {
                // Use html2canvas with slightly loosened security to allow local capture
                // removing useCORS might help if strictly local, but usually needed for ext resources.
                // allowTaint: true is dangerous for cross-origin but fine for local generated content.
                const canvas = await html2canvas(receiptRef.current, {
                    scale: 3, 
                    backgroundColor: '#ffffff',
                    useCORS: true
                });
                
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `Receipt-${order?.queueNumber || 'Seblak'}.png`;
                link.click();
            } catch (error) {
                console.error('Error generating receipt image:', error);
                alert('Gagal menyimpan gambar: ' + (error instanceof Error ? error.message : 'Unknown error'));
            }
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Memuat nota...</div>;
    }

    // Fallback if no order found
    if (!order && !queueParam) return (
         <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-300">receipt_long</span>
            <p className="text-gray-500">Data pesanan tidak ditemukan</p>
            <Button onClick={() => router.push('/')}>Kembali ke Menu</Button>
        </div>
    );

    const displayQueue = order?.queueNumber || queueParam || 'N/A';
    const displayDate = order ? new Date(order.createdAt).toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID');

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-10">
            <TopBar title="Order Receipt" showBack onBack={() => router.push('/')} />
            
            <main className="flex-1 p-6 flex flex-col items-center">
                {/* Receipt Container - INLINE STYLES ENFORCED TO PREVENT TAILWIND v4 COLOR ISSUES */}
                <div 
                    ref={receiptRef} 
                    style={{ backgroundColor: '#ffffff', color: '#181411' }} 
                    className="w-full max-w-sm receipt-paper receipt-jagged-top receipt-jagged-bottom pb-10 flex flex-col items-center"
                >
                    
                    {/* Header */}
                    <div className="pt-8 px-6 text-center w-full">
                        <div style={{ backgroundColor: '#fff7ed' }} className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <span style={{ color: '#f47b25' }} className="material-symbols-outlined text-3xl">restaurant</span>
                        </div>
                        <h1 className="text-[18px] font-extrabold leading-tight tracking-[-0.015em] uppercase">Seblak Prasmanan</h1>
                        <h2 style={{ color: '#f47b25' }} className="text-lg font-bold italic -mt-1 uppercase">Teh Imas</h2>
                    </div>

                    {/* Queue Number */}
                    <div className="px-6 py-4 w-full">
                        <div style={{ borderColor: '#e5e7eb', backgroundColor: '#fdfaf8' }} className="w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center">
                            <p style={{ color: '#8a7260' }} className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1">Nomor Antrian</p>
                            <p className="text-6xl font-black tracking-tighter text-black">{displayQueue}</p>
                            <p style={{ color: '#8a7260' }} className="text-[10px] font-medium mt-2">Harap tunggu nomor dipanggil</p>
                        </div>
                    </div>

                    <div className="px-6 py-2 w-full">
                        <div style={{ borderColor: '#e5e7eb' }} className="border-t-2 border-dashed"></div>
                    </div>

                    {/* Order Details */}
                    <div className="px-6 space-y-2 w-full">
                        <div className="flex justify-between gap-x-6">
                            <p style={{ color: '#8a7260' }} className="text-xs font-semibold uppercase tracking-wider">Customer</p>
                            <p className="text-xs font-bold uppercase">{order?.customerName || 'Guest'}</p>
                        </div>
                        <div className="flex justify-between gap-x-6">
                            <p style={{ color: '#8a7260' }} className="text-xs font-semibold uppercase tracking-wider">Date</p>
                            <p className="text-xs font-medium">{displayDate}</p>
                        </div>
                         <div className="flex justify-between gap-x-6">
                            <p style={{ color: '#8a7260' }} className="text-xs font-semibold uppercase tracking-wider">Option</p>
                            <span style={{ backgroundColor: '#f47b25', color: '#ffffff' }} className="text-[10px] px-2 py-0.5 rounded font-bold uppercase">{order?.diningOption || 'Dine-in'}</span>
                        </div>
                    </div>

                    <div className="px-6 py-4 w-full">
                        <div style={{ borderColor: '#e5e7eb' }} className="border-t-2 border-dashed"></div>
                    </div>

                    {/* Items */}
                    <div className="px-6 space-y-4 w-full text-left">
                        {order?.items.map((bowl, idx) => (
                            <div key={idx}>
                                <p style={{ color: '#f47b25' }} className="text-[10px] font-bold uppercase tracking-widest mb-1">
                                    Bowl #{idx+1}
                                </p>
                                <div style={{ borderColor: '#fed7aa' }} className="space-y-1 pl-2 border-l-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-xs">{bowl.levelPedas}</span>
                                        <span style={{ color: '#6b7280' }} className="font-medium text-xs">{bowl.kuah} / {bowl.rasa}</span>
                                    </div>
                                    <div style={{ color: '#9ca3af' }} className="flex justify-between text-sm text-[10px]">
                                        <span>{bowl.telur}, {bowl.sayur}</span>
                                    </div>
                                    {bowl.toppings.map(t => (
                                         <div key={t} className="flex justify-between text-sm">
                                            <span>+ {t}</span>
                                        </div>
                                    ))}
                                    <div style={{ borderColor: '#e5e7eb' }} className="flex justify-between text-sm pt-1 border-t border-dashed mt-1">
                                        <span className="font-bold">Subtotal</span>
                                        <span className="font-mono">Rp {bowl.price.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {order?.drinks && order.drinks.length > 0 && (
                            <div className="pt-2">
                                <p style={{ color: '#f47b25' }} className="text-[10px] font-bold uppercase tracking-widest mb-1">Minuman</p>
                                {order.drinks.map(d => (
                                    <div key={d.name} className="flex justify-between text-sm">
                                        <span>{d.quantity}x {d.name}</span>
                                        <span className="font-mono">Rp {(d.price * d.quantity).toLocaleString('id-ID')}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Total */}
                    <div className="px-6 py-6 mt-4 w-full">
                        <div style={{ borderColor: '#e5e7eb' }} className="border-t-2 border-dashed pt-4 space-y-2">
                            <div className="flex justify-between items-center pt-2">
                                <p className="text-base font-bold uppercase">Total</p>
                                <p style={{ color: '#f47b25' }} className="text-lg font-extrabold font-mono">Rp {(order?.totalPrice || 0).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-6 pb-6 w-full">
                        <div style={{ backgroundColor: '#f0fdf4', borderColor: '#dcfce7', color: '#15803d' }} className="flex items-center justify-center gap-2 py-3 rounded-lg border">
                            <span className="material-symbols-outlined text-xl">check_circle</span>
                            <div className="flex flex-col text-left">
                                <p className="text-[10px] font-bold uppercase leading-none">Status Pembayaran</p>
                                <p className="text-xs font-medium">{order?.paymentMethod === 'Cash' || order?.paymentMethod === 'CASH' ? 'Bayar di Kasir' : 'Transfer DANA'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 text-center">
                        <p className="text-sm font-bold uppercase italic tracking-tight">Terima Kasih!</p>
                        <p style={{ color: '#8a7260' }} className="text-[10px] font-medium">Selamat menikmati seblak Teh Imas!</p>
                    </div>
                </div>

                <div className="w-full max-w-sm mt-8 space-y-3">
                    <Button fullWidth onClick={handleSaveImage}>
                        <span className="material-symbols-outlined mr-2">download</span>
                        Simpan Gambar
                    </Button>
                    <Button variant="outline" fullWidth onClick={handleNewOrder}>
                        <span className="material-symbols-outlined mr-2">add_circle</span>
                        Buat Pesanan Baru
                    </Button>
                </div>

            </main>
        </div>
    );
}

// Default export with Suspense wrapper for useSearchParams
export default function ReceiptPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
            <ReceiptContent />
        </Suspense>
    );
}
