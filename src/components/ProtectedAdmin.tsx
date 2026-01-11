"use client";

import { useEffect } from "react";
import { useCurrent } from "@/hooks/useCurrent";
import { useRouter } from "next/navigation";

export default function ProtectedAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = useCurrent();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isError || data?.role !== "ADMIN")) {
      router.replace("/login");
    }
  }, [isLoading, isError, data, router]);

  if (isLoading) return <p>Loading...</p>;

  // Prevent rendering protected content while redirecting
  if (isError || data?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
