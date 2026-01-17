import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Package } from "@/types";

type UsePackageArgs = {
  id?: number;
};

export const useSinglePackage = ({ id }: UsePackageArgs) => {
  return useQuery<Package>({
    queryKey: ["package", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Package ID is required");
      }

      const res = await api.get(`/packages/${id}`);
      return res.data;
    },

    enabled: !!id, // ⬅️ important (prevents firing without id)

    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
