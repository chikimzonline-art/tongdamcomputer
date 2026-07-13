import { db } from "@/lib/db";

/**
 * Fetch all active site content as a key->value map.
 * Used by SSR pages to render CMS-managed text.
 */
export async function getSiteContentMap(): Promise<Record<string, string>> {
  const rows = await db.siteContent.findMany();
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

/**
 * Get a single content value by key (falls back to empty string).
 */
export async function getContent(key: string): Promise<string> {
  const row = await db.siteContent.findUnique({ where: { key } });
  return row?.value ?? "";
}

/**
 * Get the active alert banner (if any).
 */
export async function getActiveBanner() {
  return db.alertBanner.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get courses for a given institute, sorted.
 */
export async function getCourses(institute: string) {
  return db.course.findMany({
    where: { institute, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Get all courses grouped by institute.
 */
export async function getAllCourses() {
  return db.course.findMany({ orderBy: [{ institute: "asc" }, { sortOrder: "asc" }] });
}

/**
 * Get restaurant menu items grouped by category.
 */
export async function getMenuGrouped() {
  const items = await db.menuItem.findMany({
    where: { isAvailable: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  const groups: Record<string, typeof items> = {};
  for (const it of items) {
    if (!groups[it.category]) groups[it.category] = [];
    groups[it.category].push(it);
  }
  return groups;
}

/**
 * Get all menu items (for admin).
 */
export async function getAllMenu() {
  return db.menuItem.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

/**
 * Get recent leads (for admin dashboard).
 */
export async function getLeads(limit?: number) {
  return db.lead.findMany({
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
}

/**
 * Get lead stats for dashboard.
 */
export async function getLeadStats() {
  const [total, newLeads, unread] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { status: "NEW" } }),
    db.lead.count({ where: { isRead: false } }),
  ]);
  return { total, newLeads, unread };
}

/**
 * Get all active ventures, sorted — used by the home page.
 */
export async function getVentures() {
  return db.venture.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Get ALL ventures (including inactive) — for admin.
 */
export async function getAllVentures() {
  return db.venture.findMany({ orderBy: { sortOrder: "asc" } });
}


/**
 * Get all active affiliations, sorted — used by the home page carousel.
 */
export async function getAffiliations() {
  return db.affiliation.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Get ALL affiliations (including inactive) — for admin.
 */
export async function getAllAffiliations() {
  return db.affiliation.findMany({ orderBy: { sortOrder: "asc" } });
}
