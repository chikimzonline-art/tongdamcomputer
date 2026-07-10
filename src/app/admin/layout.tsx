import type { ReactNode } from "react";

/**
 * Layout for ALL admin pages (login + dashboard).
 *
 * The root `app/layout.tsx` already mounts the SessionProviderWrapper and
 * sonner Toaster, so we only need to give admin pages a clean background
 * that differs from the public marketing shell.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-muted/30">{children}</div>;
}
