"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const result = await response.json();
            
            if (result.success) {
                router.push('/admin/dashboard');
            } else {
                setError(result.error || 'Login gagal');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Terjadi kesalahan saat login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-white dark:bg-background-dark">
             {/* Header */}
            <div className="w-full flex items-center p-4 pb-2 justify-between border-b border-gray-100 dark:border-white/10">
                <Link href="/" className="text-[#181411] dark:text-white flex size-12 shrink-0 items-center cursor-pointer">
                    <span className="material-symbols-outlined">arrow_back_ios</span>
                </Link>
                <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Admin Portal</h2>
            </div>

            <main className="w-full px-6 flex flex-col flex-1">
                <div className="flex flex-col items-center pt-12 pb-6">
                    <div className="bg-primary/10 p-4 rounded-full mb-6">
                        <span className="material-symbols-outlined text-primary text-4xl">admin_panel_settings</span>
                    </div>
                    <h1 className="text-[#181411] dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center pb-2">Owner Login</h1>
                    <p className="text-[#8a7260] dark:text-white/60 text-base font-normal leading-normal text-center">
                        Akses dashboard untuk mengelola pesanan.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <Input 
                        label="Username" 
                        placeholder="Masukkan username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                    <Input 
                        label="Password" 
                        type="password" 
                        placeholder="Masukkan password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}
                    
                    <div className="pt-8">
                        <Button type="submit" fullWidth disabled={loading}>
                            <span className="material-symbols-outlined mr-2">
                                {loading ? 'progress_activity' : 'login'}
                            </span>
                            {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
                        </Button>
                    </div>
                </form>

                <div className="mt-auto pb-12 pt-10 text-center">
                    <p className="text-[#8a7260] dark:text-white/30 text-[12px] uppercase tracking-widest font-bold">Secure Admin Access</p>

                </div>
            </main>
        </div>
    );
}
