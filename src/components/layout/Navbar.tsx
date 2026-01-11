"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = async () => {
    await api.post("/auth/logout");
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
