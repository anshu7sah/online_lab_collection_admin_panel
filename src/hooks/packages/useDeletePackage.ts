import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePackage = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/packages/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};
