import Link from "next/link";
import { CirclePlus, Code2, Download, FileClock, Folders, RefreshCw, SquareTerminal, Star } from "lucide-react";
import { ProjectsBrowser, type Filters } from "@/components/admin/projects-browser";
import { PageCrumbs } from "@/components/admin/ui";
import { adminGetProjects, adminGetSettings } from "@/lib/queries";

export const metadata = { title: "Kelola Semua Proyek" };

export default async function AdminProjectsPage({ searchParams }: PageProps<"/admin/projects">) {
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const filters: Filters = {
    q: one("q").trim(),
    category: one("category"),
    sort: one("sort") || "newest",
    status: one("status") || "all",
    page: Math.max(1, Number(one("page")) || 1),
    per: [10, 25, 50].includes(Number(one("per"))) ? Number(one("per")) : 10,
  };

  const [all, settings] = await Promise.all([adminGetProjects(), adminGetSettings()]);
  const counts = {
    all: all.length,
    published: all.filter((p) => p.status === "published").length,
    draft: all.filter((p) => p.status === "draft").length,
    archived: all.filter((p) => p.status === "archived").length,
    featured: all.filter((p) => p.featured).length,
  };
  const categories = Array.from(new Set(all.map((p) => p.category).filter(Boolean))) as string[];

  const q = filters.q.toLowerCase();
  const filtered = all
    .filter((p) => {
      if (filters.status === "featured" ? !p.featured : filters.status !== "all" && p.status !== filters.status) return false;
      if (filters.category && p.category !== filters.category) return false;
      if (q && !`${p.title} ${p.slug} ${p.category ?? ""} ${p.tech_stack.join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    })
    .sort((a, b) =>
      filters.sort === "title" ? a.title.localeCompare(b.title)
      : filters.sort === "order" ? a.sort_order - b.sort_order
      : b.created_at.localeCompare(a.created_at));

  const page = Math.min(filters.page, Math.max(1, Math.ceil(filtered.length / filters.per)));
  const rows = filtered.slice((page - 1) * filters.per, page * filters.per);
  const withRepo = all.filter((p) => p.repo_url).length;

  const tiles = [
    { label: "Total database proyek", icon: Folders, value: String(counts.all), note: `Katalog terpublikasi: ${counts.all ? Math.round((counts.published / counts.all) * 100) : 0}%`, right: `${counts.archived} arsip` },
    { label: "Live featured (hero slots)", icon: Star, value: `${counts.featured} / 3`, note: counts.featured >= 3 ? "Slot penuh" : `${3 - counts.featured} slot masih kosong`, right: "", glow: true },
    { label: "Repositori terkoneksi", icon: Code2, value: String(withRepo), note: "Proyek dengan URL repository", right: "" },
    { label: "Draft / staging", icon: FileClock, value: String(counts.draft), note: "Belum tampil di situs publik", right: "" },
  ];

  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink px-5 py-4">
        <PageCrumbs items={["Portal CMS", "Projects Management", "Daftar Semua Proyek"]} />
        <p className="label flex items-center gap-2 rounded-full bg-panel-2 px-4 py-1.5 !text-rose">
          <i className="dot" /> Total: {counts.all} proyek • {counts.published} live • {counts.draft} draft • {counts.archived} arsip
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="flex items-center gap-4">
            <span className="rounded-md bg-red-deep px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-salmon">[ Directory // Archive &amp; live ]</span>
            <span className="flex items-center gap-2 font-mono text-xs text-rose"><SquareTerminal className="size-4" /> {settings.website ?? "production"}</span>
          </p>
          <h1 className="display mt-4 text-6xl sm:text-7xl">Kelola semua <span className="block text-red">proyek</span></h1>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-rose">
            Kelola, urutkan, dan pantau status publikasi showcase portofolio publik {settings.full_name}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/projects/export" className="btn btn-dark"><Download className="size-4" /> Export backup</a>
          <Link href="/admin/projects/new" className="btn btn-red"><CirclePlus className="size-4" /> Tambah proyek baru</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className={t.glow ? "panel bg-gradient-to-br from-panel to-red-ink/70 p-5" : "panel p-5"}>
            <div className="flex items-start justify-between gap-3">
              <p className="label !text-rose">{t.label}</p>
              <span className={t.glow ? "grid size-8 place-items-center rounded-lg bg-red-deep text-salmon" : "grid size-8 place-items-center rounded-lg bg-panel-3 text-salmon"}><t.icon className="size-4" /></span>
            </div>
            <p className="mt-4 font-display text-5xl leading-none text-cream">{t.value}</p>
            <p className="mt-4 flex justify-between gap-3 text-sm text-rose"><span>{t.note}</span><span>{t.right}</span></p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <ProjectsBrowser key={JSON.stringify(filters)} rows={rows} total={filtered.length} filters={{ ...filters, page }} categories={categories} counts={counts} />
      </div>

      <div className="panel mt-5 flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4">
          <span className="grid size-10 place-items-center rounded-lg bg-panel-3 text-salmon"><RefreshCw className="size-4" /></span>
          <div>
            <p className="text-lg font-semibold text-cream">Sinkronisasi otomatis</p>
            <p className="text-sm text-rose">Setiap perubahan di Supabase langsung me-revalidate cache halaman publik.</p>
          </div>
        </div>
        <p className="label flex items-center gap-2 !text-cream"><i className="dot" /> Hero slot revalidation: auto</p>
      </div>
    </div>
  );
}
