"use client";
import { useEffect, useState, useCallback } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useOrderStore } from "@/store/orderStore";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface OrderHistory {
  id: string;
  date: string;
  total: number;
  itemsCount: number;
  queueNumber: string;
}

interface OrderStatus {
  id: string;
  status: "PENDING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: {
    label: "Menunggu",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  PREPARING: {
    label: "Diproses",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
  },
  READY: {
    label: "Siap Ambil",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  COMPLETED: {
    label: "Selesai",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
  },
  CANCELLED: { label: "Batal", color: "text-red-700", bgColor: "bg-red-100" },
};

export default function HistoryPage() {
  const store = useOrderStore();
  const [isMounted, setIsMounted] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  // Fetch real-time statuses for recent orders
  const fetchStatuses = useCallback(async () => {
    if (store.orderHistory.length === 0) return;

    // Only check recent orders (last 10)
    const recentOrders = store.orderHistory.slice(0, 10);

    for (const order of recentOrders) {
      try {
        const response = await fetch(`/api/orders/${order.id}`);
        const result = await response.json();
        if (result.success && result.data?.status) {
          setStatuses((prev) => ({ ...prev, [order.id]: result.data.status }));
        }
      } catch (error) {
        // Silently fail for individual orders
      }
    }
  }, [store.orderHistory]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch statuses on mount and poll every 10 seconds
  useEffect(() => {
    if (!isMounted) return;

    fetchStatuses();

    const interval = setInterval(fetchStatuses, 10000);
    return () => clearInterval(interval);
  }, [isMounted, fetchStatuses]);

  if (!isMounted) return null;

  const getStatusBadge = (orderId: string) => {
    const status = statuses[orderId] || "PENDING";
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

    return (
      <span
        className={clsx(
          "text-xs px-2 py-0.5 rounded font-bold",
          config.bgColor,
          config.color,
        )}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="pb-20 min-h-screen flex flex-col">
      <TopBar title="Riwayat Pesanan" />

      <main className="flex-1 p-4 space-y-4">
        {store.orderHistory.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-20">
            <div className="size-20 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-gray-400 text-4xl">
                history
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Belum Ada Riwayat
            </h3>
            <p className="text-gray-500 mb-8 max-w-[250px]">
              Pesan seblak dulu yuk biar ada kenangan manis di sini!
            </p>
            <Link href="/order" className="w-full">
              <Button fullWidth>Pesan Sekarang</Button>
            </Link>
          </div>
        ) : (
          store.orderHistory.map((order) => (
            <Link
              key={order.id}
              href={`/receipt?queue=${encodeURIComponent(order.queueNumber)}&id=${order.id}`}
              className="block"
            >
              <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex justify-between items-center hover:shadow-md transition-shadow active:scale-[0.99]">
                <div className="flex gap-4 items-center">
                  <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
                    {order.queueNumber.split("-")[1] || "?"}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-0.5">
                      {order.date}
                    </p>
                    <p className="text-[#181411] dark:text-white font-bold">
                      {order.itemsCount} Item
                    </p>
                    {getStatusBadge(order.id)}
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className="text-primary font-bold">
                      Rp {order.total.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-400">Total Pembayaran</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">
                    chevron_right
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
}
