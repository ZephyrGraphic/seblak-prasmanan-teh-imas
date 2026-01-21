import type { Metadata } from "next";
import AdminPWAWrapper from "./AdminPWAWrapper";

export const metadata: Metadata = {
  manifest: "/admin-manifest.json",
  title: "Admin - Seblak Teh Imas",
  description: "Dashboard Admin Seblak Prasmanan Teh Imas",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminPWAWrapper>{children}</AdminPWAWrapper>;
}
