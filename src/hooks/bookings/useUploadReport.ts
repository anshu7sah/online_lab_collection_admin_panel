import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Booking } from "@/types/booking";

export const useUploadReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append("report", file);

      const res = await api.post(`/bookings/${id}/report`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.booking as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });
};
