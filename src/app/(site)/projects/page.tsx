import type { Metadata } from "next";
import { ProjectCard } from "@/components/site/project-card";
import { getPublishedProjects } from "@/lib/queries";

export const metadata: Metadata = { title: "Project archives" };

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8">
      <p className="label flex items-center gap-2"><i className="dot" /> {projects.length} engineered applications</p>
      <h1 className="display mt-2 text-6xl">All <span className="text-red">archives</span></h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
      </div>
      {!projects.length ? <p className="panel mt-10 p-8 text-mute">Belum ada proyek yang dipublikasikan.</p> : null}
    </div>
  );
}
