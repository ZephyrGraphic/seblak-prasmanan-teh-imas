"use client";
import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { useOrderStore } from '@/store/orderStore';
import clsx from 'clsx';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HistoryPage() {
    const store = useOrderStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="pb-20 min-h-screen flex flex-col">
            <TopBar title="Riwayat Pesanan" />
            
            <main className="flex-1 p-4 space-y-4">
                {store.orderHistory.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-20">
                        <div className="size-20 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-gray-400 text-4xl">history</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Belum Ada Riwayat</h3>
                        <p className="text-gray-500 mb-8 max-w-[250px]">Pesan seblak dulu yuk biar ada kenangan manis di sini!</p>
                        <Link href="/order" className="w-full">
                            <Button fullWidth>Pesan Sekarang</Button>
                        </Link>
                    </div>
                ) : (
                    store.orderHistory.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
                                    {order.queueNumber.split('-')[1] || '?'}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold mb-0.5">{order.date}</p>
                                    <p className="text-[#181411] dark:text-white font-bold">{order.itemsCount} Item</p>
                                    <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded font-bold">Selesai</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-primary font-bold">Rp {order.total.toLocaleString('id-ID')}</p>
                                <p className="text-xs text-gray-400">Total Pembayaran</p>
                            </div>
                        </div>
                    ))
                )}
            </main>

            <BottomNav />
        </div>
    );
}
