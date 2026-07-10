"use client";

import { useSyncExternalStore } from "react";
import { X, Megaphone } from "lucide-react";
import Link from "next/link";

type Props = {
  message: string;
  link?: string | null;
};

/**
 * Subscribe to `storage` events so any tab/window that changes
 * localStorage (including our own dismiss action) re-reads the
 * dismissed flag for this banner.
 */
function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/**
 * Client portion of the AlertBanner — uses `useSyncExternalStore`
 * to read a per-message "dismissed" flag from localStorage. This
 * avoids setState-in-effect warnings and keeps server/client
 * snapshots consistent (server always returns false = visible).
 */
export function AlertBannerClient({ message, link }: Props) {
  const storageKey = `tongdam.banner.dismissed.${message.slice(0, 40)}`;

  const isDismissed = useSyncExternalStore(
    subscribe,
    // Client snapshot
    () => {
      try {
        return window.localStorage.getItem(storageKey) === "1";
      } catch {
        return false;
      }
    },
    // Server snapshot — always render the banner on the server
    () => false
  );

  function dismiss() {
    try {
      window.localStorage.setItem(storageKey, "1");
      // useSyncExternalStore only re-reads on `storage` events, which
      // don't fire in the same tab that made the change — dispatch one.
      window.dispatchEvent(
        new StorageEvent("storage", { key: storageKey, newValue: "1" })
      );
    } catch {
      /* ignore storage errors (private mode, etc.) */
    }
  }

  if (isDismissed) return null;

  const body = (
    <span className="flex items-center gap-2 text-sm font-medium">
      <Megaphone className="size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </span>
  );

  return (
    <div
      role="region"
      aria-label="Site announcement"
      className="relative w-full bg-emerald-600 text-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 sm:px-6">
        {link ? (
          <Link href={link} className="hover:underline underline-offset-4">
            {body}
          </Link>
        ) : (
          body
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/80 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
