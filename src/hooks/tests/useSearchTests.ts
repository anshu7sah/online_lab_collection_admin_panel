
import api from "@/lib/api"
import { TestApiResponse, TestFilters } from "@/types"
import { useQuery } from "@tanstack/react-query"

interface Params {
  page: number
  limit: number
  filters: TestFilters
}

export const useSearchTests = ({ page, limit, filters }: Params) => {
  return useQuery<TestApiResponse>({
    queryKey: ["search-tests", page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams()

      // Basic pagination params
      params.append("page", String(page))
      params.append("limit", String(limit))

      // Append filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value))
        }
      })
      console.log("params",params.toString())

      // Axios GET request
      const res = await api.get(`/tests/or-search?${params.toString()}`)
      return res.data
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

