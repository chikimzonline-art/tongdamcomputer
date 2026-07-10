"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/**
 * Client-side wrapper around next-auth/react SessionProvider.
 * Mount this near the root of the tree so any client component
 * can call `useSession()` and have access to the JWT session.
 */
export function SessionProviderWrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
