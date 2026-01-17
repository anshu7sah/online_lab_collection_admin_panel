"use client";

import { useLogout } from "@/hooks/useLogout";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const logoutHook = useLogout();

  const logout = async () => {
    await logoutHook.mutateAsync();
    router.replace("/login");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-slate-800">
        Admin Dashboard
      </h1>

      <button
        onClick={logout}
        className="text-sm text-red-500 hover:text-red-600"
      >
        Logout
      </button>
    </header>
  );
}
