"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminBottomNav } from '@/components/layout/AdminBottomNav';
import clsx from 'clsx';

interface StockItem {
    id: string;
    name: string;
    unit: string;
    stock: number;
    status: 'OK' | 'LOW' | 'OUT';
    isAvailable: boolean;
    emoji?: string;
}

interface StockStats {
    total: number;
    lowStock: number;
    outOfStock: number;
}

const ITEM_EMOJIS: Record<string, string> = {
    'Kerupuk Orange': '🥟',
    'Mie Instan': '🍜',
    'Telur Ayam': '🥚',
    'Sosis Sapi': '🌭',
    'Bakso Sapi': '🍡',
    'Batagor': '🥟',
    'Ceker Ayam': '🍗',
    'Makaroni': '🍝',
    'Siomay': '🥟',
    'Jamur Kuping': '🍄',
    'Tulang Ayam': '🍖',
    'Sawi': '🥬',
};

export default function StockPage() {
    const router = useRouter();
    const [items, setItems] = useState<StockItem[]>([]);
    const [stats, setStats] = useState<StockStats>({ total: 0, lowStock: 0, outOfStock: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchStock = useCallback(async () => {
        try {
            const response = await fetch('/api/stock');
            const result = await response.json();
            if (result.success) {
                setItems(result.data);
                setStats(result.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stock:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStock();
    }, [fetchStock]);

    const handleToggleAvailability = async (id: string, currentValue: boolean) => {
        try {
            const response = await fetch(`/api/stock/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isAvailable: !currentValue })
            });
            
            const result = await response.json();
            
            if (result.success) {
                setItems(prev => prev.map(item => 
                    item.id === id ? { ...item, isAvailable: !currentValue } : item
                ));
            } else {
                alert(result.error || 'Gagal mengupdate status');
            }
        } catch (error) {
            console.error('Failed to toggle availability:', error);
            alert('Gagal mengupdate status');
        }
    };

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const availableCount = items.filter(i => i.isAvailable).length;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-4 flex justify-between items-center">
                <button onClick={() => router.push('/admin/dashboard')} className="material-symbols-outlined text-[#181411] dark:text-white">arrow_back_ios</button>
                <h2 className="text-[#181411] dark:text-white text-lg font-bold flex-1 text-center">Stock Management</h2>
                <button onClick={fetchStock} className="text-primary">
                    <span className="material-symbols-outlined">sync</span>
                </button>
            </header>

            {/* Search */}
            <div className="px-4 py-3 bg-white dark:bg-background-dark">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
                    <input 
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-stone-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 transition-all" 
                        placeholder="Search toppings..." 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">progress_activity</span>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto px-4 pb-20">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Available Items ({availableCount})
                        </p>
                        <div className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg">
                            <span className="material-symbols-outlined text-sm">filter_list</span>
                            <span>All</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredItems.map((item) => (
                            <div 
                                key={item.id} 
                                className={clsx(
                                    "flex items-center gap-4 p-3 rounded-xl shadow-sm transition-all",
                                    item.isAvailable 
                                        ? "bg-white dark:bg-stone-900 border border-gray-100 dark:border-gray-800" 
                                        : "bg-gray-50 dark:bg-stone-800/40 border border-transparent opacity-70"
                                )}
                            >
                                <div className={clsx(
                                    "size-12 rounded-lg flex items-center justify-center text-2xl",
                                    item.isAvailable 
                                        ? "bg-orange-50 dark:bg-stone-800" 
                                        : "bg-gray-200 dark:bg-stone-800 grayscale"
                                )}>
                                    {ITEM_EMOJIS[item.name] || item.emoji || '🥣'}
                                </div>
                                <div className="flex-1">
                                    <p className={clsx(
                                        "text-sm font-bold",
                                        item.isAvailable 
                                            ? "text-[#181411] dark:text-white" 
                                            : "text-gray-500 dark:text-gray-400"
                                    )}>
                                        {item.name}
                                    </p>
                                    <p className={clsx(
                                        "text-xs font-medium",
                                        item.isAvailable 
                                            ? "text-green-600 dark:text-green-500" 
                                            : "text-red-500"
                                    )}>
                                        {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                                    </p>
                                </div>
                                
                                {/* Toggle Switch */}
                                <button
                                    onClick={() => handleToggleAvailability(item.id, item.isAvailable)}
                                    className={clsx(
                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                        item.isAvailable ? "bg-primary" : "bg-gray-300 dark:bg-stone-700"
                                    )}
                                >
                                    <span className={clsx(
                                        "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                                        item.isAvailable ? "translate-x-6" : "translate-x-1"
                                    )} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <p className="text-center text-gray-400 py-8">
                            {searchQuery ? 'Tidak ada item yang cocok' : 'Belum ada item'}
                        </p>
                    )}
                </div>
            )}

            <AdminBottomNav />
        </div>
    );
}
