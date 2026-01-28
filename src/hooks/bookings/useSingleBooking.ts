import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Booking } from "@/types/booking";

export const useSingleBooking = (id: number) => {
  return useQuery({
    queryKey: ["admin-booking", id],
    queryFn: async (): Promise<Booking> => {
      const res = await api.get(`/bookings/${id}`);
      return res.data.booking as Booking;
    },
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });
};
