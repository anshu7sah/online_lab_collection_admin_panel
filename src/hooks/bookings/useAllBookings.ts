import api from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { BookingApiResponse, BookingFilters } from "@/types/booking"

interface Params {
  page: number
  limit: number
  filters: BookingFilters
}

export const useAllBookings = ({ page, limit, filters }: Params) => {
  return useQuery<BookingApiResponse>({
    queryKey: ["admin-bookings", page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams()

      params.append("page", String(page))
      params.append("limit", String(limit))

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value))
        }
      })

      const res = await api.get(`/bookings?${params.toString()}`)
      return res.data
    },

    // ✅ React Query v5 replacement
    placeholderData: (previousData) => previousData,

    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
