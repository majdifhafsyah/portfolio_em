"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FolderKanban, IdCard, Images, LayoutGrid, Settings, SquareTerminal } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { key: "dashboard", href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { key: "bio", href: "/admin?tab=bio", label: "Profile & Bio", icon: IdCard },
  { key: "projects", href: "/admin/projects", label: "Projects Management", icon: FolderKanban },
  { key: "keahlian", href: "/admin?tab=keahlian", label: "Experience & Skills", icon: SquareTerminal },
  { key: "profil", href: "/admin?tab=profil", label: "Media/Photo Manager", icon: Images },
  { key: "statistik", href: "/admin?tab=statistik", label: "Settings", icon: Settings },
];

export function AdminNav({ horizontal = false }: { horizontal?: boolean }) {
  const pathname = usePathname();
  const tab = useSearchParams().get("tab");
  const current = pathname.startsWith("/admin/projects")
    ? "projects"
    : tab && NAV.some((n) => n.key === tab) ? tab : tab === "proses" ? "keahlian" : "dashboard";

  return (
    <nav aria-label="Navigasi admin" className={cn(horizontal ? "flex gap-1 overflow-x-auto px-4 pb-4" : "flex flex-col gap-1 pr-5")}>
      {NAV.map((item) => {
        const active = current === item.key;
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-4 whitespace-nowrap text-[17px] transition-colors",
              horizontal ? "rounded-lg px-3 py-2 text-sm" : "rounded-r-lg py-3.5 pl-8 pr-4",
              active ? "bg-red font-semibold text-white shadow-[0_8px_30px_-10px_rgb(224_38_38/0.8)]" : "text-rose hover:bg-panel hover:text-cream",
            )}
          >
            <item.icon className="size-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
