"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { useDeleteTest } from "@/hooks/tests/useDeleteTest";
import { useDebounce } from "@/hooks/useDebounce";
import {  TestFilters } from "@/types";
import { useTests } from "@/hooks/tests/useTests";
import { TestCard } from "@/components/tests/TestCard";
import { Upload, Download } from "lucide-react";
import { useRef } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";


/* ---------------- SKELETON ---------------- */
const TestSkeleton = () => (
  <div className="border rounded-xl p-4 animate-pulse space-y-3">
    <div className="h-5 bg-gray-200 rounded w-1/3" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

/* ---------------- CARD ---------------- */


/* ---------------- PAGE ---------------- */
export default function TestsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TestFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExport = async () => {
  try {
    const res = await api.get("/filehandling/tests/export", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "tests.xlsx";
    link.click();
    window.URL.revokeObjectURL(url);
  } catch {
    toast.error("Failed to export tests");
  }
};

const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    await api.post("/filehandling/tests/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Tests imported successfully");
    setPage(1);
  } catch (error) {
  const err = error as AxiosError<{ message?: string }>;
  toast.error(err.response?.data?.message || "Import failed");
} finally {
    e.target.value = "";
  }
};


  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-center md:text-left flex-1">
          Tests
        </h1>

        <div className="flex gap-2 flex-wrap items-center">
          {/* EXPORT */}
<Button
  variant="outline"
  className="flex items-center gap-2"
  onClick={handleExport}
>
  <Download size={16} /> Export
</Button>

{/* IMPORT */}
<>
  <input
    ref={fileInputRef}
    type="file"
    accept=".xlsx,.xls"
    className="hidden"
    onChange={handleImport}
  />

  <Button
    variant="outline"
    className="flex items-center gap-2"
    onClick={() => fileInputRef.current?.click()}
  >
    <Upload size={16} /> Import
  </Button>
</>

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
