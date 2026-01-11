import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

interface LoginData {
  email: string;
  password: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useAdminLogin = () => {
  return useMutation<void, ErrorResponse, LoginData>({
    mutationFn: async (data: LoginData) => {
      await api.post("/auth/admin/login", data); // cookie set by backend
    },
  });
};
