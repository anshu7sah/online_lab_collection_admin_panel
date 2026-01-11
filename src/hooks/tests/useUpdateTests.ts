import api from "@/lib/api";
import { Test } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useUpdateTest = (id: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Test>) => {
      const res = await api.put(`/tests/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};
