import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, LogOut, Search, User } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import { AdminNav } from "@/components/admin/nav";

export function AdminShell({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-base">
      <aside className="sticky top-0 hidden h-screen w-[290px] shrink-0 flex-col bg-ink lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-8 py-7">
          <i className="dot" />
          <span className="text-lg font-bold tracking-[0.06em] text-cream">
            FIRMAN.<span className="text-salmon">PORTAL</span>
          </span>
          <span className="rounded-full bg-red-deep px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-salmon">Admin</span>
        </Link>
        <Suspense>
          <AdminNav />
        </Suspense>
        <div className="mt-auto space-y-2 p-5">
          <div className="flex items-center gap-3 rounded-lg bg-panel p-3">
            <span className="grid size-9 place-items-center rounded-lg bg-salmon text-red-deep"><User className="size-4" /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-sm tracking-[0.08em] text-cream">{name}</p>
              <p className="font-mono text-[11px] tracking-[0.08em] text-salmon">Super Admin</p>
            </div>
            <Link href="/" target="_blank" aria-label="Buka situs publik" className="text-salmon hover:text-cream">
              <ExternalLink className="size-4" />
            </Link>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-dark w-full !rounded-lg"><LogOut className="size-4" /> Logout</button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 px-5 py-5 lg:px-9">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-panel px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-rose">
            <i className="size-1.5 rounded-full bg-salmon" /> Portfolio CMS / Prod
          </span>
          <div className="flex items-center gap-3">
            <Link href="/admin/projects" aria-label="Cari proyek" className="grid size-10 place-items-center rounded-xl bg-panel text-cream hover:bg-panel-2">
              <Search className="size-4" />
            </Link>
            <Link href="/" target="_blank" aria-label="Buka situs publik" className="grid size-10 place-items-center rounded-xl bg-panel text-cream hover:bg-panel-2">
              <ExternalLink className="size-4" />
            </Link>
            <form action={logoutAction} className="lg:hidden">
              <button type="submit" aria-label="Logout" className="grid size-10 place-items-center rounded-xl bg-salmon text-red-deep"><LogOut className="size-4" /></button>
            </form>
            <span className="hidden size-10 place-items-center rounded-xl bg-salmon text-red-deep lg:grid"><User className="size-4" /></span>
          </div>
        </header>
        <div className="lg:hidden">
          <Suspense>
            <AdminNav horizontal />
          </Suspense>
        </div>
        <main className="flex-1 px-5 pb-16 lg:px-9">{children}</main>
      </div>
    </div>
  );
}
