import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Booking, BookingStatus, PaymentStatus } from "@/types/booking";

interface UpdateStatusData {
  id: number;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
}

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, paymentStatus }: UpdateStatusData) => {
      const res = await api.patch(`/bookings/${id}/status`, { status, paymentStatus });
      return res.data.booking as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });
};
