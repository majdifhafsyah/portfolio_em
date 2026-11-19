"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { addCertificateAction } from "@/lib/actions";
import { UploadButton } from "@/components/admin/image-upload";

export function CertificateForm() {
  const [image, setImage] = useState("");
  return (
    <form action={async (fd) => { await addCertificateAction(fd); setImage(""); }} className="mt-5 grid gap-3 sm:grid-cols-2">
      <input name="title" required aria-label="Nama sertifikat" placeholder="Nama sertifikat" className="field !bg-ink sm:col-span-2" />
      <input name="issuer" required aria-label="Penerbit" placeholder="Penerbit" className="field !bg-ink" />
      <input name="issued_at" required aria-label="Tahun terbit" placeholder="2024" className="field !bg-ink font-mono" />
      <input name="credential_url" type="url" aria-label="Tautan kredensial" placeholder="https:// tautan verifikasi (opsional)" className="field !bg-ink sm:col-span-2" />
      <input type="hidden" name="image_url" value={image} />
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <UploadButton folder="certificates" onUploaded={setImage} className="btn btn-dark" label={image ? "Ganti gambar" : "Unggah gambar sertifikat"} />
        {image ? <span className="truncate font-mono text-xs text-mute">{image.split("/").pop()}</span> : null}
      </div>
      <button className="btn btn-red sm:col-span-2"><Plus className="size-4" /> Tambah sertifikat</button>
    </form>
  );
}
