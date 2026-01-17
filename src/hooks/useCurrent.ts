// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";

// import { AxiosError } from "axios";
// import api from "@/lib/api";

// export interface AdminUser {
//   id: number;
//   name: string;
//   email: string;
//   role: "ADMIN";
// }

// interface CurrentUserResponse {
//   user: AdminUser;
// }

// export const useCurrent = () => {
//   const router = useRouter();

//   return useQuery<AdminUser, AxiosError<{ message: string }>>({
//     queryKey: ["currentUser"],
//     queryFn: async () => {
//       try {
//         const { data } = await api.get<CurrentUserResponse>("/auth/current", {
//           withCredentials: true, // attach cookies
//         });
//         return data.user;
//       } catch (err) {
//         const axiosError = err as AxiosError<{ message: string }>;
//         console.error(
//           "Fetch current admin failed:",
//           axiosError.response?.data?.message || axiosError.message
//         );
//         router.push("/login"); // redirect if not authenticated
//         throw axiosError; // rethrow for react-query error handling
//       }
//     },
//     staleTime: 5 * 60 * 1000,
//     retry: false,
//   });
// };

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useCurrent = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/current");
      return data.user; // null if not logged in
    },
    staleTime: 0,            // never treat as fresh
           // clear cache immediately when unused
    refetchOnMount: "always", // always refetch on mount
    refetchOnWindowFocus: false,
  });
};


