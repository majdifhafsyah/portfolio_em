import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import {
  FALLBACK_EDUCATION,
  FALLBACK_PROCESS,
  FALLBACK_PROJECTS,
  FALLBACK_SETTINGS,
  FALLBACK_SKILLS,
} from "@/lib/fallback";
import type { Education, ProcessStep, Project, SiteSettings, Skill } from "@/lib/types";

// ---------------------------------------------------------------------------
// Publik: klien anon tanpa cookie, di-cache dengan tag.
// ---------------------------------------------------------------------------

// Tanpa log ini, kegagalan Supabase tak terlihat: situs diam-diam menampilkan data cadangan.
function logFallback(table: string, error: { message: string }) {
  console.error(`[supabase] ${table} gagal, memakai data cadangan: ${error.message}`);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag("settings");
  const { data, error } = await createPublicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) logFallback("site_settings", error);
  return data ?? FALLBACK_SETTINGS;
}

export async function getPublishedProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");
  const { data, error } = await createPublicClient()
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return logFallback("projects", error), FALLBACK_PROJECTS;
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");
  const { data, error } = await createPublicClient().from("projects").select("*").eq("slug", slug).maybeSingle();
  if (error) return logFallback("projects", error), FALLBACK_PROJECTS.find((p) => p.slug === slug) ?? null;
  return data;
}

export async function getEducation(): Promise<Education[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("education");
  const { data, error } = await createPublicClient().from("education").select("*").order("sort_order");
  return error ? (logFallback("education", error), FALLBACK_EDUCATION) : (data ?? []);
}

export async function getSkills(): Promise<Skill[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("skills");
  const { data, error } = await createPublicClient().from("skills").select("*").order("sort_order");
  return error ? (logFallback("skills", error), FALLBACK_SKILLS) : (data ?? []);
}

export async function getProcessSteps(): Promise<ProcessStep[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("process");
  const { data, error } = await createPublicClient().from("process_steps").select("*").order("sort_order");
  return error ? (logFallback("process_steps", error), FALLBACK_PROCESS) : (data ?? []);
}

// ---------------------------------------------------------------------------
// Admin: klien dengan sesi (cookie), tanpa cache.
// ---------------------------------------------------------------------------

export async function getCurrentAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, isAdmin: false };
  const { data: isAdmin } = await supabase.rpc("is_admin");
  return { user, isAdmin: Boolean(isAdmin) };
}

export async function adminGetSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data ?? FALLBACK_SETTINGS;
}

export async function adminGetProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function adminGetProject(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function adminGetLists() {
  const supabase = await createClient();
  const [education, skills, process] = await Promise.all([
    supabase.from("education").select("*").order("sort_order"),
    supabase.from("skills").select("*").order("sort_order"),
    supabase.from("process_steps").select("*").order("sort_order"),
  ]);
  return {
    education: (education.data ?? []) as Education[],
    skills: (skills.data ?? []) as Skill[],
    process: (process.data ?? []) as ProcessStep[],
  };
}
