import api from "@/lib/api";
import {  PackageApiResponse, PackageFilters } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface Params {
  page: number;
  limit: number;
  filters: PackageFilters;
}

export const usePackages = ({ page, limit, filters }: Params) => {
  return useQuery<PackageApiResponse>({
    queryKey: ["packages", page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Pagination
      params.append("page", String(page));
      params.append("limit", String(limit));

      // Filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });

      const res = await api.get(`/packages?${params.toString()}`);
      return res.data;
    },
placeholderData: (previousData) => previousData,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
