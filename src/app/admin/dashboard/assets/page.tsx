import { db } from "@/lib/db";
import { AssetsEditor } from "./assets-editor";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const logoRow = await db.siteContent.findUnique({ where: { key: "site.logoUrl" } });
  const faviconRow = await db.siteContent.findUnique({ where: { key: "site.faviconUrl" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Site Assets</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload your logo and favicon via UploadThing (max 2MB). When set, these
        replace the default local files across the whole site. Leave empty to
        use the built-in defaults.
      </p>
      <div className="mt-6">
        <AssetsEditor
          logoUrl={logoRow?.value ?? ""}
          faviconUrl={faviconRow?.value ?? ""}
        />
      </div>
    </div>
  );
}
