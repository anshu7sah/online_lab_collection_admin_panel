import api from "@/lib/api";
import { Test } from "@/types";
import { useQuery } from "@tanstack/react-query";


export const useSingleTest = (id: number) =>
  useQuery({
    queryKey: ["tests", id],
    queryFn: async (): Promise<Test> => {
      const res = await api.get(`/tests/${id}`);
      return res.data.test;
    },
  });
