import { AlertBanner } from "@/components/site/alert-banner";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

/**
 * Layout wrapping every public-facing page. Renders the dismissible
 * AlertBanner, the sticky SiteHeader, the page main content, and the
 * SiteFooter. The flex column guarantees the footer sticks to the
 * viewport bottom on short pages and is pushed down naturally when
 * content overflows.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AlertBanner />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
