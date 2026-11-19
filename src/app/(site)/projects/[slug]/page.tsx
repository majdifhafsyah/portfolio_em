import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Code2, ExternalLink, Lock } from "lucide-react";
import { CoverPlaceholder } from "@/components/site/project-card";
import { getProjectBySlug } from "@/lib/queries";

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Proyek tidak ditemukan" };
  return {
    title: project.meta_title ?? project.title,
    description: project.meta_description ?? project.tagline ?? undefined,
    openGraph: project.cover_url ? { images: [project.cover_url] } : undefined,
  };
}

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || project.status !== "published") notFound();

  return (
    <article className="mx-auto max-w-[1080px] px-5 py-14 lg:px-8">
      <Link href="/projects" className="label inline-flex items-center gap-2 hover:text-cream">
        <ArrowLeft className="size-4" /> All archives
      </Link>
      <header className="mt-8">
        <p className="label flex flex-wrap items-center gap-3">
          <i className="dot" /> {project.category}
          {project.period ? <span className="text-mute">{project.period}</span> : null}
        </p>
        <h1 className="display mt-3 text-6xl sm:text-7xl">{project.title}</h1>
        {project.tagline ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-rose">{project.tagline}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {project.live_url ? (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="btn btn-red">Live production <ExternalLink className="size-4" /></a>
          ) : null}
          {project.repo_url && !project.repo_private ? (
            <a href={project.repo_url} target="_blank" rel="noreferrer" className="btn btn-dark"><Code2 className="size-4" /> Repository</a>
          ) : null}
          {project.repo_private ? <span className="btn btn-dark cursor-default"><Lock className="size-4" /> Private repo</span> : null}
          {project.docs_url ? (
            <a href={project.docs_url} target="_blank" rel="noreferrer" className="btn btn-dark"><BookOpen className="size-4" /> API docs</a>
          ) : null}
        </div>
      </header>

      {/* Gambar tampil utuh dengan rasio aslinya (tanpa crop). */}
      <div className="mt-10 overflow-hidden rounded-2xl bg-panel">
        {project.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.cover_url} alt={`Tangkapan layar ${project.title}`} className="h-auto w-full" />
        ) : (
          <div className="aspect-[16/9]"><CoverPlaceholder /></div>
        )}
      </div>

      {project.metrics.length ? (
        <dl className="mt-5 grid gap-5 sm:grid-cols-3">
          {project.metrics.map((m) => (
            <div key={m.label} className="panel p-5">
              <dd className="font-display text-4xl text-salmon">{m.value}</dd>
              <dt className="label mt-2 !text-rose">{m.label}</dt>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line text-[17px] leading-relaxed text-rose">
          {project.description ?? "Deskripsi lengkap belum ditambahkan."}
        </div>
        <aside className="panel h-fit space-y-5 p-5">
          <div>
            <p className="label">Technical arsenal</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.tech_stack.map((t) => <li key={t} className="tag">{t}</li>)}
            </ul>
          </div>
          {project.architecture ? (
            <div>
              <p className="label">Architecture</p>
              <p className="mt-2 text-cream">{project.architecture}</p>
            </div>
          ) : null}
        </aside>
      </div>

      {project.gallery_urls.length ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {project.gallery_urls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt="" className="w-full rounded-2xl bg-panel object-cover" />
          ))}
        </div>
      ) : null}
    </article>
  );
}
