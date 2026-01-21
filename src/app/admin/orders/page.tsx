"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminBottomNav } from "@/components/layout/AdminBottomNav";
import clsx from "clsx";

interface Order {
  id: string;
  queueNumber: string;
  customerName: string;
  diningOption: "DINE_IN" | "TAKEAWAY";
  paymentMethod: "CASH" | "TRANSFER";
  status: "PENDING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
  totalPrice: number;
  createdAt: string;
  voidedAt?: string;
  voidReason?: string;
}

// Helper to format date as YYYY-MM-DD
function formatDateParam(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Helper to format display date
function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function OrdersHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">(
    "all",
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const dateParam = formatDateParam(selectedDate);
      const response = await fetch(`/api/orders?date=${dateParam}`);
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Navigation functions
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    // Don't go beyond today
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const goToYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setSelectedDate(yesterday);
  };

  const isToday = formatDateParam(selectedDate) === formatDateParam(new Date());
  const isFutureDisabled =
    formatDateParam(selectedDate) >= formatDateParam(new Date());

  const filteredOrders = orders.filter((order) => {
    if (filter === "completed") return order.status === "COMPLETED";
    if (filter === "cancelled") return order.status === "CANCELLED";
    return true;
  });

  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const totalRevenue = completedOrders.reduce(
    (sum, o) => sum + o.totalPrice,
    0,
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-4 flex justify-between items-center">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="material-symbols-outlined text-[#181411] dark:text-white"
        >
          arrow_back_ios
        </button>
        <h2 className="text-[#181411] dark:text-white text-lg font-bold flex-1 text-center">
          Riwayat Pesanan
        </h2>
        <button onClick={fetchOrders} className="text-primary">
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </header>

      {/* Date Navigator */}
      <div className="bg-white dark:bg-stone-900 border-b border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goToPreviousDay}
            className="p-2 rounded-lg bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-300 active:scale-95"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold"
          >
            <span className="material-symbols-outlined text-lg">
              calendar_today
            </span>
            <span className="text-sm">{formatDisplayDate(selectedDate)}</span>
          </button>

          <button
            onClick={goToNextDay}
            disabled={isFutureDisabled}
            className={clsx(
              "p-2 rounded-lg active:scale-95",
              isFutureDisabled
                ? "bg-gray-50 dark:bg-stone-900 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                : "bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-300",
            )}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Date Picker Input (Hidden by default) */}
        {showDatePicker && (
          <div className="mb-3">
            <input
              type="date"
              value={formatDateParam(selectedDate)}
              max={formatDateParam(new Date())}
              onChange={(e) => {
                setSelectedDate(new Date(e.target.value));
                setShowDatePicker(false);
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-stone-800 text-[#181411] dark:text-white font-medium"
            />
          </div>
        )}

        {/* Quick Filters */}
        <div className="flex gap-2">
          <button
            onClick={goToToday}
            className={clsx(
              "px-3 py-1.5 text-xs font-bold rounded-full transition-all",
              isToday
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-400",
            )}
          >
            Hari Ini
          </button>
          <button
            onClick={goToYesterday}
            className={clsx(
              "px-3 py-1.5 text-xs font-bold rounded-full transition-all",
              formatDateParam(selectedDate) ===
                formatDateParam(new Date(Date.now() - 86400000))
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-400",
            )}
          >
            Kemarin
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4 flex gap-3">
        <div className="flex-1 bg-white dark:bg-stone-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
          <p className="text-[#8a7260] text-xs font-bold uppercase">
            Total Pesanan
          </p>
          <p className="text-2xl font-extrabold text-[#181411] dark:text-white">
            {orders.length}
          </p>
          <p className="text-xs text-gray-400">
            {completedOrders.length} selesai
          </p>
        </div>
        <div className="flex-1 bg-white dark:bg-stone-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
          <p className="text-[#8a7260] text-xs font-bold uppercase">
            Pendapatan
          </p>
          <p className="text-xl font-extrabold text-primary">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 pb-2">
        {(["all", "completed", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-4 py-2 text-sm font-bold rounded-full transition-all",
              filter === f
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-400",
            )}
          >
            {f === "all" ? "Semua" : f === "completed" ? "Selesai" : "Batal"}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">
              progress_activity
            </span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <span className="material-symbols-outlined text-5xl mb-2">
              receipt_long
            </span>
            <p>Tidak ada pesanan pada tanggal ini</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className={clsx(
                "p-4 rounded-xl border bg-white dark:bg-stone-900",
                order.status === "CANCELLED"
                  ? "border-red-200 dark:border-red-900/50 opacity-70"
                  : "border-gray-100 dark:border-gray-800",
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-[#181411] dark:text-white">
                    {order.queueNumber}
                  </p>
                  <p className="text-sm text-primary">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <span
                    className={clsx(
                      "px-2 py-1 text-[10px] font-bold uppercase rounded",
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "CANCELLED"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700",
                    )}
                  >
                    {order.status === "COMPLETED"
                      ? "Selesai"
                      : order.status === "CANCELLED"
                        ? "Batal"
                        : order.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTime(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "px-2 py-0.5 text-[10px] font-bold uppercase rounded",
                      order.paymentMethod === "CASH"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700",
                    )}
                  >
                    {order.paymentMethod === "CASH" ? "Tunai" : "Transfer"}
                  </span>
                  <span
                    className={clsx(
                      "px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-gray-100 text-gray-600",
                    )}
                  >
                    {order.diningOption === "DINE_IN" ? "Dine In" : "Takeaway"}
                  </span>
                </div>
                <p
                  className={clsx(
                    "font-mono font-bold",
                    order.status === "CANCELLED"
                      ? "text-gray-400 line-through"
                      : "text-primary",
                  )}
                >
                  Rp {order.totalPrice.toLocaleString("id-ID")}
                </p>
              </div>

              {order.voidReason && (
                <p className="text-xs text-red-500 mt-2 italic">
                  📝 {order.voidReason}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <AdminBottomNav />
    </div>
  );
}
