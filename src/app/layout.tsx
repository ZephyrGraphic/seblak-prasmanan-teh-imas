import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased bg-[#f2f2f2] dark:bg-[#1a1a1a] text-[#181411] dark:text-white min-h-screen flex justify-center`}
        suppressHydrationWarning
      >
        {/* Mobile Wrapper */}
        <div className="relative flex h-full min-h-screen w-full max-w-[480px] flex-col overflow-x-hidden shadow-2xl bg-background-light dark:bg-background-dark">
          {children}
        </div>
      </body>
    </html>
  );
}
