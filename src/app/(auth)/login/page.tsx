"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminLogin } from "@/hooks/useAdminLogin";
import { useCurrent } from "@/hooks/useCurrent";
import { Spinner } from "@/components/ui/spinner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data: currentUser, isLoading } = useCurrent();
  const { mutate, isPending, error } = useAdminLogin();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isLoading && currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, isLoading, router]);

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

  // -------------------
  // Render logic
  // -------------------

  // While checking session or redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-200">
        <div className="text-center">
          <Spinner className="w-12 h-12 text-blue-600" />
          <p className="mt-4 text-gray-700">Checking session...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, do not render the login form
  if (currentUser) {
    return null; // redirecting, avoid flash
  }

  // Render login form if user is NOT logged in
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
