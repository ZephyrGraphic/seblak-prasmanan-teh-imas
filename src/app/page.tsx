import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <TopBar title="Seblak Teh Imas" />
      
      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <div className="@container">
            <div className="@[480px]:px-4 @[480px]:py-3">
                <div 
                    className="relative w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-zinc-200 dark:bg-zinc-800 @[480px]:rounded-xl min-h-[400px] group shadow-inner"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDM92IJc1x3veqxGtfacKGh78ckOpJ9L-IrwUyQ1Aunx-VNF6DZd3qV8mvWetBXMk-ql3_paE17tYbSguLEaAE84solLdJiDJat1hHOP4sru4vq7g17FJg_xCaAddxu43pRh1faEE_zW0kFaXYb8YhFdDUixO0MuK9cNAg2vIgdHP6ziL44V7J8ry1EkMnVcdowDNA2XNlFkcXEtbiqZ_umGH61htx_MtN9PeX8ogUbgIUhBxhDbv9-kuVQ35Kz7vqnQVwS4B3KMhyH")`
                    }}
                >
                    <div className="p-6">
                        <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                            Terlaris di Bandung
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Headline */}
        <div className="px-6 py-4">
            <h1 className="text-[#181411] dark:text-white tracking-tight text-[32px] font-extrabold leading-tight text-center">
                Nikmati Seblak Autentik Teh Imas
            </h1>
        </div>

        {/* Body Text */}
        <div className="px-6">
            <p className="text-[#181411]/70 dark:text-white/70 text-base font-medium leading-relaxed text-center">
                Pilih topping sesukamu dari 30+ pilihan. Level pedas juara yang bikin nagih!
            </p>
        </div>

        {/* No Login Badge */}
        <div className="flex justify-center mt-2">
            <div className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full">
                <span className="material-symbols-outlined text-primary text-sm">no_accounts</span>
                <span className="text-primary text-xs font-bold">Tanpa Ribet Daftar & Login</span>
            </div>
        </div>

        {/* CTA Button */}
        <div className="flex px-6 py-8 mt-auto">
            <Link href="/order" className="w-full">
                <button className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-lg font-extrabold leading-normal tracking-wide shadow-lg shadow-primary/30 active:scale-[0.98] transition-all hover:bg-primary/90">
                    <span className="truncate">Pesan Sekarang</span>
                    <span className="material-symbols-outlined ml-2">arrow_forward</span>
                </button>
            </Link>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-3 gap-4 px-6 pb-4">
            <div className="flex flex-col items-center text-center gap-2">
                <div className="size-10 bg-background-light dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">timer</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">15-20 Menit</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
                <div className="size-10 bg-background-light dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">local_fire_department</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Pilih Pedasmu</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
                <div className="size-10 bg-background-light dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">shopping_basket</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">30+ Toppings</span>
            </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
