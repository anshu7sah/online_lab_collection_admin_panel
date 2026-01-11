import api from "@/lib/api";
import { Test } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateTest = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<Test, "id">) => {
      const res = await api.post("/tests", payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};
