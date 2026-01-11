import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTest = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tests/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};
