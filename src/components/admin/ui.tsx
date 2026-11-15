import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label, htmlFor, hint, error, aside, children, className,
}: {
  label: string; htmlFor?: string; hint?: ReactNode; error?: string; aside?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={htmlFor} className="label">{label}</label>
        {aside ? <span className="label !text-dim">{aside}</span> : null}
      </div>
      {children}
      {error ? <p className="text-xs text-red-hi">{error}</p> : hint ? <p className="text-xs text-mute">{hint}</p> : null}
    </div>
  );
}

export function Toggle({ name, defaultChecked, checked, onChange, label }: {
  name: string; defaultChecked?: boolean; checked?: boolean; onChange?: (v: boolean) => void; label: string;
}) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox" name={name} className="peer sr-only" aria-label={label}
        defaultChecked={defaultChecked} checked={checked}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
      />
      <span className="h-6 w-11 rounded-full bg-panel-3 transition-colors peer-checked:bg-red peer-focus-visible:ring-2 peer-focus-visible:ring-red-hi" />
      <span className="absolute left-0.5 size-5 rounded-full bg-cream transition-transform peer-checked:translate-x-5" />
    </label>
  );
}

export function SectionCard({ n, title, badge, children }: { n: string; title: string; badge: string; children: ReactNode }) {
  return (
    <section className="panel p-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold uppercase tracking-tight text-cream">
          <span className="mr-2 text-salmon">{n}</span>{title}
        </h2>
        <span className="tag uppercase !tracking-[0.16em]">{badge}</span>
      </header>
      {children}
    </section>
  );
}

export function PageCrumbs({ items }: { items: string[] }) {
  return (
    <p className="label !text-rose">
      {items.map((it, i) => (
        <span key={it}>
          {i > 0 ? <span className="mx-2 text-dim">/</span> : null}
          <span className={i === items.length - 1 ? "text-salmon" : ""}>{it}</span>
        </span>
      ))}
    </p>
  );
}
