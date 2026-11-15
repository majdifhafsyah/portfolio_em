import { NextResponse } from "next/server";
import { adminGetProjects, getCurrentAdmin } from "@/lib/queries";

/** Unduh seluruh proyek sebagai JSON (hanya admin). */
export async function GET() {
  const { isAdmin } = await getCurrentAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await adminGetProjects();
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify({ exported_at: new Date().toISOString(), projects }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="projects-backup-${stamp}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
