"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { useDeleteTest } from "@/hooks/tests/useDeleteTest";
import { useDebounce } from "@/hooks/useDebounce";
import { Test, TestFilters } from "@/types";
import { useTests } from "@/hooks/tests/useTests";

/* ---------------- SKELETON ---------------- */
const TestSkeleton = () => (
  <div className="border rounded-xl p-4 animate-pulse space-y-3">
    <div className="h-5 bg-gray-200 rounded w-1/3" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

/* ---------------- CARD ---------------- */
const TestCard = ({
  test,
  onDelete,
}: {
  test: Test;
  onDelete: (id: number) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div layout className="border rounded-xl p-4 shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{test.testName}</h3>
          <p className="text-sm text-gray-500">
            Code: {test.testCode} | Amount: ₹{test.amount} | Reported:{" "}
            {new Date(test.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3">
          <Eye
            className="cursor-pointer text-blue-500"
            onClick={() => setOpen(!open)}
          />
          <Pencil className="cursor-pointer text-yellow-500" />
          <Trash2
            className="cursor-pointer text-red-500"
            onClick={() => onDelete(test.id)}
          />
        </div>
      </div>

      {/* DETAILS */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-1 text-sm text-gray-600"
          >
            <p>
              <b>Department:</b> {test.department}
            </p>
            <p>
              <b>Method:</b> {test.methodName}
            </p>
            <p>
              <b>Specimen:</b> {test.specimen}
            </p>
            <p>
              <b>Volume:</b> {test.specimenVolume}
            </p>
            <p>
              <b>Container:</b> {test.container}
            </p>
            <p>
              <b>Reported:</b> {test.reported}
            </p>
            {test.specialInstruction && (
              <p>
                <b>Note:</b> {test.specialInstruction}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ---------------- PAGE ---------------- */
export default function TestsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TestFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const deleteTest = useDeleteTest();

  const updateFilter = <K extends keyof TestFilters>(
    key: K,
    value: TestFilters[K]
  ) => {
    setPage(1);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Debounced filters for instant search
  const debouncedFilters = useDebounce(filters, 400);

  const { data, isLoading } = useTests({
    page,
    limit: 10,
    filters: debouncedFilters,
  });

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-center md:text-left flex-1">
          Tests
        </h1>

        <div className="flex gap-2 flex-wrap items-center">
          {/* Top filters */}
          <Input
            placeholder="Test Name"
            className="w-48"
            onChange={e => updateFilter("testName", e.target.value)}
          />
          <Input
            placeholder="Test Code"
            className="w-32"
            onChange={e => updateFilter("testCode", e.target.value)}
          />

          {/* Buttons */}
          <Button
            onClick={() => setShowAdvanced(true)}
            className="flex items-center gap-2"
          >
            <Filter size={16} /> Filters
          </Button>

          <Link
            href="/tests/create"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            + Create Test
          </Link>
        </div>
      </div>

      {/* TEST LIST */}
      <div className="space-y-4">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => <TestSkeleton key={i} />)}

        {!isLoading &&
          data?.tests.map(test => (
            <TestCard
              key={test.id}
              test={test}
              onDelete={id => deleteTest.mutate(id)}
            />
          ))}
      </div>

      {/* PAGINATION */}
      {data && (
        <div className="flex justify-center gap-4 pt-6">
          <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Prev
          </Button>
          <span className="py-2">
            {page} / {data.pagination.totalPages}
          </span>
          <Button
            disabled={page === data.pagination.totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* ADVANCED FILTERS SLIDEOVER */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-6 overflow-auto z-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Advanced Filters</h2>
              <Button onClick={() => setShowAdvanced(false)}>Close</Button>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Department"
                onChange={e => updateFilter("department", e.target.value)}
              />
              <Input
                placeholder="Method"
                onChange={e => updateFilter("methodName", e.target.value)}
              />
              <Input
                placeholder="Specimen"
                onChange={e => updateFilter("specimen", e.target.value)}
              />
              <Input
                placeholder="Specimen Volume"
                onChange={e => updateFilter("specimenVolume", e.target.value)}
              />
              <Input
                placeholder="Container"
                onChange={e => updateFilter("container", e.target.value)}
              />
              <Input
                placeholder="Reported"
                onChange={e => updateFilter("reported", e.target.value)}
              />
              <Input
                placeholder="Special Instruction"
                onChange={e =>
                  updateFilter("specialInstruction", e.target.value)
                }
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min ₹"
onChange={e => {
      const val = e.target.value;
      updateFilter("minAmount", val !== "" ? Number(val) : undefined);
    }}                />
                <Input
                  type="number"
                  placeholder="Max ₹"
onChange={e => {
      const val = e.target.value;
      updateFilter("maxAmount", val !== "" ? Number(val) : undefined);
    }}                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
