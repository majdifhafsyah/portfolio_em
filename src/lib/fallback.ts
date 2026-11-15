import type { Education, ProcessStep, Project, SiteSettings, Skill } from "@/lib/types";

/**
 * Konten bawaan dari desain. Dipakai hanya bila Supabase belum terisi /
 * belum terhubung, supaya halaman tetap tampil sesuai desain.
 */
export const FALLBACK_SETTINGS: SiteSettings = {
  id: 1,
  full_name: "Firman Hafsyah",
  headline: "Fullstack Architect • UI/UX Creator",
  bio: "Crafting enterprise-grade web applications, sleek human-centered UI/UX, and robust high-throughput backend services.",
  intro: "Turning complex database architectures & edge logic into frictionless, aesthetic digital experiences.",
  photo_url: null,
  available_for_hire: true,
  location: "Jakarta, ID • Remote",
  email: "hello@firmanhafsyah.dev",
  website: "firmanhafsyah.dev",
  location_detail: "Jakarta, Indonesia • UTC+7",
  github_url: "https://github.com/firman",
  linkedin_url: "https://linkedin.com/in/firman",
  twitter_url: "https://x.com/firman_dev",
  stat_years: "3+",
  stat_projects: "35+",
  stat_uptime: "99%",
  lighthouse_score: "100/100",
  quote:
    "Good engineering is not just about making syntax run without errors. It is about building resilient systems that gracefully scale and deeply empower users.",
  quote_role: "Fullstack Engineer • Tech Lead",
  contact_blurb:
    "Currently accepting selected freelance consulting, fractional CTO engagements, and fullstack contract opportunities. Let's build software that makes an impact.",
  workspace_image_url: null,
  updated_at: new Date(0).toISOString(),
};

const base = {
  description: null,
  cover_url: null,
  gallery_urls: [],
  architecture: null,
  metrics: [],
  live_url: null,
  repo_url: null,
  repo_private: false,
  docs_url: null,
  status: "published" as const,
  featured: true,
  period: null,
  meta_title: null,
  meta_description: null,
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
};

export const FALLBACK_PROJECTS: Project[] = [
  {
    ...base,
    id: "f1",
    slug: "nexus-cloud-erp-multitenant",
    title: "Nexus Cloud ERP",
    category: "Enterprise SaaS",
    subtitle: "Enterprise Platform",
    tagline:
      "Automated resource planner with real-time distributed telemetry, role-based governance, and instant financial reconciliation.",
    tech_stack: ["Next.js 14", "PostgreSQL"],
    sort_order: 1,
  },
  {
    ...base,
    id: "f2",
    slug: "veloce-headless-storefront",
    title: "Veloce Commerce",
    category: "Headless Shop",
    subtitle: "Headless E-Commerce",
    tagline:
      "High-throughput checkout pipeline handling 15,000 requests/sec with localized currency routing and sub-second page loads.",
    tech_stack: ["Golang", "Redis Cache"],
    sort_order: 2,
  },
  {
    ...base,
    id: "f3",
    slug: "pulse-realtime-ai-telemetry",
    title: "Pulse Analytics AI",
    category: "Machine Metrics",
    subtitle: "Machine Metrics",
    tagline:
      "Neural data pipeline aggregating multi-cloud metrics into live interactive SVG visualizations with automated anomaly detection.",
    tech_stack: ["FastAPI", "TypeScript"],
    sort_order: 3,
  },
];

export const FALLBACK_EDUCATION: Education[] = [
  { id: "e1", title: "B.Sc. in Computer Science", institution: "Universitas Indonesia", period: "2020 - 2024", sort_order: 1 },
  { id: "e2", title: "AWS Certified Cloud Practitioner", institution: "Amazon Web Services", period: "2023", sort_order: 2 },
];

export const FALLBACK_SKILLS: Skill[] = [
  "React / Next.js", "Node.js", "TypeScript", "Golang", "PostgreSQL", "MongoDB",
  "Docker & K8s", "Tailwind CSS", "REST & GraphQL", "Redis", "Figma",
].map((name, i) => ({ id: `s${i}`, name, sort_order: i }));

export const FALLBACK_PROCESS: ProcessStep[] = [
  { id: "p1", title: "Discover", description: "Deep requirement analysis, user journey mapping, and technical scoping.", icon: "search", sort_order: 1 },
  { id: "p2", title: "Architect", description: "Relational database schema modeling, API contracts & component wireframing.", icon: "git", sort_order: 2 },
  { id: "p3", title: "Engineer", description: "Strictly typed fullstack execution, optimized rendering cycles, and test suites.", icon: "code", sort_order: 3 },
  { id: "p4", title: "Optimize", description: "Vulnerability audit, cache invalidation, and database query index profiling.", icon: "zap", sort_order: 4 },
  { id: "p5", title: "Deliver", description: "Automated CI/CD pipelines, container deployment to AWS / Vercel, and SLA telemetry.", icon: "rocket", sort_order: 5 },
];
