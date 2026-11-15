import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import type { Database } from "@/lib/types";

export async function createClient() {
  // Supabase memanggil Date.now() saat memuat sesi; paksa dinamis agar tidak di-prerender.
  await connection();
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Dipanggil dari Server Component: cookie tidak bisa ditulis di sini.
            // Proxy (src/proxy.ts) yang akan me-refresh sesi.
          }
        },
      },
    },
  );
}
