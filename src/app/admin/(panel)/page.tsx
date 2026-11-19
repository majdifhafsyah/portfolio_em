import Link from "next/link";
import {
  ArrowDown, ArrowRight, ArrowUp, Award, Braces, CloudCheck, FileText, FolderOpen, Gauge, IdCard, Plus, SquareTerminal, Star, Trash2, Archive,
} from "lucide-react";
import { SettingsForm, type SettingsTab } from "@/components/admin/settings-form";
import { CertificateForm } from "@/components/admin/certificate-form";
import { addEducationAction, addSkillAction, deleteListItemAction, moveListItemAction } from "@/lib/actions";
import { adminGetLists, adminGetProjects, adminGetSettings } from "@/lib/queries";
import { cn, pad2 } from "@/lib/utils";

const TABS = [
  { key: "profil", label: "Profil & Foto", icon: IdCard },
  { key: "bio", label: "Deskripsi & Bio", icon: FileText },
  { key: "statistik", label: "Statistik Cepat", icon: Gauge },
  { key: "proyek", label: "Manajemen Proyek", icon: SquareTerminal },
  { key: "keahlian", label: "Bidang & Keahlian", icon: Braces },
  { key: "proses", label: "Education & Sertifikat", icon: Award },
] as const;
type TabKey = (typeof TABS)[number]["key"];

function DeleteButton({ table, id, label }: { table: string; id: string; label: string }) {
  return (
    <form action={deleteListItemAction}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <button aria-label={`Hapus ${label}`} className="grid size-8 place-items-center rounded-lg text-mute hover:bg-red-ink hover:text-salmon">
        <Trash2 className="size-4" />
      </button>
    </form>
  );
}

function MoveButtons({ table, id, first, last }: { table: string; id: string; first: boolean; last: boolean }) {
  return (
    <form action={moveListItemAction} className="flex flex-col">
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <button name="dir" value="up" disabled={first} aria-label="Naikkan" className="grid size-5 place-items-center rounded text-mute hover:text-cream disabled:opacity-25">
        <ArrowUp className="size-3.5" />
      </button>
      <button name="dir" value="down" disabled={last} aria-label="Turunkan" className="grid size-5 place-items-center rounded text-mute hover:text-cream disabled:opacity-25">
        <ArrowDown className="size-3.5" />
      </button>
    </form>
  );
}

export default async function AdminDashboardPage({ searchParams }: PageProps<"/admin">) {
  const sp = await searchParams;
  const tab: TabKey = TABS.some((t) => t.key === sp.tab) ? (sp.tab as TabKey) : "profil";

  const [settings, projects, lists] = await Promise.all([adminGetSettings(), adminGetProjects(), adminGetLists()]);
  const published = projects.filter((p) => p.status === "published").length;
  const drafts = projects.filter((p) => p.status === "draft").length;
  const archived = projects.filter((p) => p.status === "archived").length;
  const featured = projects.filter((p) => p.featured).length;
  const updated = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(settings.updated_at));

  const tiles = [
    { label: "Total proyek", icon: FolderOpen, value: String(projects.length), left: `${published} Published`, right: `${drafts} Draft`, accent: true },
    { label: "Live featured (hero)", icon: Star, value: `${featured}/3`, left: featured >= 3 ? "Slot penuh" : `${3 - featured} slot kosong`, right: "Beranda" },
    { label: "Diarsipkan", icon: Archive, value: String(archived), left: "Tidak tampil publik", right: "" },
  ];

  return (
    <div className="mx-auto max-w-[1180px]">
      <section className="relative">
        <div className="red-glow pointer-events-none absolute -right-10 -top-10 h-72 w-[60%] opacity-60" />
        <p className="label relative !text-cream">
          Control system <span className="mx-1 text-salmon">{"//"}</span> <span className="text-salmon">Synchronized with production</span>
        </p>
        <h1 className="display relative mt-2 text-5xl sm:text-6xl">
          Master <span className="text-red">content</span> engine
        </h1>
        <p className="relative mt-3 max-w-2xl text-[17px] leading-relaxed text-rose">
          Kelola showcase publik {settings.full_name}: identitas visual, deskripsi, statistik, tech stack, dan proyek.
        </p>
      </section>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className={cn("panel p-5", t.accent && "border-b-red-deep")}>
            <div className="flex items-center justify-between">
              <p className="label !text-rose">{t.label}</p>
              <t.icon className="size-4 text-salmon" />
            </div>
            <p className="mt-3 font-display text-6xl leading-none text-cream">{t.value}</p>
            <p className="mt-3 flex justify-between text-sm text-rose"><span>{t.left}</span><span>{t.right}</span></p>
          </div>
        ))}
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <p className="label !text-rose">Status portfolio</p>
            <CloudCheck className="size-4 text-salmon" />
          </div>
          <p className="mt-5 flex items-center gap-3 text-lg font-bold uppercase text-cream"><i className="dot" /> Live &amp; tersinkron</p>
          <p className="mt-4 font-mono text-xs tracking-[0.08em] text-rose">Profil diperbarui:<br />{updated}</p>
        </div>
      </div>

      <nav aria-label="Bagian konten" className="mt-6 flex flex-wrap gap-1 rounded-xl bg-ink p-1.5">
        {TABS.map((t, i) => (
          <Link
            key={t.key}
            href={`/admin?tab=${t.key}`}
            scroll={false}
            aria-current={tab === t.key ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors",
              tab === t.key ? "bg-red text-white" : "text-rose hover:bg-panel hover:text-cream",
            )}
          >
            <t.icon className="size-4" /> {pad2(i + 1)}. {t.label}
          </Link>
        ))}
      </nav>

      <div className="mt-5">
        {tab === "profil" || tab === "bio" || tab === "statistik" ? (
          <SettingsForm key={tab} tab={tab as SettingsTab} settings={settings} />
        ) : null}

        {tab === "proyek" ? (
          <section className="panel p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label">Showcase</p>
                <h2 className="mt-1 text-2xl font-semibold text-cream">Manajemen Proyek</h2>
              </div>
              <div className="flex gap-3">
                <Link href="/admin/projects" className="btn btn-dark">Kelola semua <ArrowRight className="size-4" /></Link>
                <Link href="/admin/projects/new" className="btn btn-red"><Plus className="size-4" /> Tambah proyek baru</Link>
              </div>
            </div>
            <ul className="mt-6 divide-y divide-line">
              {projects.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                  <Link href={`/admin/projects/${p.id}/edit`} className="min-w-0 hover:text-salmon">
                    <span className="block truncate font-semibold text-cream">{p.featured ? "★ " : ""}{p.title}</span>
                    <span className="font-mono text-xs text-mute">/{p.slug}</span>
                  </Link>
                  <span className="tag uppercase">{p.status}</span>
                </li>
              ))}
              {!projects.length ? <li className="py-8 text-center text-mute">Belum ada proyek.</li> : null}
            </ul>
          </section>
        ) : null}

        {tab === "keahlian" ? (
          <section className="panel p-7">
            <p className="label">Technical arsenal</p>
            <h2 className="mt-1 text-2xl font-semibold text-cream">Bidang &amp; Keahlian</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {lists.skills.map((s) => (
                <li key={s.id} className="flex items-center gap-1 rounded-lg bg-panel-2 py-1 pl-3 pr-1 font-mono text-xs uppercase tracking-[0.14em] text-cream">
                  {s.name}
                  <DeleteButton table="skills" id={s.id} label={s.name} />
                </li>
              ))}
              {!lists.skills.length ? <li className="text-mute">Belum ada keahlian.</li> : null}
            </ul>
            <form action={addSkillAction} className="mt-6 flex max-w-md gap-3">
              <input name="name" required aria-label="Nama keahlian" placeholder="+ Tambah tech / tool…" className="field !bg-ink font-mono" />
              <button className="btn btn-dark">Insert tag</button>
            </form>
          </section>
        ) : null}

        {tab === "proses" ? (
          <div className="grid gap-5 xl:grid-cols-2">
            <section className="panel p-7">
              <p className="label">Credentials</p>
              <h2 className="mt-1 text-2xl font-semibold text-cream">Sertifikat</h2>
              <ul className="mt-6 space-y-3">
                {lists.certificates.map((c, i) => (
                  <li key={c.id} className="flex items-center gap-3 rounded-xl bg-panel-2 p-3">
                    <MoveButtons table="certificates" id={c.id} first={i === 0} last={i === lists.certificates.length - 1} />
                    {c.image_url ? <img src={c.image_url} alt="" className="size-12 shrink-0 rounded-lg object-cover" /> : null}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-cream">{c.title}</p>
                      <p className="truncate text-sm text-mute">{c.issuer}</p>
                    </div>
                    <span className="font-mono text-xs tracking-[0.12em] text-salmon">{c.issued_at}</span>
                    <DeleteButton table="certificates" id={c.id} label={c.title} />
                  </li>
                ))}
                {!lists.certificates.length ? <li className="text-mute">Belum ada sertifikat.</li> : null}
              </ul>
              <CertificateForm />
            </section>
            <section className="panel p-7">
              <p className="label">Academic</p>
              <h2 className="mt-1 text-2xl font-semibold text-cream">Education</h2>
              <ul className="mt-6 space-y-3">
                {lists.education.map((ed, i) => (
                  <li key={ed.id} className="flex items-center gap-3 rounded-xl bg-panel-2 p-3">
                    <MoveButtons table="education" id={ed.id} first={i === 0} last={i === lists.education.length - 1} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-cream">{ed.title}</p>
                      <p className="text-sm text-mute">{ed.institution}</p>
                    </div>
                    <span className="font-mono text-xs tracking-[0.12em] text-salmon">{ed.period}</span>
                    <DeleteButton table="education" id={ed.id} label={ed.title} />
                  </li>
                ))}
              </ul>
              <form action={addEducationAction} className="mt-5 grid gap-3 sm:grid-cols-2">
                <input name="title" required aria-label="Gelar atau sertifikat" placeholder="Gelar / sertifikat" className="field !bg-ink sm:col-span-2" />
                <input name="institution" required aria-label="Institusi" placeholder="Institusi" className="field !bg-ink" />
                <input name="period" required aria-label="Periode" placeholder="2020 - 2024" className="field !bg-ink font-mono" />
                <button className="btn btn-dark sm:col-span-2"><Plus className="size-4" /> Tambah entri</button>
              </form>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
