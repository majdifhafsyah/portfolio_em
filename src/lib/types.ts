export type ProjectStatus = "draft" | "published" | "archived";
export type Metric = { value: string; label: string };

export type SiteSettings = {
  id: number;
  full_name: string;
  headline: string;
  bio: string | null;
  intro: string | null;
  photo_url: string | null;
  available_for_hire: boolean;
  location: string | null;
  email: string | null;
  website: string | null;
  location_detail: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  stat_years: string;
  stat_projects: string;
  stat_uptime: string;
  lighthouse_score: string;
  quote: string | null;
  quote_role: string | null;
  contact_blurb: string | null;
  workspace_image_url: string | null;
  updated_at: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  subtitle: string | null;
  tagline: string | null;
  description: string | null;
  cover_url: string | null;
  gallery_urls: string[];
  tech_stack: string[];
  architecture: string | null;
  metrics: Metric[];
  live_url: string | null;
  repo_url: string | null;
  repo_private: boolean;
  docs_url: string | null;
  status: ProjectStatus;
  featured: boolean;
  sort_order: number;
  period: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

export type Education = { id: string; title: string; institution: string; period: string; sort_order: number };
export type Skill = { id: string; name: string; sort_order: number };
export type ProcessStep = { id: string; title: string; description: string; icon: string; sort_order: number };

type Table<R, Req extends keyof R = never> = {
  Row: R;
  Insert: Partial<R> & Pick<R, Req>;
  Update: Partial<R>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      site_settings: Table<SiteSettings>;
      projects: Table<Project, "slug" | "title">;
      education: Table<Education, "title" | "institution" | "period">;
      skills: Table<Skill, "name">;
      process_steps: Table<ProcessStep, "title" | "description">;
      admins: Table<{ user_id: string; created_at: string }, "user_id">;
    };
    Views: Record<string, never>;
    Functions: { is_admin: { Args: Record<string, never>; Returns: boolean } };
    Enums: { project_status: ProjectStatus };
    CompositeTypes: Record<string, never>;
  };
};
