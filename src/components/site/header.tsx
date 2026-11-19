import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { initials } from "@/lib/utils";
import { NavPills } from "@/components/site/nav-pills";

export function Brand({ name }: { name: string }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-mono text-sm tracking-[0.18em]">
      <span className="text-base font-bold tracking-normal text-salmon">{initials(name)}</span>
      <span className="hidden text-dim min-[480px]:inline">/</span>
      <span className="hidden uppercase text-cream min-[480px]:inline">{name}</span>
    </Link>
  );
}

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-5 lg:px-8">
        <div className="flex items-center gap-5">
          <Brand name={settings.full_name} />
          {settings.available_for_hire ? (
            <span className="hidden items-center gap-2 rounded-full bg-red-ink px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-salmon sm:inline-flex">
              <i className="dot" /> Available for hire
            </span>
          ) : null}
        </div>
        <NavPills />
        <div className="flex items-center gap-3">
          <Link href="/#contact" className="btn btn-red !rounded-full !py-2.5">
            Get in touch
          </Link>
          <span className="hidden size-9 overflow-hidden rounded-full border border-line-2 bg-panel-2 sm:block">
            {settings.photo_url ? (
              <Image src={settings.photo_url} alt="" width={72} height={72} className="size-full object-cover object-top" />
            ) : (
              <span className="grid size-full place-items-center font-mono text-[10px] text-salmon">
                {initials(settings.full_name)}
              </span>
            )}
          </span>
        </div>
      </div>
    </header>
  );
}
