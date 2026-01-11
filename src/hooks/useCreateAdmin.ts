"use client";

import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
}

export function useCreateAdmin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminPayload) =>
      api.post("/admin/create", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}
