"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { Metric, ProjectStatus, SiteSettings } from "@/lib/types";

export type ActionState = { ok: boolean; message?: string; errors?: Record<string, string> };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Belum login.");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) throw new Error("Akun ini bukan admin.");
  return supabase;
}

function zodErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

const optionalUrl = z.string().trim().url("URL tidak valid").or(z.literal("")).optional();
const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  email: z.string().trim().email("Email tidak valid"),
  password: z.string().min(6, "Minimal 6 karakter"),
  next: z.string().optional(),
});

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, errors: zodErrors(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { ok: false, message: "Email atau passphrase salah." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { ok: false, message: "Akun ini tidak terdaftar sebagai admin." };
  }

  const next = parsed.data.next?.startsWith("/admin") ? parsed.data.next : "/admin";
  redirect(next);
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Site settings (Kelola Data Portfolio). Tiap tab mengirim sebagian kolom.
// ---------------------------------------------------------------------------

const TEXT_FIELDS = [
  "full_name", "headline", "bio", "intro", "photo_url", "location", "email", "website",
  "location_detail", "github_url", "linkedin_url", "twitter_url", "stat_years", "stat_projects",
  "stat_uptime", "lighthouse_score", "quote", "quote_role", "contact_blurb", "workspace_image_url",
] as const satisfies ReadonlyArray<keyof SiteSettings>;

const REQUIRED = new Set(["full_name", "headline", "stat_years", "stat_projects", "stat_uptime", "lighthouse_score"]);

export async function saveSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const patch: Record<string, string | boolean | null> = {};
  const errors: Record<string, string> = {};

  for (const key of TEXT_FIELDS) {
    if (!formData.has(key)) continue;
    const value = str(formData.get(key));
    if (!value && REQUIRED.has(key)) errors[key] = "Wajib diisi";
    if (value && key.endsWith("_url") && !/^https?:\/\//.test(value)) errors[key] = "Harus diawali http(s)://";
    if (value && key === "email" && !z.string().email().safeParse(value).success) errors[key] = "Email tidak valid";
    patch[key] = value || null;
  }
  if (formData.has("_has_available")) patch.available_for_hire = formData.get("available_for_hire") === "on";
  if (Object.keys(errors).length) return { ok: false, errors, message: "Periksa kembali isian yang ditandai." };

  const supabase = await requireAdmin();
  const { error } = await supabase.from("site_settings").update(patch as Partial<SiteSettings>).eq("id", 1);
  if (error) return { ok: false, message: error.message };

  updateTag("settings");
  revalidatePath("/admin");
  return { ok: true, message: "Perubahan tersimpan dan sudah tayang." };
}

// ---------------------------------------------------------------------------
// Daftar sederhana: keahlian, pendidikan, proses kerja
// ---------------------------------------------------------------------------

export async function addSkillAction(formData: FormData) {
  const name = str(formData.get("name"));
  if (!name) return;
  const supabase = await requireAdmin();
  await supabase.from("skills").insert({ name, sort_order: Date.now() % 1_000_000 });
  updateTag("skills");
  revalidatePath("/admin");
}

export async function addEducationAction(formData: FormData) {
  const title = str(formData.get("title"));
  const institution = str(formData.get("institution"));
  const period = str(formData.get("period"));
  if (!title || !institution || !period) return;
  const supabase = await requireAdmin();
  await supabase.from("education").insert({ title, institution, period, sort_order: Date.now() % 1_000_000 });
  updateTag("education");
  revalidatePath("/admin");
}

export async function addCertificateAction(formData: FormData) {
  const title = str(formData.get("title"));
  const issuer = str(formData.get("issuer"));
  const issued_at = str(formData.get("issued_at"));
  const credential_url = str(formData.get("credential_url"));
  const image_url = str(formData.get("image_url"));
  if (!title || !issuer || !issued_at) return;
  // Hanya http(s): mencegah javascript: lolos ke href publik.
  const bad = (u: string) => u && !/^https?:\/\//.test(u);
  if (bad(credential_url) || bad(image_url)) return;
  const supabase = await requireAdmin();
  await supabase.from("certificates").insert({
    title, issuer, issued_at, credential_url: credential_url || null, image_url: image_url || null,
    sort_order: Date.now() % 1_000_000,
  });
  updateTag("certificates");
  revalidatePath("/admin");
}

export async function addProcessStepAction(formData: FormData) {
  const title = str(formData.get("title"));
  const description = str(formData.get("description"));
  const icon = str(formData.get("icon")) || "search";
  if (!title || !description) return;
  const supabase = await requireAdmin();
  await supabase.from("process_steps").insert({ title, description, icon, sort_order: Date.now() % 1_000_000 });
  updateTag("process");
  revalidatePath("/admin");
}

const LIST_TABLES = { skills: "skills", education: "education", process_steps: "process", certificates: "certificates" } as const;

export async function deleteListItemAction(formData: FormData) {
  const table = str(formData.get("table")) as keyof typeof LIST_TABLES;
  const id = str(formData.get("id"));
  if (!id || !(table in LIST_TABLES)) return;
  const supabase = await requireAdmin();
  await supabase.from(table).delete().eq("id", id);
  updateTag(LIST_TABLES[table]);
  revalidatePath("/admin");
}

// Geser item ke atas/bawah: urutan tampil dinomori ulang 0..n lalu dua item ditukar.
export async function moveListItemAction(formData: FormData) {
  const table = str(formData.get("table")) as keyof typeof LIST_TABLES;
  const id = str(formData.get("id"));
  const dir = formData.get("dir") === "up" ? -1 : 1;
  if (!id || !(table in LIST_TABLES)) return;
  const supabase = await requireAdmin();
  const { data } = await supabase.from(table).select("id").order("sort_order");
  const ids = (data ?? []).map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await Promise.all(ids.map((rid, n) => supabase.from(table).update({ sort_order: n }).eq("id", rid)));
  updateTag(LIST_TABLES[table]);
  revalidatePath("/admin");
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

const projectSchema = z.object({
  id: z.string().uuid().or(z.literal("")).optional(),
  title: z.string().trim().min(2, "Judul minimal 2 karakter").max(60, "Maks. 60 karakter"),
  slug: z.string().trim().optional(),
  category: z.string().trim().min(1, "Kategori wajib diisi"),
  subtitle: z.string().trim().optional(),
  tagline: z.string().trim().optional(),
  description: z.string().optional(),
  cover_url: optionalUrl,
  gallery_urls: z.string().optional(), // JSON string[]
  tech_stack: z.string().optional(), // JSON string[]
  architecture: z.string().trim().optional(),
  metrics: z.string().optional(), // JSON Metric[]
  live_url: optionalUrl,
  repo_url: optionalUrl,
  docs_url: optionalUrl,
  status: z.enum(["draft", "published", "archived"]),
  sort_order: z.coerce.number().int().min(0).optional(),
  period: z.string().trim().optional(),
  meta_title: z.string().trim().optional(),
  meta_description: z.string().trim().optional(),
});

function parseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function saveProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, errors: zodErrors(parsed.error), message: "Periksa kembali isian yang ditandai." };
  }
  const d = parsed.data;
  const supabase = await requireAdmin();

  const payload = {
    title: d.title,
    slug: slugify(d.slug || d.title),
    category: d.category,
    subtitle: d.subtitle || null,
    tagline: d.tagline || null,
    description: d.description?.trim() || null,
    cover_url: d.cover_url || null,
    gallery_urls: parseJson<string[]>(d.gallery_urls, []).filter(Boolean),
    tech_stack: parseJson<string[]>(d.tech_stack, []).filter(Boolean),
    architecture: d.architecture || null,
    metrics: parseJson<Metric[]>(d.metrics, []).filter((m) => m.value?.trim()),
    live_url: d.live_url || null,
    repo_url: d.repo_url || null,
    repo_private: formData.get("repo_private") === "on",
    docs_url: d.docs_url || null,
    status: (formData.get("intent") === "draft" ? "draft" : d.status) as ProjectStatus,
    featured: formData.get("featured") === "on",
    sort_order: d.sort_order ?? 0,
    period: d.period || null,
    meta_title: d.meta_title || null,
    meta_description: d.meta_description || null,
  };

  const { error } = d.id
    ? await supabase.from("projects").update(payload).eq("id", d.id)
    : await supabase.from("projects").insert(payload);

  if (error) {
    return {
      ok: false,
      message: error.code === "23505" ? "Slug sudah dipakai proyek lain." : error.message,
      errors: error.code === "23505" ? { slug: "Slug sudah dipakai" } : undefined,
    };
  }

  updateTag("projects");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

const BULK = ["feature", "unfeature", "publish", "draft", "archive", "delete"] as const;

export async function bulkProjectsAction(formData: FormData) {
  const op = str(formData.get("op")) as (typeof BULK)[number];
  const ids = formData.getAll("ids").map(String).filter(Boolean);
  if (!ids.length || !BULK.includes(op)) return;

  const supabase = await requireAdmin();
  const q = supabase.from("projects");
  if (op === "delete") await q.delete().in("id", ids);
  else if (op === "feature") await q.update({ featured: true }).in("id", ids);
  else if (op === "unfeature") await q.update({ featured: false }).in("id", ids);
  else if (op === "publish") await q.update({ status: "published" }).in("id", ids);
  else if (op === "draft") await q.update({ status: "draft" }).in("id", ids);
  else if (op === "archive") await q.update({ status: "archived", featured: false }).in("id", ids);

  updateTag("projects");
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}
