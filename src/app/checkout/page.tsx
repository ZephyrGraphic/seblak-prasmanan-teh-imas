"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useOrderStore, DRINKS_PRICE } from '@/store/orderStore';
import clsx from 'clsx';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const store = useOrderStore();
    const [isMounted, setIsMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastQueueNumber, setLastQueueNumber] = useState<string | null>(null);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSubmitOrder = async () => {
        if (!store.customerName) {
            alert("Mohon isi nama pemesan!");
            return;
        }

        // Validate minimum order (excluding drinks)
        const foodTotal = store.bowls.reduce((sum, bowl) => sum + bowl.price, 0);
        if (foodTotal < 10000) {
            alert("Minimal pembelian seblak prasmanan adalah Rp 10.000 (tidak termasuk minuman).\nSilakan tambah topping lagi ya kak!");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Submit order to API
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: store.customerName,
                    diningOption: store.diningOption,
                    paymentMethod: store.paymentMethod,
                    specialRequest: store.specialRequest,
                    bowls: store.bowls,
                    drinks: store.drinks,
                    totalPrice: store.getTotalPrice()
                })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Gagal membuat pesanan');
            }
            
            const order = result.data;
            const queueNumber = order.queueNumber;
            setLastQueueNumber(queueNumber);
            
            // Create WhatsApp message
            const text = [
                `*Pesanan Baru Seblak Teh Imas*`,
                `No. Antrian: ${queueNumber}`,
                `Nama: ${store.customerName}`,
                `Tipe: ${store.diningOption}`,
                `Pembayaran: ${store.paymentMethod.toUpperCase()}`,
                `----------------`,
                ...store.bowls.map((b, i) => {
                    return `*Bowl #${i+1}*` +
                    `\n   Level: ${b.levelPedas}` +
                    `\n   Kuah: ${b.kuah}` +
                    `\n   Rasa: ${b.rasa}` +
                    `\n   Opsi: ${b.telur}, ${b.sayur}` +
                    b.toppings.map(t => `\n   + ${t}`).join('') +
                    `\n   Harga: Rp ${b.price.toLocaleString('id-ID')}`;
                }),
                `----------------`,
                store.drinks.length > 0 ? `*Minuman:*` : '',
                ...store.drinks.map(d => `   ${d.quantity}x ${d.name}`),
                `----------------`,
                store.specialRequest ? `Catatan: ${store.specialRequest}\n` : '',
                `*TOTAL: Rp ${store.getTotalPrice().toLocaleString('id-ID')}*`,
                `----------------`,
                `Mohon diproses ya teh!`
            ].filter(Boolean).join('\n');
            
            // Save to local history with real queue number
            store.addToHistory({
                id: order.id,
                date: new Date().toLocaleDateString('id-ID'),
                total: store.getTotalPrice(),
                itemsCount: store.bowls.length + store.drinks.reduce((acc, d) => acc + d.quantity, 0),
                queueNumber: queueNumber
            });

            // Open WhatsApp
            window.open(`https://wa.me/6281574627052?text=${encodeURIComponent(text)}`, '_blank');
            
            // Clear order and navigate to receipt
            store.clearOrder();
            router.push(`/receipt?queue=${encodeURIComponent(queueNumber)}&id=${order.id}`);
            
        } catch (error) {
            console.error('Order submission error:', error);
            alert(error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat pesanan');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isMounted) return null;

    if (store.bowls.length === 0 && store.drinks.length === 0) {
        return (
             <div className="min-h-screen flex flex-col">
                <TopBar title="Checkout" showBack />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">shopping_cart_off</span>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Keranjang Kosong</h3>
                    <p className="text-gray-500 mb-8">Belum ada seblak yang diracik nih.</p>
                    <Link href="/order" className="w-full">
                        <Button fullWidth>Racik Seblak</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-40">
            <TopBar title="Checkout" showBack />
            
            <main className="flex-1 p-4 space-y-6">
                
                {/* Customer Info */}
                <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 space-y-4">
                     <h3 className="text-[#181411] dark:text-white font-bold text-lg">Data Pemesan</h3>
                     <Input 
                        placeholder="Nama Pemesan" 
                        value={store.customerName} 
                        onChange={(e) => store.setCustomerName(e.target.value)}
                        className="font-bold"
                     />
                     
                     <div className="flex bg-gray-100 dark:bg-white/10 rounded-xl p-1">
                        {['Dine-in', 'Takeaway'].map((opt) => (
                             <button
                                key={opt}
                                onClick={() => store.setDiningOption(opt as any)}
                                className={clsx(
                                    "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                                    store.diningOption === opt
                                        ? "bg-white dark:bg-background-dark text-primary shadow-sm"
                                        : "text-gray-500"
                                )}
                             >
                                 {opt}
                             </button>
                        ))}
                     </div>
                </div>

                {/* Bowls List */}
                <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <h3 className="text-[#181411] dark:text-white font-bold text-lg">Pesanan Seblak</h3>
                        <Link href="/order" className="text-primary text-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Tambah
                        </Link>
                     </div>
                     
                     {store.bowls.map((bowl, idx) => (
                         <div key={bowl.id || idx} className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 relative">
                             <button 
                                onClick={() => store.removeBowl(bowl.id)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                             >
                                <span className="material-symbols-outlined">delete</span>
                             </button>
                             
                             <div className="flex gap-4">
                                <div className="size-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                     <span className="material-symbols-outlined text-primary text-3xl">soup_kitchen</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#181411] dark:text-white">Seblak Custom #{idx+1}</h4>
                                    <div className="text-xs text-[#8a7260] mt-1 space-y-0.5">
                                        <p><span className="font-bold">Level:</span> {bowl.levelPedas}</p>
                                        <p><span className="font-bold">Kuah:</span> {bowl.kuah} • {bowl.rasa}</p>
                                        <p>{bowl.telur} • {bowl.sayur}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        <span className="font-bold text-black dark:text-gray-300">Topping: </span>
                                        {bowl.toppings.join(', ')}
                                    </p>
                                    <p className="text-primary font-mono font-bold mt-2">
                                        Rp {bowl.price.toLocaleString('id-ID')}
                                    </p>
                                </div>
                             </div>
                         </div>
                     ))}
                </div>

                {/* Drinks */}
                <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                    <h3 className="text-[#181411] dark:text-white font-bold text-lg mb-4">Minuman</h3>
                    <div className="space-y-4">
                        {Object.entries(DRINKS_PRICE).map(([name, price]) => {
                            const currentQty = store.drinks.find(d => d.name === name)?.quantity || 0;
                            return (
                                <div key={name} className="flex items-center justify-between">
                                    <div className="flex gap-3 items-center">
                                        <div className="size-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined">local_drink</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{name}</p>
                                            <p className="text-xs text-gray-500">Rp {price.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 rounded-full p-1">
                                        <button 
                                            onClick={() => store.updateDrink(name, price, -1)}
                                            className="size-7 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-primary shadow-sm disabled:opacity-50"
                                            disabled={currentQty === 0}
                                        >
                                            <span className="material-symbols-outlined text-sm">remove</span>
                                        </button>
                                        <span className="w-4 text-center text-sm font-bold">{currentQty}</span>
                                        <button 
                                            onClick={() => store.updateDrink(name, price, 1)}
                                            className="size-7 bg-primary rounded-full flex items-center justify-center text-white shadow-sm"
                                        >
                                            <span className="material-symbols-outlined text-sm">add</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 space-y-4">
                    <h3 className="text-[#181411] dark:text-white font-bold text-lg">Metode Pembayaran</h3>
                    <div className="flex flex-col gap-3">
                        {['Cash', 'Transfer'].map((method) => (
                             <label key={method} className={clsx(
                                 "flex items-center gap-4 rounded-xl border p-[15px] cursor-pointer transition-all",
                                 store.paymentMethod === method
                                     ? "border-primary bg-primary/5"
                                     : "border-gray-200 dark:border-white/10"
                             )}>
                                 <span className={clsx(
                                     "flex size-5 rounded-full border items-center justify-center",
                                     store.paymentMethod === method ? "border-primary" : "border-gray-300"
                                 )}>
                                     {store.paymentMethod === method && <span className="size-2.5 rounded-full bg-primary" />}
                                 </span>
                                 <input 
                                    type="radio" 
                                    name="payment" 
                                    className="hidden" 
                                    checked={store.paymentMethod === method} 
                                    onChange={() => store.setPaymentMethod(method as any)}
                                 />
                                 <div className="flex-1 flex items-center gap-2">
                                     <span className="material-symbols-outlined text-primary">
                                        {method === 'Cash' ? 'payments' : 'account_balance_wallet'}
                                     </span>
                                     <span className="font-bold text-[#181411] dark:text-white">{method === 'Cash' ? 'Tunai (Bayar di Tempat)' : 'Transfer DANA'}</span>
                                 </div>
                             </label>
                        ))}
                    </div>

                    {store.paymentMethod === 'Transfer' && (
                        <div className="p-4 bg-primary/5 border border-dashed border-primary/40 rounded-xl flex flex-col items-center text-center">
                            <span className="text-primary font-bold mb-1">DANA Transfer</span>
                            <p className="text-xl font-mono font-bold text-[#181411] dark:text-white mb-1">0812-3456-7890</p>
                            <p className="text-xs text-[#8a7260]">A/N TEH IMAS</p>
                            <p className="text-xs italic text-gray-500 mt-2">*Jgn lupa upload bukti transfer via WhatsApp</p>
                        </div>
                    )}
                </div>

                {/* Note */}
                <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                    <h3 className="text-[#181411] dark:text-white font-bold text-sm mb-2">Catatan Tambahan</h3>
                    <textarea 
                        className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl text-sm p-3 focus:ring-1 focus:ring-primary h-24"
                        placeholder="Contoh: Jangan pakai seledri, kuah dipisah..."
                        value={store.specialRequest}
                        onChange={(e) => store.setSpecialRequest(e.target.value)}
                    ></textarea>
                </div>
            </main>

            {/* Sticky Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/10 z-50 max-w-[480px] mx-auto">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 font-bold">Total</span>
                    <span className="text-2xl font-extrabold text-primary">Rp {store.getTotalPrice().toLocaleString('id-ID')}</span>
                </div>
                
                <Button onClick={handleSubmitOrder} fullWidth disabled={isSubmitting} className="bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[#25d366]/20">
                    <span className="material-symbols-outlined mr-2">{isSubmitting ? 'hourglass_empty' : 'chat'}</span>
                    {isSubmitting ? 'Memproses...' : 'Konfirmasi Pesanan'}
                </Button>
            </div>
        </div>
    );
}
