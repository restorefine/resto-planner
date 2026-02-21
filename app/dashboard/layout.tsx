import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, Calendar } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";
import Image from "next/image";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="sticky top-0 z-30 border-b border-[#1a1a1a] bg-[#0d0d0d]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center rounded-xl ">
              <Image src="/r-logo.png" alt="Logo" width={40} height={40} className="h-4 w-4" />
            </div>
            <span className="font-bold text-white tracking-tight">Resto Planner</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-gray-300 sm:block px-3 py-1.5 rounded-lg border border-[#2a2a2a] bg-[#111111]">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
