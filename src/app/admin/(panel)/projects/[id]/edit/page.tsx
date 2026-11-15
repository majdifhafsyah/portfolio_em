import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { adminGetProject, adminGetSettings } from "@/lib/queries";

export const metadata = { title: "Ubah Proyek" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]/edit">) {
  const { id } = await params;
  const [project, settings] = await Promise.all([adminGetProject(id), adminGetSettings()]);
  if (!project) notFound();
  return <ProjectForm project={project} siteHost={settings.website?.replace(/^https?:\/\//, "") ?? "example.dev"} />;
}
