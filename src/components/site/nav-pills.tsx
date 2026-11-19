"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "certificates", label: "Certificates" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function NavPills() {
  const [active, setActive] = useState("projects");

  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="hidden items-center gap-1 rounded-2xl bg-panel p-1.5 lg:flex" aria-label="Navigasi utama">
      {NAV.map((n) => (
        <Link
          key={n.id}
          href={`/#${n.id}`}
          prefetch={false}
          className={cn(
            "rounded-xl px-4 py-2 font-mono text-[13px] tracking-[0.1em] transition-colors",
            active === n.id ? "bg-panel-3 font-semibold text-cream" : "text-rose hover:text-cream",
          )}
        >
          {n.label}
        </Link>
      ))}
    </nav>
  );
}
