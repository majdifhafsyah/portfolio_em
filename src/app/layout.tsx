import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Firman Hafsyah — Fullstack Developer Portfolio", template: "%s · Firman Hafsyah" },
  description:
    "Portfolio Firman Hafsyah: fullstack architect & UI/UX creator. Enterprise web apps, human-centered UI, high-throughput backend.",
  openGraph: { type: "website", siteName: "Firman Hafsyah" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
