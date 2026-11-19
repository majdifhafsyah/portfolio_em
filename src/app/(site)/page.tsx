import { Hero } from "@/components/site/hero";
import { AboutGrid, Certificates, Contact, SelectedProjects } from "@/components/site/sections";
import { getCertificates, getEducation, getProcessSteps, getPublishedProjects, getSiteSettings, getSkills } from "@/lib/queries";

export default async function HomePage() {
  const [settings, projects, education, skills, process, certificates] = await Promise.all([
    getSiteSettings(), getPublishedProjects(), getEducation(), getSkills(), getProcessSteps(), getCertificates(),
  ]);
  const featured = projects.filter((p) => p.featured);
  const selected = (featured.length ? featured : projects).slice(0, 3);

  return (
    <>
      <Hero settings={settings} />
      <SelectedProjects projects={selected} />
      <AboutGrid settings={settings} education={education} skills={skills} process={process} />
      <Certificates items={certificates} />
      <Contact settings={settings} />
    </>
  );
}
