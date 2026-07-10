import { getLeads } from "@/lib/data";
import { LeadsTable, type LeadRow } from "./leads-table";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getLeads();
  // Serialize for client (Prisma Date -> ISO string)
  const rows: LeadRow[] = leads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email ?? "",
    phone: l.phone,
    source: l.source,
    subject: l.subject,
    message: l.message,
    status: l.status,
    isRead: l.isRead,
    createdAt: l.createdAt.toISOString(),
  }));

  return <LeadsTable initialLeads={rows} />;
}
