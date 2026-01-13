"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export const AdminBottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: 'dashboard', href: '/admin/dashboard' },
    { name: 'Revenue', icon: 'analytics', href: '/admin/revenue' },
    { name: 'Orders', icon: 'list_alt', href: '/admin/orders' },
    { name: 'Stock', icon: 'inventory_2', href: '/admin/stock' },
    { name: 'Admin', icon: 'settings', href: '/admin/settings' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/10 p-3 flex justify-around text-gray-400 z-50 w-full max-w-[480px] mx-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
            <Link key={item.name} href={item.href} className={clsx("flex flex-col items-center gap-1 transition-colors", isActive ? "text-primary" : "text-gray-400 hover:text-gray-600")}>
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
        )
      })}
    </div>
  );
}
