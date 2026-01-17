"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { PackageForm } from "@/components/packages/PackageForm";
import { Package, PackageFormValues, Test } from "@/types";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useUpdatePackage } from "@/hooks/packages/useUpdatePackage";

export default function UpdatePackagePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
    const {updatePackage} =useUpdatePackage();

  const [initialData, setInitialData] = useState<{
    name: string;
    description?: string | null;
    price: number;
    tests: Package["tests"];
  } | null>(null);

  /* ---------------- FETCH PACKAGE ---------------- */
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await api.get(`/packages/${id}`);
        console.log(res.data)

        const pkg = res.data;

        setInitialData({
          name: pkg.name,
          description: pkg.description,
          price: pkg.price,
          tests: pkg.tests.map((t: Test) => ({
            id:   t.id,
            testName: t.testName,
            testCode: t.testCode,
            department: t.department,
            amount: t.amount,
          })),
        });
      } catch {
        toast.error("Failed to load package");
        // router.push("/packages");
      }
    };

    fetchPackage();
  }, [id, router]);

  /* ---------------- SUBMIT ---------------- */
  const handleUpdate = async (data: PackageFormValues) => {

    try {
      setLoading(true);


      await updatePackage(Number(id), data);

      // await api.put(`/packages/${id}`, data);

      toast.success("Package updated successfully");
      router.push("/packages");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-3 max-w-xl">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PackageForm
        title="Update Package"
        loading={loading}
        defaultValues={initialData}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
