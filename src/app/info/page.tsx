"use client";
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

export default function InfoPage() {
    return (
        <div className="pb-20 min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <TopBar title="Info Outlet" />
            
            <main className="flex-1 p-0">
                {/* Hero Image */}
                <div 
                    className="w-full h-48 bg-cover bg-center relative"
                    style={{
                         backgroundImage: `url("https://lh3.googleusercontent.com/p/AF1QipN3-uO0q-O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0")`,
                         backgroundColor: '#f47b25' 
                    }}
                >
                    <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                        <div>
                             <h1 className="text-white text-2xl font-extrabold shadow-black/50 drop-shadow-md">Seblak Teh Imas</h1>
                             <p className="text-white/80 font-medium text-sm">Prasmanan Seblak No. 1</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Location */}
                    <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                        <div className="flex items-start gap-4">
                            <div className="size-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">location_on</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#181411] dark:text-white mb-1">Lokasi Outlet</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                                    Jl. Raya Cipadung No. 15, Cibiru, Kota Bandung, Jawa Barat 40614
                                </p>
                                <Link 
                                    href="https://maps.google.com" 
                                    target="_blank"
                                    className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                                >
                                    Lihat di Google Maps
                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                        <div className="flex items-start gap-4">
                            <div className="size-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">schedule</span>
                            </div>
                            <div className="w-full">
                                <h3 className="font-bold text-[#181411] dark:text-white mb-3">Jam Operasional</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Senin - Jumat</span>
                                        <span className="font-bold text-[#181411] dark:text-white">10:00 - 21:00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Sabtu - Minggu</span>
                                        <span className="font-bold text-[#181411] dark:text-white">10:00 - 22:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                        <div className="flex items-start gap-4">
                            <div className="size-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">chat</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#181411] dark:text-white mb-1">Kontak Kami</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                                    Punya pertanyaan atau keluhan? Hubungi kami langsung via WhatsApp.
                                </p>
                                <Link 
                                    href="https://wa.me/6281234567890" 
                                    target="_blank"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#20bd5a]"
                                >
                                    <span className="material-symbols-outlined text-lg">call</span>
                                    Chat WhatsApp
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
