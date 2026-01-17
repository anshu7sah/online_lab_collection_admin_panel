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
  const [form, setForm] = useState(() => ({
    name: defaultValues?.name ?? "",
    description: defaultValues?.description ?? "",
    price: defaultValues?.price ?? 0,
  }));

  /* ---------------- SELECTED TESTS ---------------- */
  const [selectedTests, setSelectedTests] = useState<Test[]>(
    defaultValues?.tests ?? []
  );

  /* ---------------- TOTAL TEST PRICE ---------------- */
  const totalTestAmount = useMemo(
    () => selectedTests.reduce((sum, t) => sum + t.amount, 0),
    [selectedTests]
  );

  /* ---------------- INITIAL DISCOUNT ---------------- */
  const initialDiscountAmount = useMemo(() => {
    if (!defaultValues) return "";
    const total = defaultValues.tests.reduce((s, t) => s + t.amount, 0);
    const discount = Math.max(total - defaultValues.price, 0);
    return discount ? discount.toFixed(2) : "";
  }, [defaultValues]);

  const initialDiscountPercent = useMemo(() => {
    if (!defaultValues) return "";
    const total = defaultValues.tests.reduce((s, t) => s + t.amount, 0);
    if (!total) return "";
    const discount = Math.max(total - defaultValues.price, 0);
    return ((discount / total) * 100).toFixed(2);
  }, [defaultValues]);

  /* ---------------- DISCOUNT STATE ---------------- */
  const [discountPercent, setDiscountPercent] = useState(initialDiscountPercent);
  const [discountAmount, setDiscountAmount] = useState(initialDiscountAmount);

  /* ---------------- SEARCH ---------------- */
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

  /* ---------------- FINAL PRICE ---------------- */
  const finalPrice = useMemo(() => {
    return Math.max(totalTestAmount - (Number(discountAmount) || 0), 0);
  }, [totalTestAmount, discountAmount]);

  /* ---------------- DISCOUNT HANDLERS ---------------- */
  const handleDiscountPercent = (value: string) => {
    setDiscountPercent(value);
    const percent = Number(value);
    if (isNaN(percent) || percent < 0) return;

    const amount = (totalTestAmount * percent) / 100;
    setDiscountAmount(amount.toFixed(2));
    setForm(p => ({ ...p, price: totalTestAmount - amount }));
  };

  const handleDiscountAmount = (value: string) => {
    setDiscountAmount(value);
    const amount = Number(value);
    if (isNaN(amount) || amount < 0) return;

    const percent = totalTestAmount
      ? (amount / totalTestAmount) * 100
      : 0;
    setDiscountPercent(percent.toFixed(2));
    setForm(p => ({ ...p, price: totalTestAmount - amount }));
  };

  /* ---------------- ADD / REMOVE ---------------- */
  const addTest = (test: Test) => {
    if (selectedTests.some(t => t.id === test.id)) return;
    const updated = [...selectedTests, test];
    setSelectedTests(updated);
    setForm(p => ({ ...p, price: finalPrice }));
  };

  const removeTest = (id: number) => {
    const updated = selectedTests.filter(t => t.id !== id);
    setSelectedTests(updated);
    setForm(p => ({ ...p, price: finalPrice }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name: form.name,
      description: form.description,
      price: form.price,
      testIds: selectedTests.map(t => t.id),
    });
  };

  /* ================= UI ================= */
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl"
    >
      {/* LEFT */}
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
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Search tests..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="border rounded max-h-72 overflow-y-auto divide-y">
          {tests.map(test => (
            <div
              key={test.id}
              className="flex justify-between items-center p-3 hover:bg-gray-50 transition"
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
                className="px-3 py-1 text-sm border rounded cursor-pointer
                           hover:bg-black hover:text-white transition"
              >
                Add ₹{test.amount}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-4">
        <div className="border rounded p-4 space-y-3">
          <h3 className="font-medium">Selected Tests</h3>

          {selectedTests.map(test => (
            <div
              key={test.id}
              className="flex justify-between text-sm items-center"
            >
              <span>{test.testName}</span>
              <div className="flex gap-2 items-center">
                <span>₹{test.amount}</span>
                <button
                  type="button"
                  onClick={() => removeTest(test.id)}
                  className="text-red-600 cursor-pointer
                             hover:text-red-800 transition"
                  title="Remove test"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

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
          className="w-full bg-black text-white py-2 rounded
                     cursor-pointer disabled:cursor-not-allowed
                     hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading
            ? defaultValues
              ? "Updating..."
              : "Saving..."
            : defaultValues
            ? "Update Package"
            : "Save Package"}
        </button>
      </div>
    </form>
  );
}
