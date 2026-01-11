import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreatePackagePayload {
  name: string;
  description?: string;
  price: number;
  testIds: number[];
}

export const useCreatePackage = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePackagePayload) => {
      const res = await api.post("/packages", payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};
