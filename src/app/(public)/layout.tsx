import { AlertBanner } from "@/components/site/alert-banner";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { db } from "@/lib/db";

/**
 * Layout wrapping every public-facing page. Renders the dismissible
 * AlertBanner, the sticky SiteHeader, the page main content, and the
 * SiteFooter. The flex column guarantees the footer sticks to the
 * viewport bottom on short pages and is pushed down naturally when
 * content overflows.
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the DB-backed logo URL (uploaded via admin Site Assets).
  // Falls back to the default emerald Cpu icon when empty.
  let logoUrl = "";
  try {
    const row = await db.siteContent.findUnique({
      where: { key: "site.logoUrl" },
    });
    if (row?.value) logoUrl = row.value;
  } catch {
    /* DB not ready — keep empty (header shows default icon) */
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AlertBanner />
      <SiteHeader logoUrl={logoUrl} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

