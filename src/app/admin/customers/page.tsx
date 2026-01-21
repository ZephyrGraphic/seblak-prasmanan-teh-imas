"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { AdminBottomNav } from "@/components/layout/AdminBottomNav";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  membership: "BRONZE" | "SILVER" | "GOLD";
  totalSpent: number;
  orderCount: number;
  createdAt: string;
  _count?: { orders: number; notes: number };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const membershipColors = {
  BRONZE: "bg-amber-100 text-amber-700",
  SILVER: "bg-gray-100 text-gray-700",
  GOLD: "bg-yellow-100 text-yellow-700",
};

const membershipEmoji = {
  BRONZE: "🥉",
  SILVER: "🥈",
  GOLD: "🥇",
};

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [membershipFilter, setMembershipFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchCustomers = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
          sortBy,
          sortOrder: "desc",
        });
        if (search) params.set("search", search);
        if (membershipFilter) params.set("membership", membershipFilter);

        const response = await fetch(`/api/customers?${params}`);
        const result = await response.json();

        if (result.success) {
          setCustomers(result.data);
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [search, membershipFilter, sortBy],
  );

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      const result = await response.json();

      if (result.success) {
        setShowAddModal(false);
        setNewCustomer({ name: "", phone: "", email: "" });
        fetchCustomers();
      } else {
        setError(result.error || "Gagal menambah pelanggan");
      }
    } catch (error) {
      console.error("Failed to add customer:", error);
      setError("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#e6dfdb] dark:border-[#3d2c22] p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="material-symbols-outlined text-gray-500"
            >
              arrow_back
            </button>
            <h1 className="text-xl font-bold text-[#181411] dark:text-white">
              Pelanggan
            </h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">
              person_add
            </span>
            Tambah
          </button>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama atau telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 dark:bg-stone-800"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setMembershipFilter("")}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
              membershipFilter === ""
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
            )}
          >
            Semua
          </button>
          {(["BRONZE", "SILVER", "GOLD"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setMembershipFilter(level)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1",
                membershipFilter === level
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
              )}
            >
              {membershipEmoji[level]} {level}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      {pagination && (
        <div className="px-4 pb-2">
          <p className="text-sm text-gray-500">
            Total{" "}
            <span className="font-bold text-primary">{pagination.total}</span>{" "}
            pelanggan
          </p>
        </div>
      )}

      {/* Customer List */}
      <main className="px-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">
              progress_activity
            </span>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">
              group_off
            </span>
            <p className="text-gray-500">Belum ada pelanggan terdaftar</p>
            <p className="text-gray-400 text-sm">
              Klik tombol "Tambah" untuk menambahkan pelanggan
            </p>
          </div>
        ) : (
          customers.map((customer) => (
            <Link
              key={customer.id}
              href={`/admin/customers/${customer.id}`}
              className="block bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-[#181411] dark:text-white">
                      {customer.name}
                    </h3>
                    <span
                      className={clsx(
                        "px-2 py-0.5 text-[10px] font-bold uppercase rounded",
                        membershipColors[customer.membership],
                      )}
                    >
                      {membershipEmoji[customer.membership]}{" "}
                      {customer.membership}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {customer.phone}
                  </p>
                </div>
                <span className="material-symbols-outlined text-gray-400">
                  chevron_right
                </span>
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">
                    Total Belanja
                  </p>
                  <p className="text-primary font-bold">
                    {formatCurrency(customer.totalSpent)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">
                    Jumlah Order
                  </p>
                  <p className="font-bold text-[#181411] dark:text-white">
                    {customer.orderCount}x
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 py-4">
            <button
              onClick={() => fetchCustomers(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 text-sm text-gray-500">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchCustomers(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center">
          <div className="bg-white dark:bg-stone-900 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#181411] dark:text-white">
                Tambah Pelanggan
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2">
                <span className="material-symbols-outlined text-gray-500">
                  close
                </span>
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  placeholder="Nama pelanggan"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  placeholder="email@contoh.com"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 dark:bg-stone-800"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-sm active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Pelanggan"}
              </button>
            </form>
          </div>
        </div>
      )}

      <AdminBottomNav />
    </div>
  );
}
