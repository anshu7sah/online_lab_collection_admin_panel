"use client";

import { useTests } from "@/hooks/tests/useTests";
import { PackageFormValues, Test } from "@/types";
import { useState } from "react";


interface Props {
  title: string;
  loading?: boolean;
  defaultValues?: {
    name: string;
    description?: string | null;
    price: number;
    tests: Test[];
  };
  onSubmit: (data: PackageFormValues) => void;
}

export function PackageForm({
  title,
  loading = false,
  defaultValues,
  onSubmit,
}: Props) {
  /** UI STATE (FULL TEST OBJECTS) */
  const [selectedTests, setSelectedTests] = useState<Test[]>(
    defaultValues?.tests ?? []
  );

  /** FORM STATE (NO tests here ❌) */
  const [form, setForm] = useState({
    name: defaultValues?.name ?? "",
    description: defaultValues?.description ?? "",
    price: defaultValues?.price ?? 0,
  });

  const [search, setSearch] = useState("");
  const { data: tests = [] } = useTests(search);

  const addTest = (test: Test) => {
    if (selectedTests.some(t => t.id === test.id)) return;
    setSelectedTests(prev => [...prev, test]);
  };

  const removeTest = (id: number) => {
    setSelectedTests(prev => prev.filter(t => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: PackageFormValues = {
      ...form,
      testIds: selectedTests.map(t => t.id),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="Package name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Description"
        value={form.description ?? ""}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="number"
        className="w-full border p-2 rounded"
        placeholder="Price"
        value={form.price}
        onChange={e =>
          setForm({ ...form, price: Number(e.target.value) })
        }
        required
      />

      {/* Search Tests */}
      <input
        className="w-full border p-2 rounded"
        placeholder="Search tests..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Available Tests */}
      <div className="border rounded p-2 max-h-48 overflow-y-auto">
        {tests.map(test => (
          <div key={test.id} className="flex justify-between py-1">
            <span>{test.testName}</span>
            <button
              type="button"
              onClick={() => addTest(test)}
              className="text-blue-600"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {/* Selected Tests */}
      <div className="border rounded p-2">
        <h3 className="font-medium mb-2">Selected Tests</h3>

        {selectedTests.length === 0 && (
          <p className="text-sm text-gray-500">No tests added</p>
        )}

        {selectedTests.map(test => (
          <div key={test.id} className="flex justify-between py-1">
            <span>{test.testName}</span>
            <button
              type="button"
              onClick={() => removeTest(test.id)}
              className="text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Package"}
      </button>
    </form>
  );
}
