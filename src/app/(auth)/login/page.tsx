"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminLogin } from "@/hooks/useAdminLogin";
import { useCurrent } from "@/hooks/useCurrent";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { data, isLoading } = useCurrent();
  const { mutate, isPending, error } = useAdminLogin();

  // Redirect if already logged in
  useEffect(() => {
    if (data && !isLoading) {
      router.replace("/dashboard");
    }
  }, [data, isLoading, router]);

  const login = () => {
    mutate(
      { email, password },
      {
        onSuccess: () => {
          router.replace("/dashboard");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Admin Login
        </h1>
        <p className="text-gray-500 mb-6 text-center">
          Sign in to manage your platform
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error.response?.data?.message || "Login failed"}
          </div>
        )}

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <button
            onClick={login}
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold text-lg shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Signing In..." : "Sign In"}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-400 text-sm">
          © 2026 Your Company
        </p>
      </div>
    </div>
  );
}
