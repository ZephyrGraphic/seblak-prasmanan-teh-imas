"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import clsx from "clsx";
import { AdminBottomNav } from "@/components/layout/AdminBottomNav";

interface OrderItem {
  id: string;
  levelPedas: string;
  kuah: string;
  rasa: string;
  telur: string;
  sayur: string;
  toppings: string[];
  price: number;
}

interface OrderDrink {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  queueNumber: string;
  customerName: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
  drinks: OrderDrink[];
}

interface CustomerNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  membership: "BRONZE" | "SILVER" | "GOLD";
  totalSpent: number;
  orderCount: number;
  createdAt: string;
  notes: CustomerNote[];
  orders: Order[];
}

const membershipColors = {
  BRONZE: "bg-amber-100 text-amber-700 border-amber-300",
  SILVER: "bg-gray-100 text-gray-700 border-gray-300",
  GOLD: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const membershipEmoji = {
  BRONZE: "🥉",
  SILVER: "🥈",
  GOLD: "🥇",
};

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "notes">("orders");
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    membership: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const fetchCustomer = useCallback(async () => {
    try {
      const response = await fetch(`/api/customers/${id}`);
      const result = await response.json();

      if (result.success) {
        setCustomer(result.data);
        setEditForm({
          name: result.data.name,
          phone: result.data.phone,
          email: result.data.email || "",
          membership: result.data.membership,
        });
      } else {
        setError(result.error || "Pelanggan tidak ditemukan");
      }
    } catch (error) {
      console.error("Failed to fetch customer:", error);
      setError("Gagal memuat data pelanggan");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsAddingNote(true);

    try {
      const response = await fetch(`/api/customers/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });

      const result = await response.json();

      if (result.success) {
        setNewNote("");
        fetchCustomer();
      }
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();

      if (result.success) {
        setShowEditModal(false);
        fetchCustomer();
      } else {
        setError(result.error || "Gagal mengupdate pelanggan");
      }
    } catch (error) {
      console.error("Failed to update customer:", error);
      setError("Terjadi kesalahan");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (
      !confirm(
        "Yakin ingin menghapus pelanggan ini? Aksi ini tidak dapat dibatalkan.",
      )
    )
      return;

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        router.push("/admin/customers");
      } else {
        alert(result.error || "Gagal menghapus pelanggan");
      }
    } catch (error) {
      console.error("Failed to delete customer:", error);
      alert("Gagal menghapus pelanggan");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">
          progress_activity
        </span>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
          person_off
        </span>
        <p className="text-gray-500 text-lg">
          {error || "Pelanggan tidak ditemukan"}
        </p>
        <button
          onClick={() => router.push("/admin/customers")}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg"
        >
          Kembali
        </button>
      </div>
    );
  }

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
              Detail Pelanggan
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 bg-gray-100 rounded-lg"
            >
              <span className="material-symbols-outlined text-gray-600">
                edit
              </span>
            </button>
            <button
              onClick={handleDeleteCustomer}
              className="p-2 bg-red-100 rounded-lg"
            >
              <span className="material-symbols-outlined text-red-600">
                delete
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Customer Profile Card */}
      <section className="p-4">
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">
                  {membershipEmoji[customer.membership]}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#181411] dark:text-white">
                  {customer.name}
                </h2>
                <p className="text-gray-500">{customer.phone}</p>
                {customer.email && (
                  <p className="text-sm text-gray-400">{customer.email}</p>
                )}
              </div>
            </div>
            <span
              className={clsx(
                "px-3 py-1 text-sm font-bold uppercase rounded-full border",
                membershipColors[customer.membership],
              )}
            >
              {customer.membership}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
            <div className="text-center">
              <p className="text-[10px] uppercase text-gray-400 font-bold">
                Total Belanja
              </p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(customer.totalSpent)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase text-gray-400 font-bold">
                Total Order
              </p>
              <p className="text-xl font-bold text-[#181411] dark:text-white">
                {customer.orderCount}x
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Member sejak {formatDate(customer.createdAt)}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("orders")}
            className={clsx(
              "flex-1 py-2 rounded-lg text-sm font-bold transition-colors",
              activeTab === "orders"
                ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                : "text-gray-500",
            )}
          >
            Riwayat Order ({customer.orders.length})
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={clsx(
              "flex-1 py-2 rounded-lg text-sm font-bold transition-colors",
              activeTab === "notes"
                ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                : "text-gray-500",
            )}
          >
            Catatan ({customer.notes.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <main className="p-4 space-y-3">
        {activeTab === "orders" ? (
          customer.orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-gray-300 text-5xl mb-3">
                receipt_long
              </span>
              <p className="text-gray-500">Belum ada riwayat order</p>
            </div>
          ) : (
            customer.orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[#181411] dark:text-white">
                      {order.queueNumber}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {formatCurrency(order.totalPrice)}
                    </p>
                    <span
                      className={clsx(
                        "text-[10px] px-2 py-0.5 rounded uppercase font-bold",
                        order.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-dashed border-gray-100 dark:border-white/10 text-xs text-gray-500">
                  {order.items.length} bowl,{" "}
                  {order.items.reduce(
                    (acc, item) => acc + item.toppings.length,
                    0,
                  )}{" "}
                  topping
                  {order.drinks.length > 0 &&
                    `, ${order.drinks.reduce((acc, d) => acc + d.quantity, 0)} minuman`}
                </div>
              </div>
            ))
          )
        ) : (
          <>
            {/* Add Note Form */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah catatan..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:bg-stone-800"
              />
              <button
                onClick={handleAddNote}
                disabled={isAddingNote || !newNote.trim()}
                className="px-4 py-2 bg-primary text-white rounded-xl font-bold disabled:opacity-50"
              >
                {isAddingNote ? "..." : "Tambah"}
              </button>
            </div>

            {customer.notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="material-symbols-outlined text-gray-300 text-5xl mb-3">
                  note
                </span>
                <p className="text-gray-500">Belum ada catatan</p>
              </div>
            ) : (
              customer.notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-4"
                >
                  <p className="text-[#181411] dark:text-white">
                    {note.content}
                  </p>
                  <div className="mt-2 flex justify-between text-xs text-gray-400">
                    <span>oleh {note.createdBy}</span>
                    <span>{formatDate(note.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center">
          <div className="bg-white dark:bg-stone-900 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#181411] dark:text-white">
                Edit Pelanggan
              </h3>
              <button onClick={() => setShowEditModal(false)} className="p-2">
                <span className="material-symbols-outlined text-gray-500">
                  close
                </span>
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Telepon
                </label>
                <input
                  type="tel"
                  required
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Membership
                </label>
                <select
                  value={editForm.membership}
                  onChange={(e) =>
                    setEditForm({ ...editForm, membership: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:bg-stone-800"
                >
                  <option value="BRONZE">🥉 Bronze</option>
                  <option value="SILVER">🥈 Silver</option>
                  <option value="GOLD">🥇 Gold</option>
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl disabled:opacity-50"
              >
                {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          </div>
        </div>
      )}

      <AdminBottomNav />
    </div>
  );
}
