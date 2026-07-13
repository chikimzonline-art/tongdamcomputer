import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UTApi } from "uploadthing/server";

async function requireAdmin() {
  return await getServerSession(authOptions);
}

/**
 * GET /api/admin/uploadthing/files
 * Lists previously uploaded files from UploadThing storage.
 * Query params: ?limit=50&offset=0
 *
 * Returns: { files: [{ key, name, size, url, uploadedAt }] }
 */
export async function GET(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? 50);
  const offset = Number(searchParams.get("offset") ?? 0);

  try {
    const utapi = new UTApi();
    const result: any = await utapi.listFiles({ limit, offset });

    // `listFiles` returns { hasMore, files: [...] } — extract the array.
    const files = Array.isArray(result)
      ? result
      : Array.isArray(result?.files)
        ? result.files
        : [];
    const keys = files.map((f: any) => f.key).filter(Boolean);

    let urlMap: Record<string, string> = {};
    if (keys.length > 0) {
      const urlResult: any = await utapi.getFileUrls(keys);
      // `getFileUrls` returns { data: [{ key, url }] } — extract the array.
      const urlArray = Array.isArray(urlResult)
        ? urlResult
        : Array.isArray(urlResult?.data)
          ? urlResult.data
          : [];
      for (const item of urlArray) {
        if (item && item.key && item.url) {
          urlMap[item.key] = item.url;
        }
      }
    }

    const payload = files.map((f: any) => ({
      key: f.key,
      name: f.name,
      size: f.size,
      status: f.status,
      uploadedAt: f.uploadedAt,
      url: urlMap[f.key] ?? null,
    }));

    return NextResponse.json({ files: payload });
  } catch (e: any) {
    console.error("List UploadThing files error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Failed to list files" },
      { status: 500 }
    );
  }
}
