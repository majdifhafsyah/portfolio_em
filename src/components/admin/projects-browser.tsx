"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpDown, CheckCircle2, ChevronLeft, ChevronRight, Pencil, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { bulkProjectsAction } from "@/lib/actions";
import type { Project, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<ProjectStatus, { label: string; cls: string }> = {
  published: { label: "Published", cls: "bg-panel-3 text-cream" },
  draft: { label: "Draft / Staging", cls: "bg-panel-3 text-salmon" },
  archived: { label: "Diarsipkan", cls: "bg-panel-2 text-dim" },
};

export type Filters = { q: string; category: string; sort: string; status: string; page: number; per: number };

function hrefFor(f: Filters, patch: Partial<Filters>) {
  const next = { ...f, ...patch };
  const sp = new URLSearchParams();
  if (next.q) sp.set("q", next.q);
  if (next.category) sp.set("category", next.category);
  if (next.sort && next.sort !== "newest") sp.set("sort", next.sort);
  if (next.status && next.status !== "all") sp.set("status", next.status);
  if (next.page > 1) sp.set("page", String(next.page));
  if (next.per !== 10) sp.set("per", String(next.per));
  const s = sp.toString();
  return s ? `/admin/projects?${s}` : "/admin/projects";
}

export function ProjectsBrowser({
  rows, total, filters, categories, counts,
}: {
  rows: Project[]; total: number; filters: Filters; categories: string[];
  counts: { all: number; published: number; draft: number; featured: number; archived: number };
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const pages = Math.max(1, Math.ceil(total / filters.per));
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const activeFilters = [filters.q, filters.category, filters.status !== "all" ? "s" : ""].filter(Boolean).length;
  const from = total ? (filters.page - 1) * filters.per + 1 : 0;
  const to = Math.min(total, filters.page * filters.per);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const pills = [
    { key: "all", label: `Semua (${counts.all})` },
    { key: "published", label: `Published / Live (${counts.published})` },
    { key: "draft", label: `Draft / Staging (${counts.draft})` },
    { key: "featured", label: `Featured Hero (${counts.featured})`, star: true },
    { key: "archived", label: `Diarsipkan (${counts.archived})` },
  ];

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="panel p-4">
        <form action="/admin/projects" className="grid gap-3 lg:grid-cols-[1.1fr_1fr_1fr]">
          {filters.status !== "all" ? <input type="hidden" name="status" value={filters.status} /> : null}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-rose" />
            <input name="q" defaultValue={filters.q} aria-label="Cari proyek" placeholder="Cari proyek berdasarkan judul, slug, tech…" className="field !py-3 !pl-11 font-mono" />
          </div>
          <select name="category" defaultValue={filters.category} aria-label="Kategori" onChange={(e) => e.currentTarget.form?.requestSubmit()} className="field !py-3 font-mono">
            <option value="">Semua Kategori (Semua)</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="relative">
            <select name="sort" defaultValue={filters.sort} aria-label="Urutan" onChange={(e) => e.currentTarget.form?.requestSubmit()} className="field !py-3 font-mono">
              <option value="newest">Sort: Terbaru Ditambahkan</option>
              <option value="order">Sort: Urutan Tampil</option>
              <option value="title">Sort: Judul A–Z</option>
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-9 top-1/2 size-4 -translate-y-1/2 text-rose" />
          </div>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {pills.map((p) => (
            <Link
              key={p.key}
              href={hrefFor(filters, { status: p.key, page: 1 })}
              aria-current={filters.status === p.key ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs tracking-[0.1em] transition-colors",
                filters.status === p.key ? "bg-red text-white" : "bg-panel-2 text-cream hover:bg-panel-3",
              )}
            >
              {p.star ? <Star className="size-3 fill-current" /> : p.key !== "all" ? <i className="size-1.5 rounded-full bg-salmon" /> : null}
              {p.label}
            </Link>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-2 font-mono text-xs tracking-[0.1em] text-cream">
          <SlidersHorizontal className="size-3.5" /> Filter Aktif: {activeFilters}
          {activeFilters ? <Link href="/admin/projects" className="text-salmon hover:underline">Reset</Link> : null}
        </p>
      </div>

      <form action={bulkProjectsAction} onSubmit={() => setSelected(new Set())} className="space-y-5">
        {[...selected].map((id) => <input key={id} type="hidden" name="ids" value={id} />)}

        {/* Bar seleksi */}
        {selected.size ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-deep px-5 py-3">
            <p className="flex items-center gap-3 font-mono text-[15px] tracking-[0.06em] text-cream">
              <CheckCircle2 className="size-5" /> {selected.size} Proyek Terpilih
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button name="op" value="feature" className="rounded-md bg-ink px-3 py-1.5 font-mono text-xs tracking-[0.1em] text-cream hover:bg-panel">Tandai sebagai Hero</button>
              <button name="op" value="publish" className="rounded-md bg-ink px-3 py-1.5 font-mono text-xs tracking-[0.1em] text-cream hover:bg-panel">Publikasikan</button>
              <button name="op" value="draft" className="rounded-md bg-ink px-3 py-1.5 font-mono text-xs tracking-[0.1em] text-cream hover:bg-panel">Jadikan Draft</button>
              <button name="op" value="archive" className="rounded-md bg-red px-3 py-1.5 font-mono text-xs tracking-[0.1em] text-white hover:bg-red-hi">Arsipkan</button>
              <button
                name="op" value="delete"
                onClick={(e) => { if (!window.confirm(`Hapus permanen ${selected.size} proyek? Tindakan ini tidak bisa dibatalkan.`)) e.preventDefault(); }}
                className="rounded-md border border-salmon/40 px-3 py-1.5 font-mono text-xs tracking-[0.1em] text-salmon hover:bg-red-ink"
              >
                Hapus
              </button>
              <button type="button" aria-label="Batalkan pilihan" onClick={() => setSelected(new Set())} className="p-1.5 text-cream"><X className="size-4" /></button>
            </div>
          </div>
        ) : null}

        {/* Tabel */}
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead className="border-b border-line bg-panel-2/60">
                <tr className="label [&>th]:px-4 [&>th]:py-4 [&>th]:font-medium">
                  <th className="w-12">
                    <input
                      type="checkbox" aria-label="Pilih semua" checked={allChecked}
                      onChange={() => setSelected(allChecked ? new Set() : new Set(rows.map((r) => r.id)))}
                      className="size-4 accent-[#e02626]"
                    />
                  </th>
                  <th>Proyek &amp; slug identifier</th>
                  <th>Status &amp; visibilitas</th>
                  <th>Tech arsenal</th>
                  <th>Metrik utama / SLA</th>
                  <th className="w-12"><span className="sr-only">Aksi</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((p) => {
                  const st = STATUS_STYLE[p.status];
                  const live = p.status === "published" && p.featured;
                  return (
                    <tr key={p.id} className={cn("transition-colors hover:bg-panel-2/50", p.status === "archived" && "opacity-55")}>
                      <td className="px-4 py-4">
                        <input type="checkbox" aria-label={`Pilih ${p.title}`} checked={selected.has(p.id)} onChange={() => toggle(p.id)} className="size-4 accent-[#e02626]" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-14 shrink-0 overflow-hidden rounded bg-ink">
                            {p.cover_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.cover_url} alt="" className="size-full object-cover" />
                            ) : (
                              <div className="red-glow size-full" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="flex flex-wrap items-center gap-2">
                              <Link href={`/admin/projects/${p.id}/edit`} className="text-lg font-semibold text-cream hover:text-salmon">{p.title}</Link>
                              {p.category ? <span className="tag !text-salmon">{p.category}</span> : null}
                            </p>
                            <p className="truncate font-mono text-xs tracking-[0.08em] text-rose">/{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs tracking-[0.08em]", live ? "bg-red-ink text-salmon shadow-[0_0_18px_-4px_rgb(224_38_38/0.7)]" : st.cls)}>
                          <i className={cn("size-1.5 rounded-full", live ? "bg-red" : "bg-current")} />
                          {live ? "Published / Live" : st.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex max-w-[220px] flex-wrap gap-1.5">
                          {p.tech_stack.slice(0, 4).map((t) => <span key={t} className="tag">{t}</span>)}
                          {p.tech_stack.length > 4 ? <span className="tag !text-salmon">+{p.tech_stack.length - 4}</span> : null}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-sm">
                        {p.metrics[0] ? (
                          <>
                            <span className="block text-cream">{p.metrics[0].value}</span>
                            <span className="text-xs text-salmon">{p.metrics[0].label}</span>
                          </>
                        ) : <span className="text-dim">—</span>}
                      </td>
                      <td className="px-4 py-4">
                        <Link href={`/admin/projects/${p.id}/edit`} aria-label={`Ubah ${p.title}`} className="grid size-8 place-items-center rounded-lg text-rose hover:bg-panel-3 hover:text-cream">
                          <Pencil className="size-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {!rows.length ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <p className="text-lg font-semibold text-cream">{counts.all ? "Tidak ada proyek yang cocok" : "Belum ada proyek"}</p>
                      <p className="mt-1 text-sm text-mute">{counts.all ? "Ubah kata kunci atau reset filter." : "Tambahkan proyek pertama untuk mengisi showcase."}</p>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-4">
            <p className="font-mono text-xs tracking-[0.1em] text-rose">
              Menampilkan <b className="text-cream">{from} - {to}</b> dari <b className="text-cream">{total}</b> proyek
              <span className="mx-3 text-dim">•</span>Per halaman:{" "}
              {[10, 25, 50].map((n) => (
                <Link key={n} href={hrefFor(filters, { per: n, page: 1 })} className={cn("ml-1 rounded px-2 py-1", filters.per === n ? "bg-panel-3 text-cream" : "hover:text-cream")}>{n}</Link>
              ))}
            </p>
            <nav aria-label="Halaman" className="flex items-center gap-1.5">
              <Link href={hrefFor(filters, { page: Math.max(1, filters.page - 1) })} aria-label="Sebelumnya" aria-disabled={filters.page === 1} className={cn("grid size-9 place-items-center rounded-lg bg-panel-2 text-rose", filters.page === 1 && "pointer-events-none opacity-40")}>
                <ChevronLeft className="size-4" />
              </Link>
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === pages || Math.abs(n - filters.page) <= 1)
                .map((n, i, arr) => (
                  <span key={n} className="flex items-center gap-1.5">
                    {i > 0 && n - arr[i - 1] > 1 ? <span className="px-1 text-dim">…</span> : null}
                    <Link href={hrefFor(filters, { page: n })} aria-current={n === filters.page ? "page" : undefined} className={cn("grid size-9 place-items-center rounded-lg font-mono text-sm", n === filters.page ? "bg-red font-bold text-white" : "bg-panel-2 text-rose hover:text-cream")}>
                      {n}
                    </Link>
                  </span>
                ))}
              <Link href={hrefFor(filters, { page: Math.min(pages, filters.page + 1) })} aria-label="Berikutnya" aria-disabled={filters.page === pages} className={cn("grid size-9 place-items-center rounded-lg bg-panel-2 text-rose", filters.page === pages && "pointer-events-none opacity-40")}>
                <ChevronRight className="size-4" />
              </Link>
            </nav>
          </div>
        </div>
      </form>
    </div>
  );
}
