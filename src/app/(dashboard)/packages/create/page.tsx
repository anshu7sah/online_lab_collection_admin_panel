"use client";


import { PackageForm } from "@/components/packages/PackageForm";
import api from "@/lib/api";
import { PackageFormValues } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePackagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: PackageFormValues) => {
    setLoading(true);
    try {
      await api.post("/packages", data);
      router.push("/packages");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PackageForm
      title="Create Package"
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}
