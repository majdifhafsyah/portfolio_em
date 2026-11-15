import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { pad2 } from "@/lib/utils";

/** Mockup layar abstrak, dipakai bila proyek belum punya gambar sampul. */
export function CoverPlaceholder() {
  return (
    <div className="relative size-full overflow-hidden bg-[#141011]">
      <div className="red-glow absolute inset-0" />
      <div className="absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-[#0e0d0d] p-3 shadow-2xl">
        <div className="mb-3 flex gap-1.5">
          <i className="size-1.5 rounded-full bg-red" />
          <i className="size-1.5 rounded-full bg-white/15" />
          <i className="size-1.5 rounded-full bg-white/15" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-8 rounded bg-white/5" />
          <div className="h-8 rounded bg-red-deep/70" />
          <div className="h-8 rounded bg-white/5" />
        </div>
        <svg viewBox="0 0 200 50" className="mt-3 w-full" aria-hidden>
          <polyline points="0,40 25,30 50,36 75,18 100,26 125,10 150,22 175,8 200,16" fill="none" stroke="#e02626" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-panel transition-colors hover:bg-panel-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {project.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_url}
            alt={`Tangkapan layar ${project.title}`}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <CoverPlaceholder />
        )}
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 bg-gradient-to-b from-black/70 to-transparent p-4">
          {project.tech_stack.slice(0, 2).map((t) => (
            <span key={t} className="rounded bg-black/55 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-salmon backdrop-blur">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="relative flex flex-1 flex-col p-5">
        <span className="absolute right-5 top-5 grid size-8 place-items-center rounded-lg bg-panel-3 text-rose transition-colors group-hover:bg-red group-hover:text-white">
          <ArrowUpRight className="size-4" />
        </span>
        <div className="flex items-baseline gap-2 pr-10">
          <span className="font-display text-3xl leading-none text-salmon">{pad2(index + 1)}</span>
          <h3 className="text-xl font-bold uppercase leading-tight tracking-tight text-cream">{project.title}</h3>
        </div>
        {project.subtitle ?? project.category ? (
          <p className="label mt-1 pl-9 text-cream">{project.subtitle ?? project.category}</p>
        ) : null}
        {project.tagline ? <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-mute">{project.tagline}</p> : null}
      </div>
    </Link>
  );
}
