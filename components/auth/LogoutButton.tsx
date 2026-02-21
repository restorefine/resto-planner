"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      aria-label="Sign out"
      className="flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-[#3a3a3a] hover:text-white transition-all"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span className="hidden sm:block">Sign out</span>
    </button>
  );
}
