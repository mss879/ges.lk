import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | GES",
  robots: { index: false, follow: false },
};

/**
 * Bare wrapper for everything under /admin. The authenticated shell (sidebar,
 * auth guard) lives in the (app) route group so /admin/login can render
 * without one.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f6f7f9] text-stone-900 antialiased">{children}</div>;
}
