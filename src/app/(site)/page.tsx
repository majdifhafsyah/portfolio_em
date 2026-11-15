import { Hero } from "@/components/site/hero";
import { AboutGrid, Contact, SelectedProjects } from "@/components/site/sections";
import { getEducation, getProcessSteps, getPublishedProjects, getSiteSettings, getSkills } from "@/lib/queries";

export default async function HomePage() {
  const [settings, projects, education, skills, process] = await Promise.all([
    getSiteSettings(), getPublishedProjects(), getEducation(), getSkills(), getProcessSteps(),
  ]);
  const featured = projects.filter((p) => p.featured);
  const selected = (featured.length ? featured : projects).slice(0, 3);

  return (
    <>
      <Hero settings={settings} />
      <SelectedProjects projects={selected} />
      <AboutGrid settings={settings} education={education} skills={skills} process={process} />
      <Contact settings={settings} />
    </>
  );
}
