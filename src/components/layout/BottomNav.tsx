"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export const BottomNav = () => {
  const pathname = usePathname();

  // Hide bottom nav on specific routes if needed (e.g. admin dashboard has its own nav)
  if (pathname.startsWith('/admin')) return null;

  const navItems = [
    { name: 'Home', icon: 'home', href: '/' },
    { name: 'Receipts', icon: 'receipt_long', href: '/receipts' }, // Changed Orders to Receipts for guest context
    { name: 'Info', icon: 'info', href: '/info' },
  ];
  
  return (
    <div className="border-t border-zinc-100 dark:border-zinc-800 flex justify-around items-center py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md fixed bottom-0 left-0 right-0 z-40 w-full md:max-w-xl lg:max-w-2xl mx-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
            <Link key={item.name} href={item.href} className={clsx("flex flex-col items-center gap-1 transition-colors", isActive ? "text-primary" : "text-zinc-400 hover:text-zinc-600")}>
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
        )
      })}
    </div>
  );
}
