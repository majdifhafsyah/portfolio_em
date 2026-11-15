"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, SquareTerminal } from "lucide-react";
import { loginAction, type ActionState } from "@/lib/actions";

const initial: ActionState = { ok: false };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const [show, setShow] = useState(false);

  return (
    <form action={formAction} className="mt-7 space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="email" className="label">Email / Username</label>
          <span className="label !text-dim">Required</span>
        </div>
        <div className="relative">
          <SquareTerminal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mute" />
          <input id="email" name="email" type="email" autoComplete="username" required placeholder="admin@firmanhafsyah.dev" className="field !bg-panel-3 !py-3.5 !pl-11" />
        </div>
        {state.errors?.email ? <p className="mt-1.5 text-xs text-red-hi">{state.errors.email}</p> : null}
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="password" className="label">Passphrase</label>
          <span className="font-mono text-xs tracking-[0.1em] text-mute" title="Reset lewat Supabase Dashboard → Authentication">Lupa? Reset di Supabase</span>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mute" />
          <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required placeholder="••••••••••••" className="field !bg-panel-3 !py-3.5 !pl-11 !pr-12" />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Sembunyikan passphrase" : "Tampilkan passphrase"} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-mute hover:text-cream">
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {state.errors?.password ? <p className="mt-1.5 text-xs text-red-hi">{state.errors.password}</p> : null}
      </div>
      {state.message ? <p role="alert" className="rounded-lg bg-red-ink px-4 py-3 text-sm text-salmon">{state.message}</p> : null}
      <button type="submit" disabled={pending} className="btn btn-red w-full !rounded-full !py-3.5">
        {pending ? "Memverifikasi…" : "Masuk ke portal"} <ArrowRight className="size-4" />
      </button>
    </form>
  );
}
