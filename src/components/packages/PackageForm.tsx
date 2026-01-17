"use client";

import { useState, useMemo } from "react";
import { PackageFormValues, Test } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchTests } from "@/hooks/tests/useSearchTests";

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
  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    name: defaultValues?.name ?? "",
    description: defaultValues?.description ?? "",
    price: defaultValues?.price ?? 0,
  });

  /* ---------------- SELECTED TESTS ---------------- */
  const [selectedTests, setSelectedTests] = useState<Test[]>(
    defaultValues?.tests ?? []
  );

  /* ---------------- SEARCH (DEBOUNCED) ---------------- */
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data } = useSearchTests({
    page: 1,
    limit: 50,
    filters: {
      testName: debouncedSearch,
      testCode: debouncedSearch,
    },
  });

  const tests = data?.tests ?? [];

  /* ---------------- PRICE CALCULATION ---------------- */
  const totalTestAmount = useMemo(() => {
    return selectedTests.reduce((sum, t) => sum + t.amount, 0);
  }, [selectedTests]);

  /* ---------------- DISCOUNT STATE (use string for inputs) ---------------- */
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<string>("");

  const finalPrice = useMemo(() => {
    const amount = Number(discountAmount) || 0;
    return Math.max(totalTestAmount - amount, 0);
  }, [totalTestAmount, discountAmount]);

  /* ---------------- DISCOUNT HANDLERS ---------------- */
  const handleDiscountPercent = (value: string) => {
    setDiscountPercent(value);

    const percent = Number(value);
    if (isNaN(percent) || percent < 0) {
      setDiscountAmount("");
      setForm(prev => ({ ...prev, price: totalTestAmount }));
      return;
    }

    const amount = (totalTestAmount * percent) / 100;
    setDiscountAmount(amount ? amount.toFixed(2) : "");
    setForm(prev => ({ ...prev, price: Number((totalTestAmount - amount).toFixed(2)) }));
  };

  const handleDiscountAmount = (value: string) => {
    setDiscountAmount(value);

    const amount = Number(value);
    if (isNaN(amount) || amount < 0) {
      setDiscountPercent("");
      setForm(prev => ({ ...prev, price: totalTestAmount }));
      return;
    }

    const percent = totalTestAmount ? (amount / totalTestAmount) * 100 : 0;
    setDiscountPercent(percent ? percent.toFixed(2) : "");
    setForm(prev => ({ ...prev, price: Number((totalTestAmount - amount).toFixed(2)) }));
  };

  /* ---------------- ADD / REMOVE TESTS ---------------- */
  const addTest = (test: Test) => {
    if (selectedTests.some(t => t.id === test.id)) return;

    const updated = [...selectedTests, test];
    setSelectedTests(updated);

    const newTotal = updated.reduce((s, t) => s + t.amount, 0);
    const discountAmt = (newTotal * (Number(discountPercent) || 0)) / 100;

    setDiscountAmount(discountAmt ? discountAmt.toFixed(2) : "");
    setForm(prev => ({
      ...prev,
      price: Number((newTotal - discountAmt).toFixed(2)),
    }));
  };

  const removeTest = (id: number) => {
    const updated = selectedTests.filter(t => t.id !== id);
    setSelectedTests(updated);

    const newTotal = updated.reduce((s, t) => s + t.amount, 0);
    const discountAmt = (newTotal * (Number(discountPercent) || 0)) / 100;

    setDiscountAmount(discountAmt ? discountAmt.toFixed(2) : "");
    setForm(prev => ({
      ...prev,
      price: Number((newTotal - discountAmt).toFixed(2)),
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: PackageFormValues = {
      name: form.name,
      description: form.description,
      price: form.price,
      testIds: selectedTests.map(t => t.id),
    };

    onSubmit(payload);
  };

  /* ================= UI ================= */
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl"
    >
      {/* ================= LEFT ================= */}
      <div className="lg:col-span-2 space-y-6">
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
          onChange={e =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* -------- SEARCH -------- */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Search tests by name or code..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* -------- AVAILABLE TESTS -------- */}
        <div className="border rounded max-h-72 overflow-y-auto divide-y">
          {tests.map(test => (
            <div
              key={test.id}
              className="flex justify-between items-center p-3 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{test.testName}</p>
                <p className="text-xs text-gray-500">
                  {test.testCode} • {test.department}
                </p>
              </div>

              <button
                type="button"
                onClick={() => addTest(test)}
                className="px-3 py-1 text-sm border rounded hover:bg-black hover:text-white"
              >
                Add ₹{test.amount}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="space-y-4">
        {/* -------- SELECTED TESTS -------- */}
        <div className="border rounded p-4 space-y-3">
          <h3 className="font-medium">Selected Tests</h3>

          {selectedTests.length === 0 && (
            <p className="text-sm text-gray-500">
              No tests selected
            </p>
          )}

          {selectedTests.map(test => (
            <div
              key={test.id}
              className="flex justify-between items-center text-sm"
            >
              <span>{test.testName}</span>
              <div className="flex items-center gap-2">
                <span>₹{test.amount}</span>
                <button
                  type="button"
                  onClick={() => removeTest(test.id)}
                  className="text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* -------- PRICE SUMMARY -------- */}
        <div className="border rounded p-4 space-y-3">
          <div className="flex justify-between font-medium">
            <span>Total Test Price</span>
            <span>₹{totalTestAmount}</span>
          </div>

          <input
            type="number"
            placeholder="Discount %"
            value={discountPercent}
            onChange={e => handleDiscountPercent(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Discount Amount"
            value={discountAmount}
            onChange={e => handleDiscountAmount(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-between text-lg font-semibold">
            <span>Final Package Price</span>
            <span>₹{finalPrice}</span>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Package"}
        </button>
      </div>
    </form>
  );
}
