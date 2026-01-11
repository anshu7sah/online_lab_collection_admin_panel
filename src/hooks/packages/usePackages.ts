import api from "@/lib/api";
import { Package } from "@/types";
import { useQuery } from "@tanstack/react-query";


export const usePackages = (search: string) =>
  useQuery({
    queryKey: ["packages", search],
    queryFn: async (): Promise<Package[]> => {
      const res = await api.get("/packages", { params: { search } });
      return res.data.data;
    },
  });
