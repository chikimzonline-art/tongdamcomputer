"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Cpu,
  LayoutDashboard,
  Inbox,
  FileEdit,
  GraduationCap,
  Utensils,
  Megaphone,
  LogOut,
  ExternalLink,
  Menu,
  Loader2,
  LayoutGrid,
  Handshake,
  ImageIcon,
  Settings2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/leads", label: "Leads", icon: Inbox },
  { href: "/admin/dashboard/ventures", label: "Ventures", icon: LayoutGrid },
  { href: "/admin/dashboard/affiliations", label: "Affiliations", icon: Handshake },
  { href: "/admin/dashboard/about", label: "About Page", icon: FileText },
  { href: "/admin/dashboard/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/dashboard/assets", label: "Site Assets", icon: Settings2 },
  { href: "/admin/dashboard/cms", label: "Content", icon: FileEdit },
  { href: "/admin/dashboard/courses", label: "Courses", icon: GraduationCap },
  { href: "/admin/dashboard/menu", label: "Menu", icon: Utensils },
  { href: "/admin/dashboard/banners", label: "Banners", icon: Megaphone },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

function BrandHeader() {
  return (
    <Link
      href="/admin/dashboard"
      className="flex items-center gap-2.5 rounded-md px-2 py-2 hover:bg-white/5"
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-400/30">
        <Cpu className="size-5 text-emerald-300" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-emerald-50">Tongdam</div>
        <div className="text-[11px] font-medium uppercase tracking-wider text-emerald-300/80">
          Admin Console
        </div>
      </div>
    </Link>
  );
}

function NavLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-emerald-500/15 text-white ring-1 ring-inset ring-emerald-400/30"
          : "text-emerald-100/70 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          active
            ? "text-emerald-300"
            : "text-emerald-200/60 group-hover:text-emerald-200"
        )}
      />
      <span>{item.label}</span>
      {item.href === "/admin/dashboard/leads" && (
        <UnreadLeadsBadge />
      )}
    </Link>
  );
}

/**
 * Tiny indicator that links to Leads. We do not fetch real-time counts here
 * (to keep the layout static-shell friendly); the dashboard page surfaces
 * the actual unread count in its stat cards.
 */
function UnreadLeadsBadge() {
  return null;
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Admin navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} item={item} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}

function UserFooter() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "admin@tongdam.com";
  const name = session?.user?.name ?? "Admin";
  const initials = name
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-2 border-t border-white/10 p-3">
      <div className="flex items-center gap-3 rounded-md px-2 py-2">
        <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
          {initials}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-sm font-medium text-emerald-50">
            {name}
          </div>
          <div className="truncate text-xs text-emerald-200/70">{email}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="flex-1 justify-start text-emerald-100/80 hover:bg-white/5 hover:text-white"
        >
          <Link href="/" target="_blank">
            <ExternalLink className="size-4" />
            View Site
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex-1 justify-start text-rose-200/80 hover:bg-rose-500/10 hover:text-rose-100"
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-emerald-950 text-emerald-50">
      <div className="border-b border-white/10 p-3">
        <BrandHeader />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <NavList onNavigate={onNavigate} />
      </div>
      <UserFooter />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession({ required: true });
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-emerald-600" />
          <p className="text-sm">Loading admin console…</p>
        </div>
      </div>
    );
  }

  // Derive a friendly page title from the current path
  const current = NAV_ITEMS.find((i) => isActive(pathname, i.href));
  const pageTitle = current?.label ?? "Admin";

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop sidebar (fixed) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0">
        <div className="sticky top-0 h-screen w-64">
          <SidebarInner />
        </div>
      </aside>

      {/* Mobile sidebar (sheet) */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open admin menu"
              className="fixed left-4 top-4 z-40 border-emerald-200 bg-white shadow-sm hover:bg-emerald-50"
            >
              <Menu className="size-5 text-emerald-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Admin navigation</SheetTitle>
            <SheetClose className="sr-only">Close</SheetClose>
            <SidebarInner onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b bg-background/95 px-4 py-3 backdrop-blur md:px-8 md:py-4">
          <div className="flex items-center gap-3 pl-14 md:pl-0">
            <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              {pageTitle}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
