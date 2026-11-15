"use client";

import Link from "next/link";
import { useActionState, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowUpRight, Bold, BookOpen, Bookmark, CalendarDays, Check, Code2, Copy, Eye, Gauge, Globe, ImagePlus,
  Italic, Link2, List, PiggyBank, Plus, Quote, Rocket, SearchCheck, ShieldCheck, SquareTerminal, Star, UploadCloud, X,
} from "lucide-react";
import { saveProjectAction, type ActionState } from "@/lib/actions";
import type { Metric, Project, ProjectStatus } from "@/lib/types";
import { cn, slugify } from "@/lib/utils";
import { Field, PageCrumbs, SectionCard, Toggle } from "@/components/admin/ui";
import { UploadButton } from "@/components/admin/image-upload";
import { CoverPlaceholder } from "@/components/site/project-card";

const initial: ActionState = { ok: false };

const CATEGORIES = ["Enterprise SaaS", "Headless Shop", "Machine Metrics", "Dev Infra", "AI Agents", "Observability", "Security", "Landing Page", "Mobile App"];
const TECH_SUGGESTIONS = [
  "Next.js 14 (App Router)", "Go (Golang Microservices)", "PostgreSQL / Citus Sharded", "Redis Cluster Cache",
  "Kubernetes Orchestration", "GraphQL Apollo", "Apache Kafka", "Rust Engine", "Docker", "TypeScript", "Supabase", "Tailwind CSS",
];
const ARCHITECTURES = [
  { name: "Microservices", note: "Decoupled gRPC + Event Mesh" },
  { name: "Serverless Edge", note: "Vercel & Cloudflare Workers" },
  { name: "Modular Monolith", note: "Clean Architecture DDD" },
  { name: "High-Concurrency", note: "Zero-alloc Memory Pool" },
];
const STATUS_OPTIONS: Array<{ value: ProjectStatus; label: string; badge: string; hot?: boolean }> = [
  { value: "draft", label: "Draft (Internal)", badge: "Hidden" },
  { value: "published", label: "Published (Live Portfolio)", badge: "Public", hot: true },
  { value: "archived", label: "Arsip / Legacy", badge: "Disabled" },
];
const METRIC_ICONS = [Gauge, ShieldCheck, PiggyBank];
const MD_TOOLS = [
  [Bold, "Tebal", "**", "**"], [Italic, "Miring", "_", "_"], [Code2, "Kode", "`", "`"],
  [List, "Daftar", "\n- ", ""], [Quote, "Kutipan", "\n> ", ""], [Link2, "Tautan", "[", "](https://)"],
] as const;

export function ProjectForm({ project, siteHost }: { project?: Project | null; siteHost: string }) {
  const [state, formAction, pending] = useActionState(saveProjectAction, initial);
  const e = state.errors ?? {};
  const descRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [category, setCategory] = useState(project?.category ?? CATEGORIES[0]);
  const [tagline, setTagline] = useState(project?.tagline ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [cover, setCover] = useState(project?.cover_url ?? "");
  const [gallery, setGallery] = useState<string[]>(project?.gallery_urls ?? []);
  const [tech, setTech] = useState<string[]>(project?.tech_stack ?? []);
  const [customTech, setCustomTech] = useState("");
  const [architecture, setArchitecture] = useState(project?.architecture ?? "");
  const [metrics, setMetrics] = useState<Metric[]>(() => {
    const m = [...(project?.metrics ?? [])];
    while (m.length < 3) m.push({ value: "", label: "" });
    return m.slice(0, 3);
  });
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "draft");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [period, setPeriod] = useState(project?.period ?? "");
  const [metaTitle, setMetaTitle] = useState(project?.meta_title ?? "");
  const [metaDesc, setMetaDesc] = useState(project?.meta_description ?? "");
  const [copied, setCopied] = useState(false);

  const effectiveSlug = slugTouched ? slug : slugify(title);
  const techOptions = useMemo(() => Array.from(new Set([...TECH_SUGGESTIONS, ...tech])), [tech]);
  const categories = useMemo(() => Array.from(new Set([...CATEGORIES, category].filter(Boolean))), [category]);
  const words = description.trim() ? description.trim().split(/\s+/).length : 0;
  const filledMetrics = metrics.filter((m) => m.value.trim());

  const seoScore =
    (metaTitle.length >= 20 && metaTitle.length <= 60 ? 40 : metaTitle ? 20 : 0) +
    (metaDesc.length >= 70 && metaDesc.length <= 160 ? 40 : metaDesc ? 20 : 0) +
    (cover ? 20 : 0);

  function wrap(before: string, after: string) {
    const el = descRef.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b, value } = el;
    const next = value.slice(0, a) + before + value.slice(a, b) + after + value.slice(b);
    setDescription(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(a + before.length, b + before.length); });
  }

  function toggleTech(t: string) {
    setTech((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }
  function addCustomTech() {
    const t = customTech.trim();
    if (t && !tech.includes(t)) setTech((prev) => [...prev, t]);
    setCustomTech("");
  }

  return (
    <form action={formAction} className="mx-auto max-w-[1180px]">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <input type="hidden" name="slug" value={effectiveSlug} />
      <input type="hidden" name="tech_stack" value={JSON.stringify(tech)} />
      <input type="hidden" name="gallery_urls" value={JSON.stringify(gallery)} />
      <input type="hidden" name="metrics" value={JSON.stringify(metrics)} />
      <input type="hidden" name="cover_url" value={cover} />
      <input type="hidden" name="architecture" value={architecture} />
      <input type="hidden" name="status" value={status} />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageCrumbs items={["Portal CMS", "Projects Management", project ? "Ubah Proyek" : "Tambah Proyek Baru"]} />
        <div className="flex gap-3">
          <Link href="/admin/projects" className="btn btn-dark !rounded-full"><ArrowLeft className="size-4" /> Batalkan / Kembali</Link>
          <button type="submit" name="intent" value="draft" disabled={pending} className="btn btn-dark !rounded-full"><Bookmark className="size-4" /> Simpan draft</button>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <h1 className="display text-5xl sm:text-6xl">{project ? "Ubah proyek" : "Tambah proyek baru"}</h1>
        <span className="rounded bg-red-deep px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-salmon">
          {status === "published" ? "Live" : status === "archived" ? "Arsip" : "Draft"} {"//"} v1.0
        </span>
      </div>
      <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-rose">
        Lengkapi spesifikasi teknis, media preview, arsitektur stack, dan metrik performa untuk ditayangkan pada portofolio publik.
      </p>

      {state.message && !state.ok ? (
        <p role="alert" className="mt-5 rounded-xl bg-red-ink px-5 py-3 text-sm text-salmon">{state.message}</p>
      ) : null}

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {/* 01 */}
          <SectionCard n="01" title="Informasi umum proyek" badge="Core metadata">
            <div className="grid gap-5 sm:grid-cols-[1.7fr_1fr]">
              <Field label="Judul proyek *" htmlFor="title" aside={`${title.length}/60`} error={e.title}>
                <input id="title" name="title" required maxLength={60} value={title} onChange={(ev) => setTitle(ev.target.value)} placeholder="Nexus Cloud ERP - Multi-tenant Platform" className="field font-mono" />
              </Field>
              <Field label="Kategori *" htmlFor="category" error={e.category}>
                <input id="category" name="category" required list="category-list" value={category} onChange={(ev) => setCategory(ev.target.value)} className="field font-mono" />
                <datalist id="category-list">{categories.map((c) => <option key={c} value={c} />)}</datalist>
              </Field>
            </div>
            <Field className="mt-5" label="Permalink slug (generated)" htmlFor="slug-input" aside="Canonical URL" error={e.slug}>
              <div className="flex overflow-hidden rounded-lg bg-panel-2">
                <span className="hidden shrink-0 items-center bg-panel-3 px-4 font-mono text-sm tracking-[0.06em] text-rose sm:flex">https://{siteHost}/projects/</span>
                <input
                  id="slug-input" value={effectiveSlug} placeholder="nama-proyek"
                  onChange={(ev) => { setSlugTouched(true); setSlug(slugify(ev.target.value.replace(/\s/g, "-"))); }}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 font-mono text-sm tracking-[0.06em] text-salmon outline-none"
                />
                <button
                  type="button" aria-label="Salin URL"
                  onClick={async () => { await navigator.clipboard?.writeText(`https://${siteHost}/projects/${effectiveSlug}`); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                  className="px-4 text-rose hover:text-cream"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </button>
              </div>
            </Field>
            <div className="mt-5 grid gap-5 sm:grid-cols-[1.7fr_1fr]">
              <Field label="Tagline pengait (one-liner hero punchline)" htmlFor="tagline">
                <input id="tagline" name="tagline" value={tagline} onChange={(ev) => setTagline(ev.target.value)} placeholder="Automated resource planner with real-time distributed telemetry…" className="field" />
              </Field>
              <Field label="Label kartu publik" htmlFor="subtitle" hint="Mis. Enterprise Platform">
                <input id="subtitle" name="subtitle" defaultValue={project?.subtitle ?? ""} className="field font-mono" />
              </Field>
            </div>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="description" className="label">Deskripsi lengkap &amp; latar belakang masalah</label>
                <span className="label !text-dim">Markdown</span>
              </div>
              <div className="overflow-hidden rounded-lg bg-panel-2">
                <div className="flex items-center gap-1 border-b border-line px-3 py-2 text-rose">
                  {MD_TOOLS.map(([Icon, lbl, before, after]) => (
                    <button key={lbl} type="button" aria-label={lbl} title={lbl} onClick={() => wrap(before, after)} className="grid size-8 place-items-center rounded hover:bg-panel-3 hover:text-cream">
                      <Icon className="size-4" />
                    </button>
                  ))}
                </div>
                <textarea
                  ref={descRef} id="description" name="description" rows={7} value={description} onChange={(ev) => setDescription(ev.target.value)}
                  placeholder="Dirancang untuk menangani beban operasional…"
                  className="block w-full resize-y bg-transparent px-4 py-3 leading-relaxed text-cream outline-none placeholder:text-dim"
                />
                <div className="flex justify-between px-4 py-2 font-mono text-xs tracking-[0.06em] text-mute">
                  <span>Markdown Syntax Supported</span>
                  <span>{words} kata / {description.length.toLocaleString("id-ID")} karakter</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* 02 */}
          <SectionCard n="02" title="Media showcase & mockups" badge="Asset management">
            <div className="rounded-xl bg-panel-2 px-6 py-8 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-xl bg-panel-3 text-salmon"><UploadCloud className="size-5" /></span>
              <p className="mt-4 text-lg font-semibold text-cream">Unggah tangkapan layar proyek utama</p>
              <p className="mt-1 text-sm text-rose">Mendukung format PNG, WebP, JPG, SVG (maks. 8MB per berkas)</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <UploadButton folder="projects" onUploaded={setCover} className="btn btn-dark !bg-panel-3" label={cover ? "Ganti primary cover" : "Pilih dari Local Storage"} />
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {cover ? (
                <figure className="overflow-hidden rounded-lg bg-panel-2">
                  <div className="relative aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cover} alt="Primary cover" className="size-full object-cover" />
                    <span className="absolute left-0 top-2 flex items-center gap-1 bg-red px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white"><Star className="size-3" /> Primary cover</span>
                  </div>
                  <figcaption className="flex items-center justify-between px-3 py-2 font-mono text-xs text-rose">
                    <span className="truncate">{cover.split("/").pop()}</span>
                    <button type="button" aria-label="Hapus cover" onClick={() => setCover("")} className="hover:text-cream"><X className="size-4" /></button>
                  </figcaption>
                </figure>
              ) : null}
              {gallery.map((url, i) => (
                <figure key={url} className="overflow-hidden rounded-lg bg-panel-2">
                  <div className="relative aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Slide ${i + 2}`} className="size-full object-cover" />
                    <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream">Slide {String(i + 2).padStart(2, "0")}</span>
                  </div>
                  <figcaption className="flex items-center justify-between px-3 py-2 font-mono text-xs text-rose">
                    <span className="truncate">{url.split("/").pop()}</span>
                    <button type="button" aria-label={`Hapus slide ${i + 2}`} onClick={() => setGallery((g) => g.filter((u) => u !== url))} className="hover:text-cream"><X className="size-4" /></button>
                  </figcaption>
                </figure>
              ))}
              <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-lg bg-panel-2 p-3 text-center sm:aspect-auto sm:min-h-[120px]">
                <ImagePlus className="size-5 text-rose" />
                <UploadButton folder="projects" onUploaded={(url) => setGallery((g) => [...g, url])} className="font-mono text-sm tracking-[0.06em] text-cream hover:text-salmon" label="Tambah Slot Galeri" />
              </div>
            </div>
            {e.cover_url ? <p className="mt-2 text-xs text-red-hi">{e.cover_url}</p> : null}
          </SectionCard>

          {/* 03 */}
          <SectionCard n="03" title="Technical arsenal & architecture" badge="Stack specs">
            <div className="mb-3 flex items-center justify-between">
              <p className="label">Teknologi &amp; tools yang digunakan</p>
              <p className="label">Klik untuk aktifkan/nonaktifkan</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {techOptions.map((t) => {
                const on = tech.includes(t);
                return (
                  <button
                    key={t} type="button" aria-pressed={on} onClick={() => toggleTech(t)}
                    className={cn("flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs tracking-[0.08em] transition-colors", on ? "bg-red-deep text-salmon ring-1 ring-red/60" : "bg-panel-2 text-cream hover:bg-panel-3")}
                  >
                    {t} {on ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex max-w-md gap-2">
              <input
                value={customTech} onChange={(ev) => setCustomTech(ev.target.value)} aria-label="Tech kustom"
                onKeyDown={(ev) => { if (ev.key === "Enter") { ev.preventDefault(); addCustomTech(); } }}
                placeholder="+ Tambah Tech / Library Kustom…" className="field !py-2 font-mono"
              />
              <button type="button" onClick={addCustomTech} className="rounded-lg bg-panel-3 px-4 font-mono text-xs tracking-[0.08em] text-cream hover:bg-line-2">Insert Tag</button>
            </div>

            <p className="label mt-7">Pola arsitektur inti (architectural topology)</p>
            <div role="radiogroup" aria-label="Pola arsitektur" className="mt-3 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              {ARCHITECTURES.map((a) => {
                const on = architecture === a.name;
                return (
                  <button
                    key={a.name} type="button" role="radio" aria-checked={on} onClick={() => setArchitecture(on ? "" : a.name)}
                    className={cn("relative rounded-lg p-4 text-left transition-colors", on ? "bg-panel-3 ring-1 ring-red" : "bg-panel-2 hover:bg-panel-3")}
                  >
                    <i className={cn("absolute right-3 top-3 size-2 rounded-full", on ? "bg-red shadow-[0_0_10px_rgb(224_38_38/0.9)]" : "bg-line-2")} />
                    <span className="block break-words pr-4 font-mono text-sm font-bold tracking-[0.06em] text-cream">{a.name}</span>
                    <span className="mt-2 block font-mono text-xs leading-relaxed text-mute">{a.note}</span>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {/* 04 */}
          <SectionCard n="04" title="Key impact & benchmark metrics" badge="Data proofs">
            <p className="mb-5 text-rose">Cantumkan metrik kuantitatif terukur yang memperlihatkan keunggulan teknis serta efisiensi solusi yang Anda rancang.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((m, i) => {
                const Icon = METRIC_ICONS[i];
                const set = (patch: Partial<Metric>) => setMetrics((prev) => prev.map((x, j) => (j === i ? { ...x, ...patch } : x)));
                return (
                  <div key={i} className="rounded-xl bg-panel-2 p-4">
                    <div className="flex items-center justify-between">
                      <p className="label">Metric 0{i + 1}</p>
                      <Icon className="size-4 text-rose" />
                    </div>
                    <label className="label mt-4 block !text-rose" htmlFor={`mv${i}`}>Nilai / angka kuantitatif</label>
                    <input id={`mv${i}`} value={m.value} onChange={(ev) => set({ value: ev.target.value })} placeholder={["15,000+ req/s", "99.98%", "40% Cost Red"][i]} className="field mt-2 !bg-panel-3 !text-lg font-semibold" />
                    <label className="label mt-4 block !text-rose" htmlFor={`ml${i}`}>Label metrik</label>
                    <input id={`ml${i}`} value={m.label} onChange={(ev) => set({ label: ev.target.value })} placeholder={["Peak Throughput", "Operational Uptime", "Cloud Compute Optimization"][i]} className="field mt-2 !bg-panel-3 font-mono !text-xs" />
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* 05 */}
          <SectionCard n="05" title="Repositori & deployment links" badge="External access">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Live production URL" htmlFor="live_url" aside="Live target" error={e.live_url}>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-rose" />
                  <input id="live_url" name="live_url" type="url" defaultValue={project?.live_url ?? ""} placeholder="https://" className="field !pl-11 font-mono" />
                </div>
              </Field>
              <Field label="GitHub repository" htmlFor="repo_url" error={e.repo_url}
                aside={<span className="flex items-center gap-2 normal-case tracking-normal text-rose">Private Repo <Toggle name="repo_private" defaultChecked={project?.repo_private} label="Private repo" /></span>}>
                <div className="relative">
                  <SquareTerminal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-rose" />
                  <input id="repo_url" name="repo_url" type="url" defaultValue={project?.repo_url ?? ""} placeholder="https://github.com/…" className="field !pl-11 font-mono" />
                </div>
              </Field>
            </div>
            <Field className="mt-5" label="API documentation / architectural whitepaper (opsional)" htmlFor="docs_url" error={e.docs_url}>
              <div className="relative">
                <BookOpen className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-rose" />
                <input id="docs_url" name="docs_url" type="url" defaultValue={project?.docs_url ?? ""} placeholder="https://docs…" className="field !pl-11 font-mono" />
              </div>
            </Field>
          </SectionCard>
        </div>

        {/* Kolom kanan */}
        <aside className="space-y-6">
          <section className="panel p-5">
            <header className="flex items-center justify-between">
              <h2 className="label !text-cream">Visibility &amp; status</h2>
              <i className="dot" />
            </header>
            <p className="label mt-6 !text-rose">Target status</p>
            <div role="radiogroup" aria-label="Target status" className="mt-3 space-y-2">
              {STATUS_OPTIONS.map((o) => {
                const on = status === o.value;
                return (
                  <button
                    key={o.value} type="button" role="radio" aria-checked={on} onClick={() => setStatus(o.value)}
                    className={cn("flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left transition-colors", on ? "bg-panel-3 ring-1 ring-red/70" : "bg-panel-2 hover:bg-panel-3")}
                  >
                    <i className={cn("size-3 shrink-0 rounded-full border-2", on ? "border-salmon bg-red" : "border-transparent bg-cream")} />
                    <span className="flex-1 text-cream">{o.label}</span>
                    <span className={cn("font-mono text-[11px] tracking-[0.1em]", o.hot ? "rounded bg-red-deep px-2 py-0.5 uppercase text-salmon" : "text-rose")}>{o.badge}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-panel-2 px-4 py-3.5">
              <div>
                <p className="font-mono text-sm font-bold tracking-[0.06em] text-cream">Hero Featured Slot</p>
                <p className="text-xs text-rose">Sematkan di 3 showcase proyek unggulan beranda</p>
              </div>
              <Toggle name="featured" checked={featured} onChange={setFeatured} label="Hero featured slot" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="sort_order" className="label !text-rose">Urutan tampil</label>
                <div className="mt-2 flex items-center rounded-lg bg-panel-2 pl-3">
                  <span className="font-mono text-xs font-bold tracking-[0.1em] text-salmon">POS:</span>
                  <input id="sort_order" name="sort_order" type="number" min={0} defaultValue={project?.sort_order ?? 1} className="w-full bg-transparent px-2 py-2.5 text-right font-mono text-cream outline-none" />
                </div>
              </div>
              <div>
                <label htmlFor="period" className="label !text-rose">Rilis / periode</label>
                <div className="mt-2 flex items-center rounded-lg bg-panel-2 pl-3">
                  <CalendarDays className="size-4 shrink-0 text-rose" />
                  <input id="period" name="period" value={period} onChange={(ev) => setPeriod(ev.target.value)} placeholder="Q1 2024" className="w-full bg-transparent px-2 py-2.5 font-mono text-cream outline-none placeholder:text-dim" />
                </div>
              </div>
            </div>
          </section>

          {/* Live preview */}
          <section className="panel p-5">
            <header className="flex items-center justify-between gap-3">
              <h2 className="label flex items-center gap-2 !text-cream"><Eye className="size-4 text-salmon" /> Live portfolio card preview</h2>
              <span className="font-mono text-[11px] text-rose">Realtime</span>
            </header>
            <div className="mt-4 overflow-hidden rounded-xl bg-panel-2">
              <div className="relative aspect-[16/10]">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt="" className="size-full object-cover" />
                ) : <CoverPlaceholder />}
                {featured ? <span className="absolute left-0 top-3 bg-red px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white">Featured</span> : null}
                <span className="absolute right-3 top-3 grid size-7 place-items-center rounded bg-black/60 text-cream"><ArrowUpRight className="size-4" /></span>
              </div>
              <div className="p-4">
                <p className="flex justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
                  <span className="text-salmon">{category || "Kategori"}</span>
                  <span className="text-rose">{period}</span>
                </p>
                <p className="mt-2 text-xl font-semibold leading-snug text-cream">{title || "Judul proyek"}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mute">{tagline || "Tagline pengait akan tampil di sini."}</p>
                {filledMetrics.length ? (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {filledMetrics.slice(0, 2).map((m, i) => (
                      <div key={i} className="rounded-lg bg-panel-3 p-3">
                        <p className="truncate text-lg font-bold text-cream">{m.value}</p>
                        <p className="truncate text-xs text-rose">{m.label}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {tech.length ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tech.slice(0, 3).map((t) => <span key={t} className="tag">{t.replace(/\s*\(.*\)$/, "")}</span>)}
                    {tech.length > 3 ? <span className="tag">+{tech.length - 3} more</span> : null}
                  </div>
                ) : null}
              </div>
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed text-mute">Pratinjau ini diperbarui secara instan saat Anda mengetik field judul, tagline, dan media.</p>
          </section>

          {/* SEO */}
          <section className="panel p-5">
            <header className="flex items-center justify-between">
              <h2 className="label flex items-center gap-2 !text-cream"><SearchCheck className="size-4 text-salmon" /> SEO &amp; OpenGraph</h2>
              <span className="font-mono text-xs font-bold text-salmon" title="Estimasi kelengkapan: panjang judul, deskripsi, dan cover">Score: {seoScore}/100</span>
            </header>
            <Field className="mt-5" label="Meta title tag" htmlFor="meta_title" aside={`${metaTitle.length}/60`}>
              <input id="meta_title" name="meta_title" value={metaTitle} onChange={(ev) => setMetaTitle(ev.target.value)} placeholder={title} className="field" />
            </Field>
            <Field className="mt-4" label="Meta description" htmlFor="meta_description" aside={`${metaDesc.length}/160`}>
              <textarea id="meta_description" name="meta_description" rows={3} value={metaDesc} onChange={(ev) => setMetaDesc(ev.target.value)} placeholder={tagline} className="field" />
            </Field>
            <div className="mt-4 rounded-lg bg-panel-2 p-3">
              <p className="truncate font-mono text-xs text-salmon">https://{siteHost} › projects › {effectiveSlug || "slug"}</p>
              <p className="mt-1 truncate font-semibold text-cream">{metaTitle || title || "Judul halaman"}</p>
              <p className="mt-1 line-clamp-2 text-sm text-mute">{metaDesc || tagline || "Deskripsi hasil pencarian."}</p>
            </div>
          </section>
        </aside>
      </div>

      {/* Bar aksi */}
      <div className="sticky bottom-4 z-20 mt-8 flex flex-col gap-4 rounded-2xl bg-ink p-4 shadow-[0_20px_60px_-10px_rgb(0_0_0/0.9)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <i className="dot" />
          <div>
            <p className="font-mono text-sm font-bold tracking-[0.06em] text-cream">
              {status === "published" ? "Akan tayang di portfolio publik" : status === "archived" ? "Akan disimpan sebagai arsip" : "Akan disimpan sebagai draft"}
            </p>
            <p className="text-sm text-rose">{title && category ? "Field wajib sudah terisi." : "Judul dan kategori wajib diisi."}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {project?.status === "published" ? (
            <Link href={`/projects/${project.slug}`} target="_blank" className="btn btn-dark"><Eye className="size-4" /> Pratinjau layar penuh</Link>
          ) : null}
          <button type="submit" disabled={pending} className="btn btn-red !px-6 !py-3.5">
            <Rocket className="size-4" />
            {pending ? "Menyimpan…" : status === "published" ? "Publikasikan proyek sekarang" : "Simpan proyek"}
          </button>
        </div>
      </div>
    </form>
  );
}
