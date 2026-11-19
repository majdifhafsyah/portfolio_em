import Link from "next/link";
import {
  ArrowRight, Award, Code2, Gauge, GitBranch, Globe, Mail, MapPin, Play, Quote, Rocket, Search, Zap,
  type LucideIcon,
} from "lucide-react";
import type { Certificate, Education, ProcessStep, Project, SiteSettings, Skill } from "@/lib/types";
import { pad2 } from "@/lib/utils";
import { ProjectCard } from "@/components/site/project-card";

export const PROCESS_ICONS: Record<string, LucideIcon> = {
  search: Search, git: GitBranch, code: Code2, zap: Zap, rocket: Rocket,
};

export function SelectedProjects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mx-auto max-w-[1280px] px-5 pb-12 pt-10 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label flex items-center gap-2"><i className="dot" /> Engineered applications</p>
          <h2 className="mt-2 text-4xl font-bold uppercase tracking-tight text-cream">Selected projects</h2>
        </div>
        <Link href="/projects" className="label flex items-center gap-2 !text-[13px] hover:text-cream">
          View all archives <ArrowRight className="size-4" />
        </Link>
      </div>
      {projects.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      ) : (
        <p className="panel p-8 text-mute">Belum ada proyek yang dipublikasikan.</p>
      )}
    </section>
  );
}

export function Certificates({ items }: { items: Certificate[] }) {
  if (!items.length) return null;
  return (
    <section id="certificates" className="mx-auto max-w-[1280px] px-5 pb-12 lg:px-8">
      <p className="label flex items-center gap-2"><Award className="size-4" /> Credentials</p>
      <h2 className="mt-2 text-4xl font-bold uppercase tracking-tight text-cream">Certificates</h2>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => {
          const body = (
            <>
              {c.image_url ? <img src={c.image_url} alt={`Sertifikat ${c.title}`} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" /> : null}
              <p className="mt-4 font-semibold text-cream">{c.title}</p>
              <p className="text-sm text-mute">{c.issuer}</p>
              <p className="mt-2 font-mono text-[13px] tracking-[0.12em] text-salmon">{c.issued_at}</p>
            </>
          );
          return (
            <li key={c.id}>
              {c.credential_url ? (
                <a href={c.credential_url} target="_blank" rel="noopener noreferrer" className="panel block p-4 transition-colors hover:border-red">{body}</a>
              ) : (
                <div className="panel p-4">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AboutGrid({
  settings, education, skills, process,
}: { settings: SiteSettings; education: Education[]; skills: Skill[]; process: ProcessStep[] }) {
  return (
    <section className="mx-auto grid max-w-[1280px] gap-5 px-5 pb-12 lg:grid-cols-[1fr_1.27fr_0.74fr] lg:px-8">
      {/* Education & Skills */}
      <div id="skills" className="panel flex flex-col p-6">
        <p className="label">Academic &amp; toolkit</p>
        <h2 className="mt-1 text-2xl font-bold uppercase tracking-tight text-cream">Education &amp; skills</h2>

        <p className="label mt-6">Education</p>
        <ul className="mt-3 space-y-4">
          {education.map((e) => (
            <li key={e.id} className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-cream">{e.title}</p>
                <p className="text-sm text-mute">{e.institution}</p>
              </div>
              <span className="shrink-0 font-mono text-[13px] tracking-[0.12em] text-salmon">{e.period}</span>
            </li>
          ))}
        </ul>

        <p className="label mt-7">Technical arsenal</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {skills.map((s) => (
            <li key={s.id} className="tag uppercase !tracking-[0.14em] !text-cream">{s.name}</li>
          ))}
        </ul>

        <div className="mt-auto pt-7">
          <div className="flex items-center justify-between rounded-lg bg-panel-2 px-4 py-3">
            <span className="label flex items-center gap-2 !text-rose"><Gauge className="size-4" /> Lighthouse score</span>
            <span className="flex items-center gap-2 font-bold text-cream">
              <svg viewBox="0 0 40 14" className="w-9" aria-hidden>
                <polyline points="0,11 8,9 14,11 20,6 27,8 33,3 40,2" fill="none" stroke="#e02626" strokeWidth="1.6" />
              </svg>
              {settings.lighthouse_score}
            </span>
          </div>
        </div>
      </div>

      {/* Work Process */}
      <div id="process" className="panel p-6">
        <p className="label">Methodology</p>
        <h2 className="mt-1 text-2xl font-bold uppercase tracking-tight text-cream">Work process</h2>
        <ol className="relative mt-6 space-y-5 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-line-2">
          {process.map((step, i) => {
            const Icon = PROCESS_ICONS[step.icon] ?? Search;
            return (
              <li key={step.id} className="relative flex gap-4">
                <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-lg bg-panel-3 text-salmon">
                  <Icon className="size-4" />
                </span>
                <div>
                  <h3 className="label !text-[13px] !text-cream">
                    <span className="mr-2 text-salmon">{pad2(i + 1)}</span>{step.title}
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-mute">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Quote */}
      <figure id="about" className="quote-card flex flex-col rounded-2xl p-7">
        <Quote className="size-7 rotate-180 fill-salmon/70 text-salmon/70" />
        {settings.quote ? (
          <blockquote className="mt-8 text-[19px] font-medium leading-[1.6] text-cream">{settings.quote}</blockquote>
        ) : null}
        <figcaption className="mt-6">
          <p className="font-serif text-2xl italic text-salmon">{settings.full_name}</p>
          {settings.quote_role ? <p className="label mt-2">{settings.quote_role}</p> : null}
          <p className="label mt-4 flex items-start gap-2 !text-cream">
            <i className="dot mt-1.5 shrink-0" /> Let&apos;s create something remarkable.
          </p>
        </figcaption>
      </figure>
    </section>
  );
}

export function Contact({ settings }: { settings: SiteSettings }) {
  const rows = [
    settings.email && { icon: Mail, label: "Direct email", value: settings.email, href: `mailto:${settings.email}`, mono: true },
    settings.website && { icon: Globe, label: "Portfolio web", value: settings.website, href: `https://${settings.website.replace(/^https?:\/\//, "")}`, mono: true },
    settings.location_detail && { icon: MapPin, label: "Primary location", value: settings.location_detail, href: null, mono: false },
  ].filter(Boolean) as Array<{ icon: LucideIcon; label: string; value: string; href: string | null; mono: boolean }>;

  return (
    <section id="contact" className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-5 pb-16 lg:grid-cols-[1fr_1fr] lg:px-8">
      <div className="max-w-[520px]">
        <p className="label flex items-center gap-2"><i className="dot" /> Inquiries &amp; collaborations</p>
        <h2 className="display mt-2 text-6xl sm:text-7xl">
          Let&apos;s work <span className="block text-red">together</span>
        </h2>
        {settings.contact_blurb ? <p className="mt-5 text-[17px] leading-relaxed text-rose">{settings.contact_blurb}</p> : null}
        <ul className="mt-6 space-y-2">
          {rows.map((r) => {
            const body = (
              <>
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-panel-3 text-salmon"><r.icon className="size-4" /></span>
                <span className="min-w-0 break-all">
                  <span className="label block">{r.label}</span>
                  <span className={r.mono ? "font-mono tracking-[0.08em] text-cream" : "text-cream"}>{r.value}</span>
                </span>
              </>
            );
            return (
              <li key={r.label}>
                {r.href ? (
                  <a href={r.href} className="flex items-center gap-4 rounded-xl bg-panel p-3 transition-colors hover:bg-panel-2">{body}</a>
                ) : (
                  <div className="flex items-center gap-4 rounded-xl bg-panel p-3">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
        {settings.email ? (
          <a href={`mailto:${settings.email}?subject=Project%20inquiry`} className="btn btn-red mt-6 !px-6 !py-3.5">
            <Play className="size-4" /> Initiate conversation
          </a>
        ) : null}
      </div>

      <div className="rounded-2xl border border-red-deep/40 bg-panel p-5 shadow-[0_0_80px_-20px_rgb(224_38_38/0.35)] lg:ml-auto lg:w-full lg:max-w-[520px]">
        <div className="flex items-center justify-between">
          <span className="flex gap-2">
            <i className="size-2.5 rounded-full bg-red" />
            <i className="size-2.5 rounded-full bg-white/15" />
            <i className="size-2.5 rounded-full bg-white/15" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.14em] text-mute">bash • zsh • 80x24</span>
        </div>
        <p className="mt-4 overflow-x-auto whitespace-nowrap font-mono text-sm text-cream">
          $ curl -X GET https://api.{settings.website?.replace(/^https?:\/\//, "").replace(/^(www\.)/, "") ?? "example.dev"}/v1/status
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-panel-2 p-4 font-mono text-[13px] leading-6 text-rose">
{`{
  "engineer": "${settings.full_name}",
  "role": "${settings.headline.split("•")[0].trim()}",
  "availability": ${settings.available_for_hire},
  "stack": ["Go", "Next.js", "Postgres", "Docker"]
}`}
        </pre>
        <p className="mt-3 font-mono text-sm text-cream">
          <span className="text-red">&gt;</span> Ready to initiate repository.{" "}
          <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-red" />
        </p>
        <div className="mt-4 aspect-[16/8] overflow-hidden rounded-lg bg-[#120e0e]">
          {settings.workspace_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.workspace_image_url} alt="Meja kerja" className="size-full object-cover" />
          ) : (
            <div className="red-glow relative size-full">
              <div className="absolute bottom-[22%] left-1/2 h-[46%] w-[44%] -translate-x-1/2 rounded border border-white/10 bg-black/70" />
              <div className="absolute bottom-[14%] left-[14%] right-[14%] h-1.5 rounded bg-red/70 shadow-[0_0_30px_6px_rgb(224_38_38/0.5)]" />
            </div>
          )}
        </div>
        <p className="label mt-4 flex items-center gap-2 !text-rose"><i className="dot" /> Active workspace • {settings.location?.split(",")[0] ?? "Remote"}</p>
      </div>
    </section>
  );
}
