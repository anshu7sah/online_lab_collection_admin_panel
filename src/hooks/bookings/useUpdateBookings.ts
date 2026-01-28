import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Booking } from "@/types/booking";

interface UpdateBookingData {
  id: number;
  data: Partial<Omit<Booking, "id" | "createdAt" | "updatedAt">>;
}

export const useUpdateBooking = (id?:number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateBookingData) => {
      const res = await api.patch(`/bookings/${id}`, data);
      return res.data.booking as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-booking",id] });

    },
  });
};
