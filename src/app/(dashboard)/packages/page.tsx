"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { usePackages } from "@/hooks/packages/usePackages";
import { useDeletePackage } from "@/hooks/packages/useDeletePackage";
import { Package } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ---------------- TYPES ---------------- */
type PackageFilters = {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  testName?: string;
};

/* ---------------- SKELETON ---------------- */
const PackageSkeleton = () => (
  <div className="border rounded-xl p-4 animate-pulse space-y-3">
    <div className="h-5 bg-gray-200 rounded w-1/3" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

/* ---------------- CARD ---------------- */
function PackageCard({
  packageData,
  onDelete,
}: {
  packageData: Package;
  onDelete: (id: number) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const totalTestAmount = packageData.tests.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const discountAmount =
    totalTestAmount > packageData.price
      ? totalTestAmount - packageData.price
      : 0;

  const discountPercent =
    discountAmount > 0
      ? ((discountAmount / totalTestAmount) * 100).toFixed(2)
      : null;

  return (
    <motion.div
      layout
      className="border rounded-xl p-4 hover:shadow-md bg-white transition"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{packageData.name}</h3>
          <p className="text-gray-500 text-sm">{packageData.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">₹{packageData.price}</span>

          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer hover:bg-gray-100 transition"
            onClick={() => setShowDetails((v) => !v)}
          >
            {showDetails ? "Hide Details" : "View Details"}
          </Button>

          <Link href={`/packages/${packageData.id}/edit`}>
            <Button
              variant="secondary"
              size="sm"
              className="cursor-pointer hover:bg-gray-200 transition"
            >
              Update
            </Button>
          </Link>

          <Button
            variant="destructive"
            size="sm"
            className="cursor-pointer hover:bg-red-700 transition"
            onClick={() => onDelete(packageData.id)}
          >
            Delete
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="border-t pt-3 space-y-2">
              <h4 className="font-medium text-gray-700">Included Tests</h4>

              {packageData.tests.length === 0 ? (
                <p className="text-gray-500 text-sm">No tests included</p>
              ) : (
                packageData.tests.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-center text-sm border-b py-1"
                  >
                    <span>
                      {t.testName} ({t.testCode})
                    </span>
                    <span>₹{t.amount}</span>
                  </div>
                ))
              )}

              <div className="flex justify-between pt-2 text-sm">
                <span>Total Test Amount</span>
                <span>₹{totalTestAmount}</span>
              </div>

              {discountAmount > 0 && (
                <>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount Amount</span>
                    <span>- ₹{discountAmount}</span>
                  </div>

                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount Percentage</span>
                    <span>{discountPercent}%</span>
                  </div>
                </>
              )}

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Final Package Price</span>
                <span>₹{packageData.price}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------------- PAGE ---------------- */
export default function PackagesPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<PackageFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [search, setSearch] = useState("");

  const deletePackage = useDeletePackage();

  const debouncedFilters = useDebounce(
    Object.fromEntries(
      Object.entries({ ...filters, name: search || undefined }).filter(
        ([_, v]) => v !== undefined && v !== ""
      )
    ),
    400
  );

  const { data, isLoading } = usePackages({
    page,
    limit: 10,
    filters: debouncedFilters,
  });

  const updateFilter = <K extends keyof PackageFilters>(
    key: K,
    value: PackageFilters[K]
  ) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold flex-1">Packages</h1>

        <div className="flex gap-2 flex-wrap items-center">
          <Input
            placeholder="Search package..."
            className="w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            onClick={() => setShowAdvanced(true)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 transition"
          >
            <Filter size={16} /> Filters
          </Button>

          <Link
            href="/packages/create"
            className="bg-black text-white px-4 py-2 rounded cursor-pointer
                       hover:bg-gray-800 transition"
          >
            + Create Package
          </Link>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {isLoading && !data &&
          Array.from({ length: 5 }).map((_, i) => (
            <PackageSkeleton key={i} />
          ))}

        {data?.data.map((p) => (
          <PackageCard
            key={p.id}
            packageData={p}
            onDelete={(id) => deletePackage.mutate(id)}
          />
        ))}
      </div>

      {/* PAGINATION */}
      {data && (
        <div className="flex justify-center gap-4 pt-6">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="cursor-pointer hover:bg-gray-200 transition"
          >
            Prev
          </Button>
          <span className="py-2">
            {page} / {data.pagination.totalPages}
          </span>
          <Button
            disabled={page === data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="cursor-pointer hover:bg-gray-200 transition"
          >
            Next
          </Button>
        </div>
      )}

      {/* ADVANCED FILTERS */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-6 z-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Advanced Filters</h2>
              <Button
                onClick={() => setShowAdvanced(false)}
                className="cursor-pointer hover:bg-gray-100 transition"
              >
                Close
              </Button>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Input
                placeholder="Price Min"
                type="number"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "minPrice",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />

              <Input
                placeholder="Price Max"
                type="number"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "maxPrice",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />

              <Input
                placeholder="Search by Test (name/code/department)"
                value={filters.testName ?? ""}
                onChange={(e) =>
                  updateFilter("testName", e.target.value || undefined)
                }
              />

              <Button
                variant="outline"
                onClick={() => {
                  setFilters({});
                  setPage(1);
                  setSearch("");    
                }}
                className="cursor-pointer hover:bg-gray-100 transition"
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
