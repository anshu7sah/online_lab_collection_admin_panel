"use client";

import { useQuery } from "@tanstack/react-query";
import { Package } from "@/types";
import api from "@/lib/api";

export function usePackages(search: string) {
  return useQuery<Package[]>({
    queryKey: ["packages", search],
    queryFn: async () => {
      const { data } = await api.get("/admin/packages", {
        params: { q: search },
      });
      return data.items;
    },
  });
}
