import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";

/**
 * Shared admin guard for all /api/admin/* routes.
 *
 * Checks both that a session exists AND that the authenticated user
 * has the "ADMIN" role. Returns the session on success, null otherwise.
 *
 * Usage:
 *   const session = await requireAdmin();
 *   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 */
export async function requireAdmin(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any)?.role !== "ADMIN") return null;
  return session;
}
