import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { getCurrentAdmin } from "@/lib/queries";
import { logoutAction } from "@/lib/actions";

export const metadata = { title: "Portal Admin" };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { user, isAdmin } = await getCurrentAdmin();
  if (!user) redirect("/admin/login");

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <div className="panel max-w-md p-8">
          <p className="label flex items-center gap-2"><i className="dot" /> Error 403</p>
          <h1 className="mt-2 text-2xl font-bold text-cream">Akun ini bukan admin</h1>
          <p className="mt-3 text-sm leading-relaxed text-rose">
            Tambahkan <code className="font-mono text-salmon">{user.id}</code> ke tabel{" "}
            <code className="font-mono text-salmon">public.admins</code> di Supabase, lalu masuk kembali.
          </p>
          <form action={logoutAction} className="mt-5"><button className="btn btn-dark">Logout</button></form>
        </div>
      </div>
    );
  }

  const name = (user.email ?? "Admin").split("@")[0];
  return <AdminShell name={name}>{children}</AdminShell>;
}
