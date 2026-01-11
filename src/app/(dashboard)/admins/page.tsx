"use client";

import { useCreateAdmin } from "@/hooks/useCreateAdmin";
import { useState } from "react";

export default function AdminsPage() {
  const createAdmin = useCreateAdmin();
  const [email, setEmail] = useState("");

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-lg font-semibold mb-4">Create Admin</h2>

      <input
        placeholder="Email"
        className="border px-3 py-2 rounded w-full mb-3"
        onChange={e => setEmail(e.target.value)}
      />

      <button
        onClick={() =>
          createAdmin.mutate({
            name: "Admin",
            email,
            password: "Admin@123",
          })
        }
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create Admin
      </button>
    </div>
  );
}
