# Portfolio Firman Hafsyah — Next.js + Supabase

Implementasi desain Figma (hitam arang + merah, Anton / Space Grotesk / JetBrains Mono / Playfair italic).

| Layar di Figma                       | Rute                                               |
| ------------------------------------ | -------------------------------------------------- |
| Fullstack Developer Portfolio        | `/` (+ `/projects`, `/projects/[slug]`)            |
| Admin Login                          | `/admin/login`                                     |
| Portal Admin – Kelola Data Portfolio | `/admin` (tab 01–06 lewat `?tab=`)                 |
| Portal Admin – Kelola Semua Proyek   | `/admin/projects`                                  |
| Portal Admin – Tambah Proyek Baru    | `/admin/projects/new`, `/admin/projects/[id]/edit` |

## Setup

1. Buat project Supabase. Di **SQL Editor** jalankan `supabase/migrations/0001_init.sql`, lalu `supabase/seed.sql` (konten dari desain).
2. **Authentication → Users → Add user** (email + password). Salin UUID-nya, lalu:
   ```sql
   insert into public.admins (user_id) values ('<UUID_USER>');
   ```
3. Salin `.env.example` → `.env.local`, isi URL dan anon key.
4. `npm install && npm run dev` → http://localhost:3000, admin di `/admin/login`.
5. Di `/admin` tab **01. Profil & Foto**, unggah foto PNG transparan Anda; unggah sampul tiap proyek di form proyek. Gambar tersimpan di bucket Storage `portfolio`.

## Struktur

- `supabase/` — skema, RLS, bucket storage, seed
- `src/lib/supabase/` — klien browser / server / publik (tanpa cookie) / proxy
- `src/proxy.ts` — refresh sesi + proteksi `/admin/*`
- `src/lib/queries.ts` — data publik di-cache (`use cache` + tag); admin tanpa cache
- `src/lib/actions.ts` — Server Actions; semua memeriksa `is_admin()`, lalu `updateTag()` agar situs publik langsung ter-update
- `src/lib/fallback.ts` — konten desain, dipakai hanya bila Supabase belum terhubung
- `src/components/site/`, `src/components/admin/` — UI
- `src/app/globals.css` — token warna/font dan utilitas (`label`, `display`, `panel`, `field`, `btn`, `tag`)

## Yang sengaja berbeda dari Figma

- **Angka dasbor asli, bukan contoh.** Kartu "Pengunjung bulan ini", "Kontak masuk", "Benchmark throughput", latency/uptime di desain butuh sumber data (analytics, form kontak) yang belum ada, jadi diganti hitungan nyata dari database (featured, arsip, draft, repositori).
- **Ikon lonceng, "Batch action", "Audit trail log", crop tool** tidak dibuat karena belum ada fiturnya. Aksi massal ada di bar merah saat baris dicentang.
- **"Lupa password?"** diganti petunjuk reset lewat Supabase.
- **Frame mobile** tidak disalin piksel demi piksel; halaman publik dibuat responsif dari layout desktop.
- **Gambar** (foto, mockup proyek, foto workspace) tidak ikut: pakai placeholder sampai Anda mengunggahnya.

## Catatan keamanan

- Jangan menaruh `service_role` key di env `NEXT_PUBLIC_*`.
- Hapus massal meminta konfirmasi; hapus item keahlian/pendidikan/proses tidak.
