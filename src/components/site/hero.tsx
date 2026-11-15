import Link from "next/link";
import { ArrowRight, FolderOpen, Globe, Sparkles, Terminal } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

function PhotoPlaceholder() {
  // Siluet netral; tampil hanya sampai foto diunggah dari Portal Admin.
  return (
    <svg viewBox="0 0 400 520" className="h-full w-auto" aria-hidden>
      <defs>
        <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1414" />
          <stop offset="1" stopColor="#0f0d0d" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="130" r="82" fill="url(#sil)" />
      <path d="M40 520c0-130 60-205 160-205s160 75 160 205z" fill="url(#sil)" />
    </svg>
  );
}

export function Hero({ settings }: { settings: SiteSettings }) {
  const [first, ...rest] = settings.full_name.split(" ");
  const stats = [
    { value: settings.stat_years, top: "Years", bottom: "Experience" },
    { value: settings.stat_projects, top: "Projects", bottom: "Delivered" },
    { value: settings.stat_uptime, top: "Uptime &", bottom: "Client trust" },
  ];

  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="relative mx-auto min-h-[640px] max-w-[1280px] px-5 lg:h-[calc(100svh-72px)] lg:max-h-[860px] lg:min-h-[540px] lg:px-8">
        <p
          aria-hidden
          className="hero-word pointer-events-none select-none pt-6 text-center font-display text-[16vw] uppercase leading-[0.86] lg:pt-3 lg:text-[min(21.5vw,276px,32svh)]"
        >
          Portfolio
        </p>

        {/* Foto */}
        <div className="pointer-events-none absolute inset-x-0 top-[2vw] flex h-[98vw] justify-center lg:bottom-0 lg:top-auto lg:h-[94%]">
          {settings.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.photo_url}
              alt={`Foto ${settings.full_name}`}
              className="h-full w-auto max-w-none object-contain object-bottom [mask-image:linear-gradient(to_bottom,#000_70%,transparent)] lg:[mask-image:none] drop-shadow-[0_0_40px_rgb(0_0_0/0.6)]"
            />
          ) : (
            <PhotoPlaceholder />
          )}
        </div>

        <div className="relative z-10 grid gap-8 pb-6 pt-[78vw] lg:absolute lg:inset-x-8 lg:bottom-10 lg:grid-cols-[minmax(0,430px)_1fr_minmax(0,330px)] lg:items-end lg:pb-0 lg:pt-0">
          <div>
            <p className="font-serif text-3xl italic text-salmon">Hello, I&apos;m</p>
            <h1 className="display mt-2 text-6xl sm:text-7xl">
              {first}
              <span className="block text-red">{rest.join(" ")}</span>
            </h1>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-panel-2/90 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream">
              <Terminal className="size-3.5 text-salmon" /> {settings.headline}
            </p>
            {settings.bio ? <p className="mt-4 max-w-[400px] text-[17px] leading-relaxed text-rose">{settings.bio}</p> : null}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/#contact" className="btn btn-red">
                Let&apos;s build <ArrowRight className="size-4" />
              </Link>
              <Link href="/#projects" className="btn btn-dark">
                <FolderOpen className="size-4" /> Works
              </Link>
            </div>
            {settings.location ? (
              <p className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-rose">
                <Globe className="size-3.5" /> {settings.location}
              </p>
            ) : null}
          </div>

          <div className="hidden lg:block" />

          <div className="space-y-3">
            {settings.intro ? (
              <div className="flex gap-3 rounded-xl bg-panel/90 p-4 backdrop-blur">
                <Sparkles className="mt-0.5 size-5 shrink-0 text-salmon" />
                <p className="text-[15px] leading-relaxed text-rose">{settings.intro}</p>
              </div>
            ) : null}
            <dl className="space-y-4 rounded-xl bg-panel/90 p-5 backdrop-blur">
              {stats.map((s) => {
                const m = s.value.match(/^(.*?)([+%]?)$/);
                return (
                  <div key={s.top} className="flex items-center gap-4">
                    <dd className="w-24 font-display text-5xl leading-none text-salmon">
                      {m?.[1]}
                      <span className="align-top text-3xl text-red">{m?.[2]}</span>
                    </dd>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em]">
                      <span className="block text-sm text-cream">{s.top}</span>
                      <span className="text-salmon">{s.bottom}</span>
                    </dt>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
