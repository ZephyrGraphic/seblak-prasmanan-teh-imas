"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminBottomNav } from '@/components/layout/AdminBottomNav';
import { Button } from '@/components/ui/Button';

interface StoreSettings {
    id: string;
    isOpen: boolean;
    soundNotification: boolean;
    ttsNotification: boolean;
    whatsappNumber: string;
    danaNumber: string;
    danaAccountName: string;
}

export default function SettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = useCallback(async () => {
        try {
            const response = await fetch('/api/settings');
            const result = await response.json();
            if (result.success) {
                setSettings(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSetting = async (key: keyof StoreSettings, value: boolean | string) => {
        if (!settings) return;
        
        setIsSaving(true);
        try {
            const response = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [key]: value })
            });
            
            const result = await response.json();
            
            if (result.success) {
                setSettings(result.data);
            } else {
                alert(result.error || 'Gagal menyimpan pengaturan');
            }
        } catch (error) {
            console.error('Failed to update settings:', error);
            alert('Gagal menyimpan pengaturan');
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = (key: keyof StoreSettings) => {
        if (!settings) return;
        const currentValue = settings[key] as boolean;
        updateSetting(key, !currentValue);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
             <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#e6dfdb] dark:border-[#3d2c22] p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={() => router.push('/admin')} className="material-symbols-outlined text-[#181411] dark:text-white">logout</button>
                    <h2 className="text-[#181411] dark:text-white text-lg font-bold">Pengaturan</h2>
                </div>
                {isSaving && (
                    <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                )}
            </header>

            <main className="p-4 space-y-6">
                
                {/* Store Status */}
                <section className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <h3 className="px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 font-bold text-sm text-[#8a7260] uppercase tracking-wide">
                        Status Toko
                    </h3>
                    <div className="p-4 flex items-center justify-between">
                         <div>
                            <p className="font-bold text-[#181411] dark:text-white">Buka Toko</p>
                            <p className="text-xs text-gray-500">Izinkan pelanggan membuat pesanan</p>
                         </div>
                         <button 
                            onClick={() => handleToggle('isOpen')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings?.isOpen ? 'bg-primary' : 'bg-gray-200'
                            }`}
                         >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                settings?.isOpen ? 'translate-x-5' : 'translate-x-1'
                            }`} />
                         </button>
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <h3 className="px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 font-bold text-sm text-[#8a7260] uppercase tracking-wide">
                        Notifikasi
                    </h3>
                     <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                         <div>
                            <p className="font-bold text-[#181411] dark:text-white">Suara Notifikasi</p>
                            <p className="text-xs text-gray-500">Bunyi &apos;Ting&apos; saat pesanan masuk</p>
                         </div>
                         <button 
                            onClick={() => handleToggle('soundNotification')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings?.soundNotification ? 'bg-primary' : 'bg-gray-200'
                            }`}
                         >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                settings?.soundNotification ? 'translate-x-5' : 'translate-x-1'
                            }`} />
                         </button>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                         <div>
                            <p className="font-bold text-[#181411] dark:text-white">Speak Order</p>
                            <p className="text-xs text-gray-500">Sebutkan nama pemesan (Text-to-Speech)</p>
                         </div>
                         <button 
                            onClick={() => handleToggle('ttsNotification')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings?.ttsNotification ? 'bg-primary' : 'bg-gray-200'
                            }`}
                         >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                settings?.ttsNotification ? 'translate-x-5' : 'translate-x-1'
                            }`} />
                         </button>
                    </div>
                </section>

                 {/* Contact Info */}
                <section className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <h3 className="px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 font-bold text-sm text-[#8a7260] uppercase tracking-wide">
                        Info Kontak
                    </h3>
                    <div className="p-4 space-y-3">
                         <div>
                            <p className="text-xs text-gray-500 mb-1">Nomor WhatsApp</p>
                            <p className="font-mono font-bold text-[#181411] dark:text-white">{settings?.whatsappNumber}</p>
                         </div>
                         <div>
                            <p className="text-xs text-gray-500 mb-1">Nomor DANA</p>
                            <p className="font-mono font-bold text-[#181411] dark:text-white">{settings?.danaNumber}</p>
                            <p className="text-xs text-gray-400">A/N {settings?.danaAccountName}</p>
                         </div>
                    </div>
                </section>

                <Button variant="outline" fullWidth onClick={() => router.push('/')}>
                    <span className="material-symbols-outlined mr-2">logout</span>
                    Logout
                </Button>

                <p className="text-center text-xs text-gray-400 mt-4">Seblak Teh Imas Admin v1.0.0</p>
            </main>

            <AdminBottomNav />
        </div>
    );
}
