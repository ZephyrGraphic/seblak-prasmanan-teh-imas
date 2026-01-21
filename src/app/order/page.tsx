"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useOrderStore } from "@/store/orderStore";
import clsx from "clsx";
import { TopBar } from "@/components/layout/TopBar";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji?: string;
  isAvailable: boolean;
}

// Spice level pricing based on authentic menu
const SPICE_LEVELS = [
  { label: "Level 0", value: "0", price: 0 },
  { label: "Level 1", value: "1", price: 0 },
  { label: "Level 2", value: "2", price: 0 },
  { label: "Level 3", value: "3", price: 0 },
  { label: "Level 4", value: "4", price: 1000 },
  { label: "Level 5", value: "5", price: 1000 },
  { label: "Level 6", value: "6", price: 2000 },
  { label: "Level 7", value: "7", price: 2000 },
  { label: "Level 8", value: "8", price: 2000 },
  { label: "Level 9", value: "9", price: 2000 },
  { label: "Level 10", value: "10", price: 2000 },
];

// Sayur options
const SAYUR_OPTIONS = [
  { label: "Sayur", value: "Sayur", price: 0 },
  { label: "Tanpa Sayur", value: "Tanpa Sayur", price: 0 },
  { label: "Nambah Sayur", value: "Nambah Sayur", price: 2000 },
];

export default function OrderPage() {
  const router = useRouter();
  const store = useOrderStore();
  const [isMounted, setIsMounted] = useState(false);

  // Menu from database
  const [toppings, setToppings] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  // Form Local State
  const [levelPedas, setLevelPedas] = useState("0");
  const [kuah, setKuah] = useState("Sedang");
  const [rasa, setRasa] = useState("Gurih");
  const [sayur, setSayur] = useState("Sayur");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [tempRequest, setTempRequest] = useState("");

  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    // Fetch store settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsStoreOpen(data.data.isOpen);
        }
      })
      .catch((err) => console.error("Failed to fetch settings:", err))
      .finally(() => setIsLoading(false));

    // Fetch menu from stock
    fetch("/api/stock")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Filter only available toppings
          const availableToppings = data.data.filter(
            (item: MenuItem) => item.isAvailable && item.category === "topping",
          );
          setToppings(availableToppings);
        }
      })
      .catch((err) => console.error("Failed to fetch menu:", err))
      .finally(() => setIsLoadingMenu(false));
  }, []);

  if (!isMounted || isLoading || isLoadingMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (!isStoreOpen) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 text-center">
        <div className="size-24 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-gray-400">
            storefront
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#181411] dark:text-white mb-2">
          Toko Sedang Tutup
        </h1>
        <p className="text-gray-500 max-w-xs mx-auto mb-8">
          Maaf, Seblak Teh Imas sedang tidak menerima pesanan saat ini. Silakan
          kembali lagi nanti.
        </p>
        <Button onClick={() => router.push("/")} variant="outline">
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  // Get spice level price
  const getSpiceLevelPrice = () => {
    const level = SPICE_LEVELS.find((l) => l.value === levelPedas);
    return level?.price || 0;
  };

  // Get sayur price
  const getSayurPrice = () => {
    const option = SAYUR_OPTIONS.find((o) => o.value === sayur);
    return option?.price || 0;
  };

  const calculatePrice = () => {
    let total = 0;

    // Toppings price
    selectedToppings.forEach((t) => {
      const topping = toppings.find((item) => item.name === t);
      total += topping?.price || 0;
    });

    // Spice level price
    total += getSpiceLevelPrice();

    // Sayur price
    total += getSayurPrice();

    return total;
  };

  const handleToppingToggle = (topping: string) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleSubmit = () => {
    if (selectedToppings.length === 0) {
      alert("Pilih minimal satu topping!");
      return;
    }
    if (!store.customerName) {
      alert("Mohon isi Nama Anda di bagian atas form.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    store.addBowl({
      levelPedas: `Level ${levelPedas}`,
      kuah,
      rasa,
      telur: "-", // Telur sekarang masuk ke topping
      sayur,
      toppings: selectedToppings,
      price: calculatePrice(),
    });

    if (tempRequest) {
      store.setSpecialRequest(tempRequest);
    }

    router.push("/checkout");
  };

  if (!isMounted) return null;

  // Group toppings by price for better display
  const groupedToppings = toppings.reduce(
    (acc, topping) => {
      const priceKey = topping.price;
      if (!acc[priceKey]) acc[priceKey] = [];
      acc[priceKey].push(topping);
      return acc;
    },
    {} as Record<number, MenuItem[]>,
  );

  const sortedPrices = Object.keys(groupedToppings)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="pb-32 min-h-screen bg-background-light dark:bg-background-dark">
      <TopBar title="Racik Seblak" showBack />

      <div className="max-w-[480px] mx-auto p-4 space-y-4">
        {/* Header Card */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <span className="material-symbols-outlined text-3xl text-primary">
                edit_note
              </span>
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-[#181411] dark:text-white">
                Formulir Pesanan
              </h1>
              <p className="text-sm text-[#8a7260] dark:text-gray-400">
                Isi detail seblakmu di sini
              </p>
            </div>
          </div>

          {/* Identity Section */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#8a7260] dark:text-gray-400">
                Nama Pemesan
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300 placeholder:font-normal"
                placeholder="Ketik nama kamu..."
                value={store.customerName}
                onChange={(e) => store.setCustomerName(e.target.value)}
              />
            </div>

            <div className="flex bg-gray-50 dark:bg-black/20 p-1 rounded-xl">
              {["Bungkus", "Makan Ditempat"].map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    store.setDiningOption(
                      opt === "Bungkus" ? "Takeaway" : "Dine-in",
                    )
                  }
                  className={clsx(
                    "flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                    store.diningOption ===
                      (opt === "Bungkus" ? "Takeaway" : "Dine-in")
                      ? "bg-white dark:bg-white/10 text-primary shadow-sm"
                      : "text-gray-400 hover:text-gray-600",
                  )}
                >
                  {store.diningOption ===
                    (opt === "Bungkus" ? "Takeaway" : "Dine-in") && (
                    <span className="material-symbols-outlined text-lg">
                      check_circle
                    </span>
                  )}
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Level Pedas - Slider Style */}
        <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10">
          <h3 className="font-bold text-[#181411] dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              local_fire_department
            </span>
            Level Pedas
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-extrabold text-primary">
                Level {levelPedas}
              </span>
              {getSpiceLevelPrice() > 0 && (
                <span className="text-sm font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-lg">
                  +Rp {getSpiceLevelPrice().toLocaleString("id-ID")}
                </span>
              )}
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={levelPedas}
              onChange={(e) => setLevelPedas(e.target.value)}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>Tidak Pedas</span>
              <span>🔥 Super Pedas</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {parseInt(levelPedas) === 0 && "Tanpa cabai sama sekali"}
              {parseInt(levelPedas) >= 1 &&
                parseInt(levelPedas) <= 3 &&
                "Pedas ringan, cocok untuk pemula"}
              {parseInt(levelPedas) >= 4 &&
                parseInt(levelPedas) <= 5 &&
                "Pedas sedang (+Rp 1.000)"}
              {parseInt(levelPedas) >= 6 && "Pedas level ekstrem! (+Rp 2.000)"}
            </p>
          </div>
        </div>

        {/* Kuah & Rasa */}
        <div className="grid grid-cols-2 gap-4">
          {/* Kuah */}
          <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10">
            <h3 className="font-bold text-[#181411] dark:text-white mb-4 text-sm">
              Kuah
            </h3>
            <div className="space-y-2">
              {["Nyemek", "Sedang", "Banyak"].map((opt) => (
                <label
                  key={opt}
                  className={clsx(
                    "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all",
                    kuah === opt
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <span className="text-sm">{opt}</span>
                  <input
                    type="radio"
                    name="kuah"
                    className="hidden"
                    checked={kuah === opt}
                    onChange={() => setKuah(opt)}
                  />
                  {kuah === opt && (
                    <span className="material-symbols-outlined text-base">
                      check
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Rasa */}
          <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10">
            <h3 className="font-bold text-[#181411] dark:text-white mb-4 text-sm">
              Rasa
            </h3>
            <div className="space-y-2">
              {["Asin", "Gurih", "Manis", "Gurih Manis"].map((opt) => (
                <label
                  key={opt}
                  className={clsx(
                    "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all",
                    rasa === opt
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <span className="text-sm text-nowrap">{opt}</span>
                  <input
                    type="radio"
                    name="rasa"
                    className="hidden"
                    checked={rasa === opt}
                    onChange={() => setRasa(opt)}
                  />
                  {rasa === opt && (
                    <span className="material-symbols-outlined text-base">
                      check
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sayur Options */}
        <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10">
          <h3 className="font-bold text-[#181411] dark:text-white mb-3 text-sm flex items-center gap-2">
            <span className="text-lg">🥬</span> Opsi Sayur
          </h3>
          <div className="flex gap-2">
            {SAYUR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSayur(opt.value)}
                className={clsx(
                  "flex-1 py-2 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1",
                  sayur === opt.value
                    ? "border-primary bg-primary text-white shadow-primary/30 shadow-lg"
                    : "border-gray-200 text-gray-500 bg-gray-50 hover:bg-white",
                )}
              >
                <span>{opt.label}</span>
                {opt.price > 0 && (
                  <span className="text-[10px] opacity-80">
                    +Rp {opt.price / 1000}k
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Toppings Section - Grouped by Price */}
        <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10">
          <h3 className="font-bold text-[#181411] dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              shopping_basket
            </span>
            Pilih Topping
          </h3>

          {toppings.length === 0 ? (
            <p className="text-center text-gray-400 py-4">
              Tidak ada topping tersedia
            </p>
          ) : (
            <div className="space-y-4">
              {sortedPrices.map((price) => (
                <div key={price}>
                  <p className="text-xs font-bold text-primary mb-2 flex items-center gap-2">
                    <span className="bg-primary/10 px-2 py-0.5 rounded">
                      Rp {price.toLocaleString("id-ID")}
                    </span>
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {groupedToppings[price].map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={clsx(
                              "size-6 border rounded-lg flex items-center justify-center transition-all",
                              selectedToppings.includes(item.name)
                                ? "bg-primary border-primary"
                                : "border-gray-300 bg-white",
                            )}
                          >
                            {selectedToppings.includes(item.name) && (
                              <span className="material-symbols-outlined text-white text-sm">
                                check
                              </span>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedToppings.includes(item.name)}
                            onChange={() => handleToppingToggle(item.name)}
                          />
                          <span className="text-lg">{item.emoji || "🥣"}</span>
                          <span
                            className={clsx(
                              "text-sm font-medium transition-colors",
                              selectedToppings.includes(item.name)
                                ? "text-[#181411] font-bold"
                                : "text-gray-600",
                            )}
                          >
                            {item.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request */}
        <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10">
          <h3 className="font-bold text-[#181411] dark:text-white mb-3 text-sm">
            Catatan Khusus{" "}
            <span className="font-normal text-gray-400">(Opsional)</span>
          </h3>
          <textarea
            className="w-full bg-gray-50 dark:bg-black/20 border-none rounded-xl text-sm p-4 focus:ring-2 focus:ring-primary h-24 placeholder:text-gray-400 resize-none"
            placeholder="Contoh: Kuah dipisah ya teh..."
            value={tempRequest}
            onChange={(e) => setTempRequest(e.target.value)}
          ></textarea>
        </div>

        {/* Footer Price Estimate */}
        <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/10 flex justify-between items-center shadow-lg shadow-gray-200/50">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Estimasi Harga
            </p>
            <p className="text-3xl font-extrabold text-[#181411] dark:text-white tracking-tight">
              Rp {calculatePrice().toLocaleString("id-ID")}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {selectedToppings.length} Topping
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/10 z-50 max-w-[480px] mx-auto">
        <Button
          onClick={handleSubmit}
          fullWidth
          className="shadow-xl shadow-primary/20"
        >
          Simpan ke Keranjang
        </Button>
      </div>
    </div>
  );
}
