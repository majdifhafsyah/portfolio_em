import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-32 lg:px-8">
      <p className="label flex items-center gap-2"><i className="dot" /> Error 404</p>
      <h1 className="display mt-3 text-7xl">Halaman <span className="text-red">tidak ditemukan</span></h1>
      <Link href="/" className="btn btn-dark mt-8">Kembali ke portfolio</Link>
    </div>
  );
}
