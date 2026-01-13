import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "material-symbols";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Seblak Teh Imas",
  description: "Seblak Prasmanan Autentik Bandung",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f47b25",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // App-like behavior
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light" suppressHydrationWarning>
      <head>

      </head>
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased bg-[#f2f2f2] dark:bg-[#1a1a1a] text-[#181411] dark:text-white min-h-screen flex justify-center`}
        suppressHydrationWarning
      >
        {/* Mobile Wrapper */}
        <div className="relative flex h-full min-h-screen w-full md:max-w-xl lg:max-w-2xl mx-auto flex-col overflow-x-hidden shadow-2xl bg-background-light dark:bg-background-dark">
          {children}
        </div>
      </body>
    </html>
  );
}
