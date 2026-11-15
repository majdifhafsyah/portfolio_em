import Link from "next/link";
import { LogIn } from "lucide-react";
import { cacheLife } from "next/cache";
import type { SiteSettings } from "@/lib/types";
import { Brand } from "@/components/site/header";

export async function SiteFooter({ settings }: { settings: SiteSettings }) {
  "use cache";
  cacheLife("days");
  const year = new Date().getFullYear();
  const links = [
    { label: "GitHub", href: settings.github_url },
    { label: "LinkedIn", href: settings.linkedin_url },
    { label: "Twitter/X", href: settings.twitter_url },
    { label: "Email", href: settings.email ? `mailto:${settings.email}` : null },
  ].filter((l): l is { label: string; href: string } => Boolean(l.href));

  return (
    <footer className="mt-auto border-t border-white/5 bg-ink">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Brand name={settings.full_name} />
          <p className="label mt-2 !tracking-[0.1em] !text-rose">
            © {year} {settings.full_name}. Architected with technical precision.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="rounded-full bg-panel-2 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-rose transition-colors hover:bg-panel-3 hover:text-cream">
              {l.label}
            </a>
          ))}
          <Link href="/admin/login" className="ml-0 flex items-center gap-2 rounded-full bg-panel-2 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-rose transition-colors hover:text-cream lg:ml-10">
            <LogIn className="size-3.5" /> Masuk
          </Link>
        </div>
      </div>
    </footer>
  );
}
