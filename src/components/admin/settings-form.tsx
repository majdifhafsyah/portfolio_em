"use client";

import { useActionState, useState } from "react";
import { Code2, Eye, Fingerprint, MapPin, Save, User } from "lucide-react";
import Link from "next/link";
import { saveSettingsAction, type ActionState } from "@/lib/actions";
import type { SiteSettings } from "@/lib/types";
import { Field, Toggle } from "@/components/admin/ui";
import { UploadButton } from "@/components/admin/image-upload";

const initial: ActionState = { ok: false };
export type SettingsTab = "profil" | "bio" | "statistik";

function IconInput({ icon: Icon, ...props }: { icon: typeof User } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-salmon" />
      <input {...props} className="field !bg-ink !py-3.5 !pl-11" />
    </div>
  );
}

export function SettingsForm({ tab, settings }: { tab: SettingsTab; settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(saveSettingsAction, initial);
  const [dirty, setDirty] = useState(false);
  const [photo, setPhoto] = useState(settings.photo_url ?? "");
  const [workspace, setWorkspace] = useState(settings.workspace_image_url ?? "");
  const e = state.errors ?? {};

  return (
    <form action={formAction} onChange={() => setDirty(true)} onSubmit={() => setDirty(false)} className="space-y-5">
      {tab === "profil" ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,470px)_1fr]">
          <section className="panel p-7">
            <header className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-cream">Foto Tampilan Utama</h2>
              <span className="rounded-full bg-red-deep px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-salmon">Transparan PNG</span>
            </header>
            <div className="hero-bg relative mt-5 aspect-[3/4] overflow-hidden rounded-xl">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="Pratinjau foto profil" className="size-full object-contain object-bottom" />
              ) : (
                <p className="absolute inset-0 grid place-items-center px-8 text-center text-sm text-rose">
                  Belum ada foto. Unggah PNG transparan untuk hero beranda.
                </p>
              )}
            </div>
            <input type="hidden" name="photo_url" value={photo} />
            <div className="mt-5 flex flex-wrap gap-3">
              <UploadButton folder="profile" onUploaded={(url) => { setPhoto(url); setDirty(true); }} className="btn btn-red flex-1" />
              {photo ? (
                <button type="button" className="btn btn-dark" onClick={() => { setPhoto(""); setDirty(true); }}>Hapus foto</button>
              ) : null}
            </div>
            <p className="mt-4 text-center text-sm text-rose">
              Format disarankan: PNG transparan atau WebP, resolusi minimal 1000px tinggi.
            </p>
          </section>

          <section className="panel p-7">
            <header className="flex items-start justify-between">
              <div>
                <p className="label">Identity metadata</p>
                <h2 className="mt-1 text-2xl font-semibold text-cream">Data Personal &amp; Branding</h2>
              </div>
              <Fingerprint className="size-6 text-salmon" />
            </header>
            <div className="mt-6 space-y-6">
              <Field label="Nama lengkap sesuai header" htmlFor="full_name" error={e.full_name}>
                <IconInput icon={User} id="full_name" name="full_name" defaultValue={settings.full_name} required />
              </Field>
              <Field label="Headline profesi (hero subtitle)" htmlFor="headline" error={e.headline} hint="Gunakan bullet '•' sebagai pemisah pilar fokus kompetensi.">
                <IconInput icon={Code2} id="headline" name="headline" defaultValue={settings.headline} required />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-panel-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className="label !text-rose">Ketersediaan hire</span>
                    <i className="dot" />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-cream">Available for Hire</p>
                      <p className="text-xs text-rose">Status aktif di bar utama</p>
                    </div>
                    <input type="hidden" name="_has_available" value="1" />
                    <Toggle name="available_for_hire" defaultChecked={settings.available_for_hire} label="Available for hire" />
                  </div>
                </div>
                <div className="rounded-xl bg-panel-2 p-4">
                  <label htmlFor="location" className="label !text-rose">Lokasi operasional</label>
                  <div className="mt-3"><IconInput icon={MapPin} id="location" name="location" defaultValue={settings.location ?? ""} /></div>
                  <p className="mt-2 text-xs text-rose">Ditampilkan di hero.</p>
                </div>
              </div>
              <fieldset>
                <legend className="label">Koneksi sosial &amp; public profiles</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {([["GH", "github_url", "https://github.com/…"], ["LI", "linkedin_url", "https://linkedin.com/in/…"], ["X", "twitter_url", "https://x.com/…"]] as const).map(([tagLabel, key, ph]) => (
                    <div key={key}>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-salmon">{tagLabel}</span>
                        <input name={key} aria-label={key} defaultValue={settings[key] ?? ""} placeholder={ph} className="field !bg-ink !pl-10 font-mono !text-xs" />
                      </div>
                      {e[key] ? <p className="mt-1 text-xs text-red-hi">{e[key]}</p> : null}
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>
        </div>
      ) : null}

      {tab === "bio" ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <section className="panel space-y-6 p-7">
            <div>
              <p className="label">Narrative</p>
              <h2 className="mt-1 text-2xl font-semibold text-cream">Deskripsi &amp; Bio</h2>
            </div>
            <Field label="Paragraf hero" htmlFor="bio"><textarea id="bio" name="bio" rows={3} defaultValue={settings.bio ?? ""} className="field !bg-ink" /></Field>
            <Field label="Kartu intro (kanan hero)" htmlFor="intro"><textarea id="intro" name="intro" rows={3} defaultValue={settings.intro ?? ""} className="field !bg-ink" /></Field>
            <Field label="Kutipan" htmlFor="quote"><textarea id="quote" name="quote" rows={4} defaultValue={settings.quote ?? ""} className="field !bg-ink" /></Field>
            <Field label="Peran di bawah kutipan" htmlFor="quote_role"><input id="quote_role" name="quote_role" defaultValue={settings.quote_role ?? ""} className="field !bg-ink" /></Field>
          </section>
          <section className="panel space-y-6 p-7">
            <div>
              <p className="label">Inquiries</p>
              <h2 className="mt-1 text-2xl font-semibold text-cream">Kontak &amp; Workspace</h2>
            </div>
            <Field label="Paragraf ajakan kontak" htmlFor="contact_blurb"><textarea id="contact_blurb" name="contact_blurb" rows={4} defaultValue={settings.contact_blurb ?? ""} className="field !bg-ink" /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Direct email" htmlFor="email" error={e.email}><input id="email" name="email" type="email" defaultValue={settings.email ?? ""} className="field !bg-ink font-mono" /></Field>
              <Field label="Portfolio web" htmlFor="website"><input id="website" name="website" defaultValue={settings.website ?? ""} className="field !bg-ink font-mono" /></Field>
            </div>
            <Field label="Primary location" htmlFor="location_detail"><input id="location_detail" name="location_detail" defaultValue={settings.location_detail ?? ""} className="field !bg-ink" /></Field>
            <Field label="Foto workspace (kartu terminal)" hint="Opsional. Rasio lebar 2:1 paling pas." error={e.workspace_image_url}>
              <input type="hidden" name="workspace_image_url" value={workspace} />
              <div className="flex flex-wrap items-center gap-3">
                <UploadButton folder="workspace" onUploaded={(url) => { setWorkspace(url); setDirty(true); }} className="btn btn-dark" label={workspace ? "Ganti gambar" : "Unggah gambar"} />
                {workspace ? <span className="truncate font-mono text-xs text-mute">{workspace.split("/").pop()}</span> : null}
              </div>
            </Field>
          </section>
        </div>
      ) : null}

      {tab === "statistik" ? (
        <section className="panel p-7">
          <p className="label">Hero telemetry</p>
          <h2 className="mt-1 text-2xl font-semibold text-cream">Statistik Cepat</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {([["stat_years", "Years experience", "3+"], ["stat_projects", "Projects delivered", "35+"], ["stat_uptime", "Uptime & client trust", "99%"], ["lighthouse_score", "Lighthouse score", "100/100"]] as const).map(([key, lbl, ph]) => (
              <div key={key} className="rounded-xl bg-panel-2 p-4">
                <Field label={lbl} htmlFor={key} error={e[key]}>
                  <input id={key} name={key} defaultValue={settings[key]} placeholder={ph} required className="field !bg-ink font-display !text-2xl !text-salmon" />
                </Field>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Bar simpan */}
      <div className="sticky bottom-4 z-20 flex flex-col gap-4 rounded-2xl bg-panel-2 p-4 shadow-[0_20px_60px_-10px_rgb(0_0_0/0.9)] sm:flex-row sm:items-center sm:justify-between sm:px-6" role="status">
        <div className="flex items-center gap-3">
          <i className={dirty ? "dot" : "size-2 rounded-full bg-dim"} />
          <div>
            <p className="label !text-[13px] !text-cream">
              {state.ok && !dirty ? "Tersimpan" : dirty ? "Perubahan belum disimpan" : "Tidak ada perubahan"}
            </p>
            <p className="text-sm text-rose">
              {state.message && !dirty ? state.message : "Situs publik diperbarui begitu disimpan."}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/" target="_blank" className="btn btn-dark !bg-panel"><Eye className="size-4" /> Pratinjau langsung</Link>
          <button type="submit" disabled={pending} className="btn btn-red"><Save className="size-4" /> {pending ? "Menyimpan…" : "Simpan perubahan"}</button>
        </div>
      </div>
    </form>
  );
}
