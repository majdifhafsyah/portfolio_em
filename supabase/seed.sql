-- Konten awal, diambil dari desain Figma. Ubah lewat Portal Admin.

update public.site_settings set
  full_name = 'Firman Hafsyah',
  headline = 'Fullstack Architect • UI/UX Creator',
  bio = 'Crafting enterprise-grade web applications, sleek human-centered UI/UX, and robust high-throughput backend services.',
  intro = 'Turning complex database architectures & edge logic into frictionless, aesthetic digital experiences.',
  available_for_hire = true,
  location = 'Jakarta, ID • Remote',
  email = 'hello@firmanhafsyah.dev',
  website = 'firmanhafsyah.dev',
  location_detail = 'Jakarta, Indonesia • UTC+7',
  github_url = 'https://github.com/firman',
  linkedin_url = 'https://linkedin.com/in/firman',
  twitter_url = 'https://x.com/firman_dev',
  stat_years = '3+', stat_projects = '35+', stat_uptime = '99%',
  lighthouse_score = '100/100',
  quote = 'Good engineering is not just about making syntax run without errors. It is about building resilient systems that gracefully scale and deeply empower users.',
  quote_role = 'Fullstack Engineer • Tech Lead',
  contact_blurb = 'Currently accepting selected freelance consulting, fractional CTO engagements, and fullstack contract opportunities. Let''s build software that makes an impact.'
where id = 1;

insert into public.projects (slug, title, category, subtitle, tagline, description, tech_stack, architecture, metrics, live_url, repo_url, repo_private, docs_url, status, featured, sort_order, period) values
('nexus-cloud-erp-multitenant', 'Nexus Cloud ERP', 'Enterprise SaaS', 'Enterprise Platform',
 'Automated resource planner with real-time distributed telemetry, role-based governance, and instant financial reconciliation.',
 'Dirancang untuk menangani beban operasional enterprise berskala 100k+ concurrent users. Menggunakan pola Distributed CQRS untuk memisahkan write-heavy transactional operations dari read telemetry analytics query.',
 '{Next.js 14,PostgreSQL,Go,Redis,Kubernetes}', 'Microservices',
 '[{"value":"15,000+ req/s","label":"Peak Throughput"},{"value":"99.98%","label":"Operational Uptime"},{"value":"40% Cost Red","label":"Cloud Compute Optimization"}]',
 'https://nexus-erp.firmanhafsyah.dev', 'https://github.com/firman/nexus-cloud-erp', true, 'https://docs.nexus.firmanhafsyah.dev/v1/swagger',
 'published', true, 1, 'Q1 2024'),
('veloce-headless-storefront', 'Veloce Commerce', 'Headless Shop', 'Headless E-Commerce',
 'High-throughput checkout pipeline handling 15,000 requests/sec with localized currency routing and sub-second page loads.',
 null, '{Golang,Redis Cache,Docker,Tailwind}', 'Serverless Edge',
 '[{"value":"15k req/s","label":"p95 Latency 22ms"}]', null, null, false, null, 'published', true, 2, 'Q3 2024'),
('pulse-realtime-ai-telemetry', 'Pulse Analytics AI', 'Machine Metrics', 'Machine Metrics',
 'Neural data pipeline aggregating multi-cloud metrics into live interactive SVG visualizations with automated anomaly detection.',
 null, '{FastAPI,TypeScript,Kafka,Docker}', 'High-Concurrency',
 '[{"value":"Sub-10ms","label":"Stream latency"}]', null, null, false, null, 'published', true, 3, 'Q4 2024'),
('hypermesh-service-proxy-ebpf', 'HyperMesh Gateway', 'Dev Infra', 'Service Proxy',
 'eBPF-powered service proxy with zero-copy memory paths.', null, '{Rust,gRPC,eBPF,K8s}', 'Microservices',
 '[{"value":"45k req/s","label":"Zero-Copy Memory"}]', null, null, false, null, 'published', false, 4, 'Q1 2025'),
('omniscience-multi-agent-rag', 'Omniscience LLM', 'AI Agents', 'Multi-Agent RAG',
 'Multi-agent retrieval pipeline with vector benchmarks.', null, '{Python,LangChain,React 19,Pinecone}', 'Modular Monolith',
 '[{"value":"Staging v0.9","label":"Vector Benchmark OK"}]', null, null, false, null, 'draft', false, 5, 'Q2 2025'),
('devpulse-clickhouse-stream', 'DevPulse Telemetry', 'Observability', 'Observability',
 'Columnar event stream for developer telemetry.', null, '{Go,ClickHouse,Next.js,WebSockets}', 'High-Concurrency',
 '[{"value":"100k events/s","label":"ClickHouse Columnar"}]', null, null, false, null, 'published', false, 6, 'Q2 2025'),
('cybervault-webauthn-engine', 'CyberVault Zero-Trust', 'Security', 'Security',
 'Passwordless WebAuthn engine.', null, '{Rust,WebAuthn,OAuth 2.1}', 'Modular Monolith',
 '[{"value":"FIDO2 Certified","label":"Archived v1.2"}]', null, null, false, null, 'archived', false, 7, 'Q4 2023');

insert into public.education (title, institution, period, sort_order) values
('B.Sc. in Computer Science', 'Universitas Indonesia', '2020 - 2024', 1),
('AWS Certified Cloud Practitioner', 'Amazon Web Services', '2023', 2);

insert into public.skills (name, sort_order) values
('React / Next.js', 1), ('Node.js', 2), ('TypeScript', 3), ('Golang', 4), ('PostgreSQL', 5), ('MongoDB', 6),
('Docker & K8s', 7), ('Tailwind CSS', 8), ('REST & GraphQL', 9), ('Redis', 10), ('Figma', 11);

insert into public.process_steps (title, description, icon, sort_order) values
('Discover', 'Deep requirement analysis, user journey mapping, and technical scoping.', 'search', 1),
('Architect', 'Relational database schema modeling, API contracts & component wireframing.', 'git', 2),
('Engineer', 'Strictly typed fullstack execution, optimized rendering cycles, and test suites.', 'code', 3),
('Optimize', 'Vulnerability audit, cache invalidation, and database query index profiling.', 'zap', 4),
('Deliver', 'Automated CI/CD pipelines, container deployment to AWS / Vercel, and SLA telemetry.', 'rocket', 5);
