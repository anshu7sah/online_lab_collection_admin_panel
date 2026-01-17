import { useState } from "react";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { PackageFormValues, Package } from "@/types";

interface UseUpdatePackageResult {
  updatePackage: (
    id: number,
    data: PackageFormValues
  ) => Promise<Package>;
  loading: boolean;
  error: string | null;
}

export function useUpdatePackage(): UseUpdatePackageResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePackage = async (
    id: number,
    data: PackageFormValues
  ): Promise<Package> => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.put(`/packages/${id}`, {
        name: data.name,
        description: data.description,
        price: data.price,
        testIds: data.testIds,
      });

      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message =
        error.response?.data?.message || "Failed to update package";

      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    updatePackage,
    loading,
    error,
  };
}
