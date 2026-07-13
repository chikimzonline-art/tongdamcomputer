import { db } from "@/lib/db";
import { ContactEditor } from "./contact-editor";

export const dynamic = "force-dynamic";

export default async function ContactAdminPage() {
  const rows = await db.siteContent.findMany({ where: { category: "contact" } });
  const content: Record<string, string> = {};
  for (const r of rows) content[r.key] = r.value;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Contact Details</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Edit the contact information, working hours, and Google Maps embed shown
        on the public{" "}
        <a href="/contact" className="text-emerald-700 underline" target="_blank">
          /contact
        </a>{" "}
        page. Changes go live instantly.
      </p>
      <div className="mt-6">
        <ContactEditor content={content} />
      </div>
    </div>
  );
}
