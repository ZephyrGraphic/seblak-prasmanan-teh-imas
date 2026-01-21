"use client";
import { useState, useEffect, useCallback } from "react";
import { AdminBottomNav } from "@/components/layout/AdminBottomNav";
import clsx from "clsx";

interface Customer {
  id: string;
  name: string;
  phone: string;
  membership: "BRONZE" | "SILVER" | "GOLD";
}

interface Feedback {
  id: string;
  customerId: string;
  customer: Customer;
  orderId: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
}

interface Stats {
  averageRating: string;
  totalFeedbacks: number;
}

const membershipEmoji: Record<string, string> = {
  BRONZE: "🥉",
  SILVER: "🥈",
  GOLD: "🥇",
};

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `/api/admin/feedbacks?page=${page}&limit=20`;
      if (filterRating) {
        url += `&rating=${filterRating}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setFeedbacks(result.data);
        setStats(result.stats);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, filterRating]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#e6dfdb] dark:border-[#3d2c22] p-4">
        <h1 className="text-xl font-bold text-[#181411] dark:text-white">
          Feedback Member
        </h1>
      </header>

      {/* Stats Cards */}
      {stats && (
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-4 text-center">
            <p className="text-[10px] uppercase text-gray-400 font-bold">
              Rating Rata-rata
            </p>
            <p className="text-3xl font-bold text-yellow-500 mt-1">
              ⭐ {stats.averageRating}
            </p>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-4 text-center">
            <p className="text-[10px] uppercase text-gray-400 font-bold">
              Total Feedback
            </p>
            <p className="text-3xl font-bold text-primary mt-1">
              {stats.totalFeedbacks}
            </p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setFilterRating("");
              setPage(1);
            }}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
              !filterRating
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600",
            )}
          >
            Semua
          </button>
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => {
                setFilterRating(r.toString());
                setPage(1);
              }}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                filterRating === r.toString()
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600",
              )}
            >
              {r} ⭐
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <main className="p-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">
              progress_activity
            </span>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="material-symbols-outlined text-gray-300 text-5xl mb-3">
              rate_review
            </span>
            <p className="text-gray-500">Belum ada feedback</p>
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg">
                      {membershipEmoji[feedback.customer.membership]}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-[#181411] dark:text-white">
                      {feedback.customer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {feedback.customer.phone}
                    </p>
                  </div>
                </div>
                <span
                  className={clsx(
                    "px-2 py-1 text-xs font-bold rounded uppercase",
                    feedback.customer.membership === "GOLD"
                      ? "bg-yellow-100 text-yellow-700"
                      : feedback.customer.membership === "SILVER"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-amber-100 text-amber-700",
                  )}
                >
                  {feedback.customer.membership}
                </span>
              </div>

              <div className="text-xl mb-2">{renderStars(feedback.rating)}</div>

              {feedback.comment && (
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-lg italic">
                  "{feedback.comment}"
                </p>
              )}

              <p className="text-xs text-gray-400 mt-3">
                {formatDate(feedback.createdAt)}
              </p>
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-50"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="px-4 py-2 font-bold">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-50"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </main>

      <AdminBottomNav />
    </div>
  );
}
