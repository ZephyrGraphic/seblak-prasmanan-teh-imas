"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminBottomNav } from "@/components/layout/AdminBottomNav";
import clsx from "clsx";

interface StockItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  category: "topping" | "drink" | "other";
  stock: number;
  status: "OK" | "LOW" | "OUT";
  isAvailable: boolean;
  emoji?: string;
}

interface StockStats {
  total: number;
  lowStock: number;
  outOfStock: number;
}

// Form data for creating/editing items
interface ItemFormData {
  name: string;
  unit: string;
  price: number;
  category: "topping" | "drink" | "other";
  emoji: string;
}

const CATEGORY_OPTIONS = [
  { value: "topping", label: "Topping", icon: "🥣" },
  { value: "drink", label: "Minuman", icon: "🥤" },
  { value: "other", label: "Lainnya", icon: "📦" },
];

const POPULAR_EMOJIS = [
  "🥟",
  "🍜",
  "🥚",
  "🌭",
  "🍡",
  "🍗",
  "🍝",
  "🍄",
  "🥬",
  "🥤",
  "🧃",
  "🍵",
];

export default function StockPage() {
  const router = useRouter();
  const [items, setItems] = useState<StockItem[]>([]);
  const [stats, setStats] = useState<StockStats>({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "topping" | "drink" | "other"
  >("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<StockItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    unit: "pcs",
    price: 1000,
    category: "topping",
    emoji: "🥣",
  });

  const fetchStock = useCallback(async () => {
    try {
      const response = await fetch("/api/stock");
      const result = await response.json();
      if (result.success) {
        setItems(result.data);
        setStats(result.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stock:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  // Toggle availability
  const handleToggleAvailability = async (
    id: string,
    currentValue: boolean,
  ) => {
    try {
      const response = await fetch(`/api/stock/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !currentValue }),
      });

      const result = await response.json();

      if (result.success) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isAvailable: !currentValue } : item,
          ),
        );
      } else {
        alert(result.error || "Gagal mengupdate status");
      }
    } catch (error) {
      console.error("Failed to toggle availability:", error);
      alert("Gagal mengupdate status");
    }
  };

  // Add new item
  const handleAddItem = async () => {
    if (!formData.name.trim()) {
      alert("Nama item harus diisi!");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          unit: formData.unit,
          price: formData.price,
          category: formData.category,
          emoji: formData.emoji,
          stock: 1, // Default available
          isAvailable: true,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowAddModal(false);
        resetForm();
        fetchStock();
      } else {
        alert(result.error || "Gagal menambahkan item");
      }
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Gagal menambahkan item");
    } finally {
      setIsSaving(false);
    }
  };

  // Edit item
  const handleEditItem = async () => {
    if (!editingItem || !formData.name.trim()) {
      alert("Nama item harus diisi!");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/stock/${editingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          unit: formData.unit,
          price: formData.price,
          category: formData.category,
          emoji: formData.emoji,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowEditModal(false);
        setEditingItem(null);
        resetForm();
        fetchStock();
      } else {
        alert(result.error || "Gagal mengupdate item");
      }
    } catch (error) {
      console.error("Failed to edit item:", error);
      alert("Gagal mengupdate item");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete item
  const handleDeleteItem = async () => {
    if (!deletingItem) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/stock/${deletingItem.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setShowDeleteModal(false);
        setDeletingItem(null);
        fetchStock();
      } else {
        alert(result.error || "Gagal menghapus item");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Gagal menghapus item");
    } finally {
      setIsSaving(false);
    }
  };

  // Open edit modal
  const openEditModal = (item: StockItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      unit: item.unit,
      price: item.price || 1000,
      category: item.category || "topping",
      emoji: item.emoji || "🥣",
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (item: StockItem) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      unit: "pcs",
      price: 1000,
      category: "topping",
      emoji: "🥣",
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const availableCount = items.filter((i) => i.isAvailable).length;

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
          Stock Management
        </h2>
        <button onClick={fetchStock} className="text-primary">
          <span className="material-symbols-outlined">sync</span>
        </button>
      </header>

      {/* Search & Filter */}
      <div className="px-4 py-3 bg-white dark:bg-background-dark space-y-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-stone-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Cari item..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterCategory("all")}
            className={clsx(
              "px-3 py-1.5 text-xs font-bold rounded-full transition-all",
              filterCategory === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-400",
            )}
          >
            Semua
          </button>
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.value}
              onClick={() =>
                setFilterCategory(cat.value as "topping" | "drink" | "other")
              }
              className={clsx(
                "px-3 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1",
                filterCategory === cat.value
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-400",
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">
            progress_activity
          </span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-4 mt-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Items ({filteredItems.length}) • {availableCount} Tersedia
            </p>
          </div>

          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={clsx(
                  "flex items-center gap-4 p-3 rounded-xl shadow-sm transition-all",
                  item.isAvailable
                    ? "bg-white dark:bg-stone-900 border border-gray-100 dark:border-gray-800"
                    : "bg-gray-50 dark:bg-stone-800/40 border border-transparent opacity-70",
                )}
              >
                <div
                  className={clsx(
                    "size-12 rounded-lg flex items-center justify-center text-2xl",
                    item.isAvailable
                      ? "bg-orange-50 dark:bg-stone-800"
                      : "bg-gray-200 dark:bg-stone-800 grayscale",
                  )}
                >
                  {item.emoji || "🥣"}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={clsx(
                      "text-sm font-bold truncate",
                      item.isAvailable
                        ? "text-[#181411] dark:text-white"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary">
                      Rp {(item.price || 0).toLocaleString("id-ID")}
                    </span>
                    <span
                      className={clsx(
                        "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                        item.isAvailable
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500",
                      )}
                    >
                      {item.isAvailable ? "Ready" : "Habis"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-stone-800 text-gray-500 hover:text-primary active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">
                      edit
                    </span>
                  </button>

                  {/* Toggle Switch */}
                  <button
                    onClick={() =>
                      handleToggleAvailability(item.id, item.isAvailable)
                    }
                    className={clsx(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      item.isAvailable
                        ? "bg-primary"
                        : "bg-gray-300 dark:bg-stone-700",
                    )}
                  >
                    <span
                      className={clsx(
                        "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                        item.isAvailable ? "translate-x-6" : "translate-x-1",
                      )}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              {searchQuery ? "Tidak ada item yang cocok" : "Belum ada item"}
            </p>
          )}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => {
          resetForm();
          setShowAddModal(true);
        }}
        className="fixed bottom-24 right-4 size-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center active:scale-95 z-40"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>

      <AdminBottomNav />

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-stone-900 p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#181411] dark:text-white">
                Tambah Item Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Emoji Picker */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, emoji }))
                      }
                      className={clsx(
                        "size-10 rounded-lg text-xl flex items-center justify-center transition-all",
                        formData.emoji === emoji
                          ? "bg-primary/10 ring-2 ring-primary"
                          : "bg-gray-100 dark:bg-stone-800",
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Nama Item *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-stone-800 text-[#181411] dark:text-white"
                  placeholder="Contoh: Bakso Urat"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Kategori
                </label>
                <div className="flex gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          category: cat.value as "topping" | "drink" | "other",
                        }))
                      }
                      className={clsx(
                        "flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1",
                        formData.category === cat.value
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-400",
                      )}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Harga (Rp)
                </label>
                <div className="flex gap-2">
                  {[1000, 1500, 2000, 3000, 4000].map((price) => (
                    <button
                      key={price}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, price }))
                      }
                      className={clsx(
                        "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
                        formData.price === price
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-400",
                      )}
                    >
                      {price / 1000}k
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-stone-800 text-[#181411] dark:text-white mt-2"
                  placeholder="Atau input manual..."
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={handleAddItem}
                disabled={isSaving}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl active:scale-95 disabled:opacity-50"
              >
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-stone-900 p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#181411] dark:text-white">
                Edit Item
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Emoji Picker */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, emoji }))
                      }
                      className={clsx(
                        "size-10 rounded-lg text-xl flex items-center justify-center transition-all",
                        formData.emoji === emoji
                          ? "bg-primary/10 ring-2 ring-primary"
                          : "bg-gray-100 dark:bg-stone-800",
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Nama Item *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-stone-800 text-[#181411] dark:text-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Kategori
                </label>
                <div className="flex gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          category: cat.value as "topping" | "drink" | "other",
                        }))
                      }
                      className={clsx(
                        "flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1",
                        formData.category === cat.value
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-400",
                      )}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Harga (Rp)
                </label>
                <div className="flex gap-2">
                  {[1000, 1500, 2000, 3000, 4000].map((price) => (
                    <button
                      key={price}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, price }))
                      }
                      className={clsx(
                        "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
                        formData.price === price
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-400",
                      )}
                    >
                      {price / 1000}k
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-stone-800 text-[#181411] dark:text-white mt-2"
                />
              </div>

              {/* Delete Button */}
              <button
                onClick={() => {
                  setShowEditModal(false);
                  openDeleteModal(editingItem);
                }}
                className="w-full py-3 text-red-500 font-bold text-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">
                  delete
                </span>
                Hapus Item Ini
              </button>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={handleEditItem}
                disabled={isSaving}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl active:scale-95 disabled:opacity-50"
              >
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingItem && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <span className="material-symbols-outlined text-red-600">
                  delete
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#181411] dark:text-white">
                Hapus Item?
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Anda yakin ingin menghapus <strong>{deletingItem.name}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteItem}
                disabled={isSaving}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl active:scale-95 disabled:opacity-50"
              >
                {isSaving ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
