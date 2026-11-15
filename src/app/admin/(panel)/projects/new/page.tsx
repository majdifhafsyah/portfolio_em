import { ProjectForm } from "@/components/admin/project-form";
import { adminGetSettings } from "@/lib/queries";

export const metadata = { title: "Tambah Proyek Baru" };

export default async function NewProjectPage() {
  const settings = await adminGetSettings();
  return <ProjectForm siteHost={settings.website?.replace(/^https?:\/\//, "") ?? "example.dev"} />;
}
