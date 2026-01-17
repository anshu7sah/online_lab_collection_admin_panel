import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      // Clear current user cache immediately
      queryClient.setQueryData(["current-user"], null);

      // Optionally invalidate to refetch
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};
