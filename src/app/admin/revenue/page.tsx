"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminBottomNav } from '@/components/layout/AdminBottomNav';
import jsPDF from 'jspdf';


interface RevenueData {
    date: string;
    totalRevenue: number;
    cashRevenue: number;
    transferRevenue: number;
    completedCount: number;
    pendingCount: number;
    avgTicket: number;
    hourlyTrend: { hour: string; count: number; revenue: number }[];
    popularToppings: { name: string; count: number }[];
    revenueChange: number;
}

const TOPPING_EMOJIS: Record<string, string> = {
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
};

export default function RevenuePage() {
    const router = useRouter();
    const [data, setData] = useState<RevenueData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRevenue = useCallback(async () => {
        try {
            const response = await fetch('/api/revenue');
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch revenue:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRevenue();
    }, [fetchRevenue]);

    const handleExportPDF = () => {
        if (!data) return;

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            
            // Title
            doc.setFontSize(18);
            doc.text('Seblak Teh Imas - Daily Revenue Report', pageWidth / 2, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`Date: ${new Date(data.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 30, { align: 'center' });

            // Summary (Safe Text Mode)
            let y = 50;
            doc.setFontSize(14);
            doc.text('Summary Statistics', 14, y);
            y += 10;
            doc.setFontSize(10);
            doc.text(`Total Revenue: Rp ${data.totalRevenue.toLocaleString('id-ID')}`, 14, y); y += 7;
            doc.text(`Orders Completed: ${data.completedCount}`, 14, y); y += 7;
            doc.text(`Orders Pending: ${data.pendingCount}`, 14, y); y += 7;
            doc.text(`Average Ticket: Rp ${data.avgTicket.toLocaleString('id-ID')}`, 14, y); y += 7;
            doc.text(`Revenue Growth: ${data.revenueChange >= 0 ? '+' : ''}${data.revenueChange}%`, 14, y); y += 15;

            // Payment Breakdown
            doc.setFontSize(14);
            doc.text('Payment Breakdown', 14, y);
            y += 10;
            doc.setFontSize(10);
            doc.text(`Cash: Rp ${data.cashRevenue.toLocaleString('id-ID')}`, 14, y); y += 7;
            doc.text(`Transfer (DANA/QRIS): Rp ${data.transferRevenue.toLocaleString('id-ID')}`, 14, y); y += 15;

            // Popular Toppings
            doc.setFontSize(14);
            doc.text('Top 5 Popular Toppings', 14, y);
            y += 10;
            doc.setFontSize(10);
            data.popularToppings.forEach((t, i) => {
                 doc.text(`#${i + 1} ${t.name} (${t.count} orders)`, 14, y);
                 y += 7;
            });

            // Note about table
            y += 10;
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('Note: Complete tabular data is available in the web dashboard.', 14, y);

            // Save
            doc.save(`revenue-report-${data.date}.pdf`);
        } catch (error) {
            console.error('Export PDF Error:', error);
            alert('Gagal mengexport PDF. Terjadi kesalahan pada sistem report (Safe Mode).');
        }
    };

    const maxTrendRevenue = data?.hourlyTrend?.reduce((max, h) => Math.max(max, h.revenue), 0) || 1;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-4 flex justify-between items-center">
                <button onClick={() => router.push('/admin/dashboard')} className="material-symbols-outlined text-[#181411] dark:text-white">arrow_back_ios</button>
                <h2 className="text-[#181411] dark:text-white text-lg font-bold flex-1 text-center">Daily Revenue</h2>
                <button className="p-2" onClick={fetchRevenue}>
                    <span className="material-symbols-outlined text-gray-500">calendar_today</span>
                </button>
            </header>

            <div className="flex flex-col gap-1">
                {/* Export Button */}
                <div className="px-4 pt-4">
                    <button 
                        onClick={handleExportPDF}
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-white dark:bg-stone-900 border-2 border-primary text-primary rounded-xl font-bold active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined">picture_as_pdf</span>
                        <span>Export to PDF</span>
                    </button>
                </div>

                {/* Total Revenue Card */}
                <div className="flex flex-wrap gap-3 p-4">
                    <div className="flex min-w-[100%] flex-col gap-2 rounded-xl p-6 bg-primary text-white shadow-lg shadow-primary/20">
                        <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Total Revenue Today</p>
                        <p className="text-white tracking-tight text-3xl font-bold">Rp {(data?.totalRevenue || 0).toLocaleString('id-ID')}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-sm">
                                {(data?.revenueChange || 0) >= 0 ? 'trending_up' : 'trending_down'}
                            </span>
                            <p className="text-white/90 text-sm font-medium">
                                {(data?.revenueChange || 0) >= 0 ? '+' : ''}{data?.revenueChange || 0}% from yesterday
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-5 bg-[#f5f2f0] dark:bg-stone-800">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">shopping_bag</span>
                            <p className="text-[#181411] dark:text-stone-200 text-sm font-medium">Completed</p>
                        </div>
                        <p className="text-[#181411] dark:text-white tracking-tight text-2xl font-bold">{data?.completedCount || 0}</p>
                        <p className="text-green-600 text-xs font-medium">{data?.pendingCount || 0} orders pending</p>
                    </div>
                    <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-5 bg-[#f5f2f0] dark:bg-stone-800">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">avg_pace</span>
                            <p className="text-[#181411] dark:text-stone-200 text-sm font-medium">Avg Ticket</p>
                        </div>
                        <p className="text-[#181411] dark:text-white tracking-tight text-2xl font-bold">Rp {((data?.avgTicket || 0) / 1000).toFixed(0)}k</p>
                    </div>
                </div>

                {/* Payment Breakdown */}
                <div>
                    <h3 className="text-[#181411] dark:text-white text-lg font-bold px-4 pb-2 pt-2">Payment Breakdown</h3>
                    <div className="mx-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-stone-900/50">
                        <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <span className="material-symbols-outlined text-green-600 text-xl">payments</span>
                                </div>
                                <p className="text-[#8a7260] dark:text-stone-400 text-sm font-medium">Total Cash</p>
                            </div>
                            <p className="text-[#181411] dark:text-white text-base font-bold">Rp {(data?.cashRevenue || 0).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <span className="material-symbols-outlined text-blue-600 text-xl">account_balance_wallet</span>
                                </div>
                                <p className="text-[#8a7260] dark:text-stone-400 text-sm font-medium">Total DANA</p>
                            </div>
                            <p className="text-[#181411] dark:text-white text-base font-bold">Rp {(data?.transferRevenue || 0).toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                </div>

                {/* Hourly Sales Trend */}
                <div>
                    <div className="flex items-center justify-between px-4 pb-2 pt-6">
                        <h3 className="text-[#181411] dark:text-white text-lg font-bold">Hourly Sales Trend</h3>
                        <span className="text-xs text-primary font-bold">LIVE</span>
                    </div>
                    <div className="mx-4 p-4 rounded-xl bg-[#f5f2f0] dark:bg-stone-800/50 flex items-end justify-between h-40 gap-2">
                        {data?.hourlyTrend?.map((trend) => {
                            const height = maxTrendRevenue > 0 ? (trend.revenue / maxTrendRevenue) * 100 : 10;
                            return (
                                <div key={trend.hour} className="flex flex-col items-center flex-1 gap-2">
                                    <div 
                                        className="w-full bg-primary/40 rounded-t-sm transition-all" 
                                        style={{ height: `${Math.max(height, 10)}%` }}
                                    />
                                    <p className="text-[10px] text-stone-500 font-bold">{trend.hour}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Most Popular Toppings */}
                <div>
                    <h3 className="text-[#181411] dark:text-white text-lg font-bold px-4 pb-2 pt-6">Most Popular Toppings</h3>
                    <div className="px-4 pb-8 space-y-3">
                        {data?.popularToppings?.map((topping, index) => (
                            <div key={topping.name} className="flex items-center gap-4 bg-white dark:bg-stone-900 border border-gray-100 dark:border-gray-800 p-3 rounded-xl">
                                <div className="size-12 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-2xl">
                                    {TOPPING_EMOJIS[topping.name] || '🥣'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[#181411] dark:text-white text-sm font-bold">{topping.name}</p>
                                    <p className="text-[#8a7260] dark:text-stone-400 text-xs">Used in {topping.count} orders</p>
                                </div>
                                <div className="text-right">
                                    {index === 0 ? (
                                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full">#1 TOP</span>
                                    ) : (
                                        <span className="text-[#8a7260] text-xs font-bold">#{index + 1}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {(!data?.popularToppings || data.popularToppings.length === 0) && (
                            <p className="text-center text-gray-400 py-8">Belum ada data topping</p>
                        )}
                    </div>
                </div>

                {/* Download Button */}
                <div className="px-4 pb-8">
                    <button 
                        onClick={handleExportPDF}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-all"
                    >
                        <span className="material-symbols-outlined">picture_as_pdf</span>
                        <span>Download Full Report</span>
                    </button>
                </div>
            </div>

            <AdminBottomNav />
        </div>
    );
}
