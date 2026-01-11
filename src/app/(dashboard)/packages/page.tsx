"use client";

import { useState } from "react";
import { usePackages } from "@/hooks/packages/usePackages";
import { useDeletePackage } from "@/hooks/packages/useDeletePackage";
import Link from "next/link";

export default function PackagesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = usePackages(search);
  const deletePackage = useDeletePackage();

  if (isLoading) return <div>Loading packages...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <input
          className="border px-3 py-2 rounded w-1/3"
          placeholder="Search package..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          href="/packages/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Create Package
        </Link>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="p-3">Name</th>
            <th>Price</th>
            <th>Tests</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data?.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.name}</td>
              <td>{p.price}</td>
              <td>{p.tests.length}</td>
              <td>
                <button
                  onClick={() => deletePackage.mutate(p.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
