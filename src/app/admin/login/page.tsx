import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Admin Login" };

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-base px-5 py-16">
      <div className="red-glow pointer-events-none absolute inset-0" />
      <div className="relative w-full max-w-[450px]">
        <div className="mb-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-mono text-sm tracking-[0.12em] text-cream hover:text-salmon">
            <ArrowLeft className="size-4" /> Kembali ke Portfolio
          </Link>
          <span className="label flex items-center gap-2 !text-mute"><i className="dot" /> Node // Auth.01</span>
        </div>
        <div className="overflow-hidden rounded-2xl bg-panel shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]">
          <div className="h-1 bg-gradient-to-r from-transparent via-red to-transparent" />
          <div className="p-8 sm:p-10">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-panel-3 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-rose">
                <i className="dot" /> Portal administrator
              </span>
              <span className="text-lg font-bold text-cream">FH<span className="text-red">.</span></span>
            </div>
            <h1 className="mt-4 text-[26px] font-bold tracking-tight text-cream">Masuk ke Dashboard Portfolio</h1>
            <p className="mt-1 text-[15px] text-rose">Firman Hafsyah // Creative Fullstack Systems &amp; Architecture</p>
            <Suspense fallback={<div className="mt-6 h-56" />}>
              <LoginFormWithNext searchParams={searchParams} />
            </Suspense>
            <p className="label mt-8 flex items-center gap-2 !text-dim">
              <ShieldCheck className="size-4" /> Sesi dikelola Supabase Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

async function LoginFormWithNext({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const sp = await searchParams;
  return <LoginForm next={typeof sp.next === "string" ? sp.next : undefined} />;
}
