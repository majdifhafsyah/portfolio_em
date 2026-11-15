"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 8 * 1024 * 1024;

/** Mengunggah ke bucket Storage `portfolio` dan mengembalikan URL publiknya. */
export function useImageUpload(folder: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<string | null> {
    setError(null);
    if (!/^image\/(png|webp|jpeg|svg\+xml)$/.test(file.type)) {
      setError("Format harus PNG, WebP, JPG, atau SVG.");
      return null;
    }
    if (file.size > MAX_BYTES) {
      setError("Ukuran maksimal 8MB per berkas.");
      return null;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
      const path = `${folder}/${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage.from("portfolio").upload(path, file, { cacheControl: "31536000" });
      if (upErr) {
        setError(`Gagal mengunggah: ${upErr.message}`);
        return null;
      }
      return supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
    } catch {
      setError("Gagal mengunggah. Periksa koneksi ke Supabase.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  return { upload, busy, error };
}

export function UploadButton({
  folder, onUploaded, label = "Unggah baru", className = "btn btn-red",
}: { folder: string; onUploaded: (url: string) => void; label?: string; className?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const { upload, busy, error } = useImageUpload(folder);
  return (
    <div className="contents">
      <input
        ref={ref} type="file" accept="image/png,image/webp,image/jpeg,image/svg+xml" className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const url = await upload(file);
          if (url) onUploaded(url);
        }}
      />
      <button type="button" className={className} disabled={busy} onClick={() => ref.current?.click()}>
        <Upload className="size-4" /> {busy ? "Mengunggah…" : label}
      </button>
      {error ? <p role="alert" className="basis-full text-xs text-red-hi">{error}</p> : null}
    </div>
  );
}
