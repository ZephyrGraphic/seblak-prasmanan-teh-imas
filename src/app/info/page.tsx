"use client";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import Link from "next/link";

export default function InfoPage() {
  return (
    <div className="pb-20 min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopBar title="Info Outlet" />

      <main className="flex-1 p-0">
        {/* Hero Image */}
        <div
          className="w-full h-48 bg-cover bg-center relative"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%), url("/images/outlet.png")`,
          }}
        >
          <div className="absolute inset-0 flex items-end p-6">
            <div>
              <h1 className="text-white text-2xl font-extrabold shadow-black/50 drop-shadow-md">
                Seblak Prasmanan Teh Imas
              </h1>
              <p className="text-white/80 font-medium text-sm">
                Seblak Prasmanan Autentik 🌶️
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Location */}
          <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
            <div className="flex items-start gap-4">
              <div className="size-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <h3 className="font-bold text-[#181411] dark:text-white mb-1">
                  Lokasi Outlet
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                  Cibolang Kaler, Kec. Cisaat, Kabupaten Sukabumi, Jawa Barat
                </p>
                <Link
                  href="https://maps.app.goo.gl/YMV8LpdpLpWUeLkKA"
                  target="_blank"
                  className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                >
                  Lihat di Google Maps
                  <span className="material-symbols-outlined text-sm">
                    open_in_new
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d247.55508945622296!2d106.87487363680499!3d-6.904779635721821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1769013384795!5m2!1sen!2sid"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>

          {/* Opening Hours */}
          <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
            <div className="flex items-start gap-4">
              <div className="size-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <div className="w-full">
                <h3 className="font-bold text-[#181411] dark:text-white mb-3">
                  Jam Operasional
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Senin - Jumat</span>
                    <span className="font-bold text-[#181411] dark:text-white">
                      10:00 - 21:00
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sabtu - Minggu</span>
                    <span className="font-bold text-[#181411] dark:text-white">
                      10:00 - 22:00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
            <div className="flex items-start gap-4">
              <div className="size-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">chat</span>
              </div>
              <div>
                <h3 className="font-bold text-[#181411] dark:text-white mb-1">
                  Kontak Kami
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-1">
                  <strong>Owner:</strong> Teh Imas
                </p>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                  Punya pertanyaan atau keluhan? Hubungi kami langsung via
                  WhatsApp.
                </p>
                <Link
                  href="https://wa.me/6283813731449"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#20bd5a]"
                >
                  <span className="material-symbols-outlined text-lg">
                    call
                  </span>
                  Chat WhatsApp
                </Link>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
            <div className="flex items-start gap-4">
              <div className="size-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">info</span>
              </div>
              <div>
                <h3 className="font-bold text-[#181411] dark:text-white mb-2">
                  Tentang Kami
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Seblak Prasmanan Teh Imas menyediakan seblak prasmanan dengan
                  berbagai pilihan topping segar dan level pedas sesuai selera.
                  Nikmati sensasi seblak autentik dengan cita rasa khas yang
                  bikin nagih!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
