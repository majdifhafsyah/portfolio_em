import { Hero } from "@/components/site/hero";
import { AboutGrid, Contact, SelectedProjects } from "@/components/site/sections";
import { getCertificates, getEducation, getPublishedProjects, getSiteSettings, getSkills } from "@/lib/queries";

export default async function HomePage() {
  const [settings, projects, education, skills, certificates] = await Promise.all([
    getSiteSettings(), getPublishedProjects(), getEducation(), getSkills(), getCertificates(),
  ]);
  // Sudah terurut featured dulu; sisa slot terisi proyek lain.
  const selected = projects.slice(0, 3);

  return (
    <>
      <Hero settings={settings} />
      <SelectedProjects projects={selected} />
      <AboutGrid settings={settings} education={education} skills={skills} certificates={certificates} />
      <Contact settings={settings} />
    </>
  );
}
