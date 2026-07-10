import { getActiveBanner } from "@/lib/data";
import { AlertBannerClient } from "@/components/site/alert-banner-client";

/**
 * Top-of-page announcement banner. Server component — fetches the
 * currently active banner row, then hands it to a client dismiss
 * wrapper so users can hide it (state persists per message).
 */
export async function AlertBanner() {
  const banner = await getActiveBanner();
  if (!banner) return null;

  return (
    <AlertBannerClient message={banner.message} link={banner.link ?? null} />
  );
}
