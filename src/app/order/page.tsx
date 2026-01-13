"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useOrderStore, TOPPINGS_PRICE } from '@/store/orderStore';
import clsx from 'clsx';
import { TopBar } from '@/components/layout/TopBar';

export default function OrderPage() {
    const router = useRouter();
    const store = useOrderStore();
    const [isMounted, setIsMounted] = useState(false);

    // Form Local State
    const [levelPedas, setLevelPedas] = useState('Sedang');
    const [kuah, setKuah] = useState('Sedang');
    const [rasa, setRasa] = useState('Gurih');
    const [telur, setTelur] = useState('Telur Utuh');
    const [sayur, setSayur] = useState('Sayur');
    const [toppings, setToppings] = useState<string[]>([]);
    const [tempRequest, setTempRequest] = useState('');

    const [isStoreOpen, setIsStoreOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        
        // Fetch store settings
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setIsStoreOpen(data.data.isOpen);
                }
            })
            .catch(err => console.error('Failed to fetch settings:', err))
            .finally(() => setIsLoading(false));
    }, []);

    if (!isMounted || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            </div>
        );
    }

    if (!isStoreOpen) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 text-center">
                <div className="size-24 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl text-gray-400">storefront</span>
                </div>
                <h1 className="text-2xl font-extrabold text-[#181411] dark:text-white mb-2">Toko Sedang Tutup</h1>
                <p className="text-gray-500 max-w-xs mx-auto mb-8">
                    Maaf, Seblak Teh Imas sedang tidak menerima pesanan saat ini. Silakan kembali lagi nanti.
                </p>
                <Button onClick={() => router.push('/')} variant="outline">
                    Kembali ke Beranda
                </Button>
            </div>
        );
    }

    const calculatePrice = () => {
        let total = 0;
        toppings.forEach(t => {
            total += (TOPPINGS_PRICE[t] || 2000);
        });
        return total;
    };

    const handleToppingToggle = (topping: string) => {
        if (toppings.includes(topping)) {
            setToppings(toppings.filter(t => t !== topping));
        } else {
            setToppings([...toppings, topping]);
        }
    };

    const handleSubmit = () => {
        if (toppings.length === 0) {
            alert("Pilih minimal satu topping!");
            return;
        }
        if (!store.customerName) {
            alert("Mohon isi Nama Anda di bagian atas form.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        store.addBowl({
            levelPedas,
            kuah,
            rasa,
            telur,
            sayur,
            toppings,
            price: calculatePrice(),
        });

        if (tempRequest) {
            store.setSpecialRequest(tempRequest);
        }

        router.push('/checkout');
    };

    if (!isMounted) return null;

    return (
        <div className="pb-32 min-h-screen bg-background-light dark:bg-background-dark">
            <TopBar title="Racik Seblak" showBack />

            <div className="max-w-[480px] mx-auto p-4 space-y-4">
                
                {/* Header Card */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                             <span className="material-symbols-outlined text-3xl text-primary">edit_note</span>
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-[#181411] dark:text-white">Formulir Pesanan</h1>
                            <p className="text-sm text-[#8a7260] dark:text-gray-400">Isi detail seblakmu di sini</p>
                        </div>
                    </div>

                    {/* Identity Section */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                             <label className="text-xs font-bold uppercase tracking-wider text-[#8a7260] dark:text-gray-400">Nama Pemesan</label>
                             <input 
                                type="text" 
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300 placeholder:font-normal"
                                placeholder="Ketik nama kamu..."
                                value={store.customerName}
                                onChange={(e) => store.setCustomerName(e.target.value)}
                            />
                        </div>

                        <div className="flex bg-gray-50 dark:bg-black/20 p-1 rounded-xl">
                             {['Bungkus', 'Makan Ditempat'].map((opt) => (
                                 <button
                                     key={opt}
                                     onClick={() => store.setDiningOption(opt === 'Bungkus' ? 'Takeaway' : 'Dine-in')}
                                     className={clsx(
                                         "flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                                         store.diningOption === (opt === 'Bungkus' ? 'Takeaway' : 'Dine-in') 
                                            ? "bg-white dark:bg-white/10 text-primary shadow-sm" 
                                            : "text-gray-400 hover:text-gray-600"
                                     )}
                                 >
                                     {store.diningOption === (opt === 'Bungkus' ? 'Takeaway' : 'Dine-in') && (
                                         <span className="material-symbols-outlined text-lg">check_circle</span>
                                     )}
                                     {opt}
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Level Pedas */}
                    <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10">
                        <h3 className="font-bold text-[#181411] dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">local_fire_department</span>
                            Level Pedas
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {['Tidak Pedas', 'Sedang', 'Pedas', 'Extra Pedas'].map((opt) => (
                                <label key={opt} className={clsx(
                                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                                    levelPedas === opt 
                                        ? "border-primary bg-primary/5 text-primary" 
                                        : "border-gray-100 dark:border-white/5 hover:bg-gray-50"
                                )}>
                                    <div className={clsx(
                                        "size-5 rounded-full border flex items-center justify-center",
                                        levelPedas === opt ? "border-primary" : "border-gray-300"
                                    )}>
                                          {levelPedas === opt && <div className="size-2.5 rounded-full bg-primary" />}
                                    </div>
                                    <input type="radio" name="level" className="hidden" checked={levelPedas === opt} onChange={() => setLevelPedas(opt)} />
                                    <span className="text-sm font-bold">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         {/* Kuah */}
                        <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10">
                            <h3 className="font-bold text-[#181411] dark:text-white mb-4 text-sm">Kuah</h3>
                             <div className="space-y-2">
                                {['Nyemek', 'Sedang', 'Banyak'].map((opt) => (
                                    <label key={opt} className={clsx(
                                        "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all",
                                        kuah === opt ? "bg-primary/5 text-primary font-bold" : "text-gray-600 hover:bg-gray-50"
                                    )}>
                                        <span className="text-sm">{opt}</span>
                                        <input type="radio" name="kuah" className="hidden" checked={kuah === opt} onChange={() => setKuah(opt)} />
                                        {kuah === opt && <span className="material-symbols-outlined text-base">check</span>}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Rasa */}
                        <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10">
                            <h3 className="font-bold text-[#181411] dark:text-white mb-4 text-sm">Rasa</h3>
                             <div className="space-y-2">
                                {['Asin', 'Gurih', 'Manis', 'Gurih Manis', 'Asin Manis'].map((opt) => (
                                    <label key={opt} className={clsx(
                                        "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all",
                                        rasa === opt ? "bg-primary/5 text-primary font-bold" : "text-gray-600 hover:bg-gray-50"
                                    )}>
                                        <span className="text-sm text-nowrap">{opt}</span>
                                        <input type="radio" name="rasa" className="hidden" checked={rasa === opt} onChange={() => setRasa(opt)} />
                                        {rasa === opt && <span className="material-symbols-outlined text-base">check</span>}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pre-Options (Telur & Sayur) */}
                     <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10 space-y-6">
                         <div>
                            <h3 className="font-bold text-[#181411] dark:text-white mb-3 text-sm">Opsi Telur</h3>
                            <div className="flex gap-2">
                                {['Telur Utuh', 'Telur Orak Arik'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setTelur(opt)}
                                        className={clsx(
                                            "flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all",
                                            telur === opt 
                                                ? "border-primary bg-primary text-white shadow-primary/30 shadow-lg" 
                                                : "border-gray-200 text-gray-500 bg-gray-50 hover:bg-white"
                                        )}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#181411] dark:text-white mb-3 text-sm">Opsi Sayur</h3>
                             <div className="flex gap-2">
                                {['Sayur', 'Tanpa Sayur'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setSayur(opt)}
                                        className={clsx(
                                            "flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all",
                                            sayur === opt 
                                                ? "border-primary bg-primary text-white shadow-primary/30 shadow-lg" 
                                                : "border-gray-200 text-gray-500 bg-gray-50 hover:bg-white"
                                        )}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toppings Section */}
                <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10">
                    <h3 className="font-bold text-[#181411] dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">shopping_basket</span>
                        Pilih Topping
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                            {Object.keys(TOPPINGS_PRICE).map((name) => (
                            <label key={name} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-xl transition-all group">
                                <div className="flex items-center gap-3">
                                        <div className={clsx(
                                        "size-6 border rounded-lg flex items-center justify-center transition-all",
                                        toppings.includes(name) ? "bg-primary border-primary" : "border-gray-300 bg-white"
                                    )}>
                                        {toppings.includes(name) && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden"
                                        checked={toppings.includes(name)}
                                        onChange={() => handleToppingToggle(name)}
                                    />
                                    <span className={clsx("text-sm font-medium transition-colors", toppings.includes(name) ? "text-[#181411] font-bold" : "text-gray-600")}>{name}</span>
                                </div>
                                <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-primary">
                                    Rp {TOPPINGS_PRICE[name].toLocaleString('id-ID')}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Request */}
                <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10">
                    <h3 className="font-bold text-[#181411] dark:text-white mb-3 text-sm">Catatan Khusus <span className="font-normal text-gray-400">(Opsional)</span></h3>
                    <textarea 
                        className="w-full bg-gray-50 dark:bg-black/20 border-none rounded-xl text-sm p-4 focus:ring-2 focus:ring-primary h-24 placeholder:text-gray-400 resize-none"
                        placeholder="Contoh: Kuah dipisah ya teh..."
                        value={tempRequest}
                        onChange={(e) => setTempRequest(e.target.value)}
                    ></textarea>
                </div>

                    {/* Footer Price Estimate */}
                <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10 flex justify-between items-center shadow-lg shadow-gray-200/50">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Estimasi Harga</p>
                        <p className="text-3xl font-extrabold text-[#181411] dark:text-white tracking-tight">Rp {calculatePrice().toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-right">
                         <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{toppings.length} Topping</span>
                    </div>
                </div>

            </div>

                {/* Sticky Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/10 z-50 max-w-[480px] mx-auto">
                <Button onClick={handleSubmit} fullWidth className="shadow-xl shadow-primary/20">
                    Simpan ke Keranjang
                </Button>
            </div>
        </div>
    );
}
