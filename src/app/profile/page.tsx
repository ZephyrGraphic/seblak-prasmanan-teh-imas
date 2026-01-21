"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useMemberStore } from "@/store/memberStore";
import clsx from "clsx";

const membershipEmoji: Record<string, string> = {
  BRONZE: "🥉",
  SILVER: "🥈",
  GOLD: "🥇",
};

const membershipColors: Record<string, string> = {
  BRONZE: "from-amber-400 to-amber-600",
  SILVER: "from-gray-300 to-gray-500",
  GOLD: "from-yellow-400 to-yellow-600",
};

interface RecentOrder {
  id: string;
  queueNumber: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface ProfileData {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  membership: "BRONZE" | "SILVER" | "GOLD";
  totalSpent: number;
  orderCount: number;
  createdAt: string;
  orders: RecentOrder[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { member, isLoggedIn, login, logout } = useMemberStore();
  const [isMounted, setIsMounted] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<ProfileData | null>(null);

  // Feedback form
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch profile when logged in
  useEffect(() => {
    if (isLoggedIn && member?.id) {
      fetchProfile();
    }
  }, [isLoggedIn, member?.id]);

  const fetchProfile = async () => {
    if (!member?.id) return;
    try {
      const response = await fetch(`/api/member/profile?id=${member.id}`);
      const result = await response.json();
      if (result.success) {
        setProfile(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const result = await response.json();

      if (result.success) {
        login(result.data);
        setShowLogin(false);
        setLoginForm({ name: "", phone: "" });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Gagal melakukan login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setProfile(null);
  };

  const handleSendFeedback = async () => {
    if (!member?.id) return;
    setIsSendingFeedback(true);

    try {
      const response = await fetch("/api/member/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: member.id,
          rating: feedbackRating,
          comment: feedbackComment,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Terima kasih atas feedback Anda! 🙏");
        setShowFeedback(false);
        setFeedbackRating(5);
        setFeedbackComment("");
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Gagal mengirim feedback");
    } finally {
      setIsSendingFeedback(false);
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
    });
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <TopBar title="Profil" />

      <main className="p-4 space-y-4">
        {!isLoggedIn ? (
          // Guest State
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-24 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-gray-400 text-5xl">
                person
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#181411] dark:text-white mb-2">
              Selamat Datang!
            </h2>
            <p className="text-gray-500 mb-6 max-w-[280px]">
              Sudah jadi member? Login untuk melihat profil dan nikmati
              keuntungan member!
            </p>
            <Button onClick={() => setShowLogin(true)} className="px-8">
              <span className="material-symbols-outlined mr-2">login</span>
              Login Member
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              Belum jadi member? Daftar di kasir saat pesan seblak ya!
            </p>
          </div>
        ) : (
          // Logged In State
          <>
            {/* Profile Card */}
            <div
              className={clsx(
                "relative overflow-hidden rounded-3xl p-6 text-white",
                "bg-gradient-to-br",
                membershipColors[member?.membership || "BRONZE"],
              )}
            >
              <div className="absolute top-0 right-0 opacity-20 text-[120px] -mr-4 -mt-4">
                {membershipEmoji[member?.membership || "BRONZE"]}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="size-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl">
                    {membershipEmoji[member?.membership || "BRONZE"]}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{member?.name}</h2>
                  <p className="text-white/80 text-sm">{member?.phone}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-[10px] uppercase font-bold text-white/70">
                    Total Belanja
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(
                      profile?.totalSpent || member?.totalSpent || 0,
                    )}
                  </p>
                </div>
                <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-[10px] uppercase font-bold text-white/70">
                    Total Order
                  </p>
                  <p className="text-lg font-bold">
                    {profile?.orderCount || member?.orderCount || 0}x
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/60 text-center mt-4">
                Member sejak{" "}
                {formatDate(member?.createdAt || new Date().toISOString())}
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowFeedback(true)}
                className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col items-center gap-2"
              >
                <span className="material-symbols-outlined text-primary text-3xl">
                  rate_review
                </span>
                <span className="text-sm font-bold text-[#181411] dark:text-white">
                  Beri Feedback
                </span>
              </button>
              <button
                onClick={() => router.push("/receipts")}
                className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col items-center gap-2"
              >
                <span className="material-symbols-outlined text-primary text-3xl">
                  receipt_long
                </span>
                <span className="text-sm font-bold text-[#181411] dark:text-white">
                  Riwayat Order
                </span>
              </button>
            </div>

            {/* Recent Orders */}
            {profile?.orders && profile.orders.length > 0 && (
              <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-4">
                <h3 className="font-bold text-[#181411] dark:text-white mb-3">
                  Pesanan Terakhir
                </h3>
                <div className="space-y-2">
                  {profile.orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5 last:border-0"
                    >
                      <div>
                        <p className="font-bold text-sm">{order.queueNumber}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <p className="font-bold text-primary">
                        {formatCurrency(order.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logout Button */}
            <Button
              variant="outline"
              fullWidth
              onClick={handleLogout}
              className="text-red-500 border-red-200"
            >
              <span className="material-symbols-outlined mr-2">logout</span>
              Logout
            </Button>
          </>
        )}
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center">
          <div className="bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#181411] dark:text-white">
                Login Member
              </h3>
              <button onClick={() => setShowLogin(false)} className="p-2">
                <span className="material-symbols-outlined text-gray-500">
                  close
                </span>
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nama
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Nama sesuai saat daftar"
                  value={loginForm.name}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nomor Telepon
                </label>
                <Input
                  type="tel"
                  required
                  placeholder="08xxxxxxxxxx"
                  value={loginForm.phone}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, phone: e.target.value })
                  }
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center">
          <div className="bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#181411] dark:text-white">
                Beri Feedback
              </h3>
              <button onClick={() => setShowFeedback(false)} className="p-2">
                <span className="material-symbols-outlined text-gray-500">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Rating
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="text-4xl transition-transform hover:scale-110"
                    >
                      {star <= feedbackRating ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Komentar (opsional)
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:bg-stone-800 h-24"
                  placeholder="Ceritakan pengalamanmu..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSendFeedback}
                fullWidth
                disabled={isSendingFeedback}
              >
                {isSendingFeedback ? "Mengirim..." : "Kirim Feedback"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
