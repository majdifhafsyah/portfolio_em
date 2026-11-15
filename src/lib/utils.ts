export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
export function pad2(n: number) {
  return String(n).padStart(2, "0");
}
export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}
export function initials(name: string) {
  return name.split(/\s+/).map((s) => s[0]).join("").slice(0, 2).toUpperCase();
}
export function hostOf(url: string | null | undefined) {
  if (!url) return "";
  try {
    const u = new URL(url);
    return (u.host + u.pathname).replace(/\/$/, "");
  } catch {
    return url;
  }
}
