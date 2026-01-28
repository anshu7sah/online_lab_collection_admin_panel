// useDeleteBooking.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/bookings/${id}`),

    onSuccess: (_data, bookingId) => {
      // refresh bookings list
      queryClient.invalidateQueries({
        queryKey: ["admin-bookings"],
      });

      // remove deleted booking from cache
      queryClient.removeQueries({
        queryKey: ["admin-booking", bookingId],
      });
    },
  });
};
