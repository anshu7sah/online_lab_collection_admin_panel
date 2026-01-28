"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

import {
  Booking,
  BookingStatus,
  PaymentStatus,
  PaymentMode,
} from "@/types/booking";
import { useSingleBooking } from "@/hooks/bookings/useSingleBooking";
import { useUpdateBooking } from "@/hooks/bookings/useUpdateBookings";
import { useDeleteBooking } from "@/hooks/bookings/useDeletebookings";

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = Number(params.id);

  const { data, isLoading } = useSingleBooking(bookingId);
  const updateBooking = useUpdateBooking(bookingId);
  const deleteBooking = useDeleteBooking();

  // ✅ form initialized lazily, no useEffect
  const [form, setForm] = useState<Partial<Booking> | null>(null);

  if (isLoading) return <div className="p-6">Loading booking...</div>;
  if (!data) return <div className="p-6 text-red-500">Booking not found</div>;

  // ✅ initialize once when data is ready
  if (!form) {
    setForm(data);
    return null;
  }

  const update = <K extends keyof Booking>(key: K, value: Booking[K]) => {
    setForm(prev => ({ ...prev!, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateBooking.mutateAsync({ id: bookingId, data: form });
      toast.success("Booking updated");
      router.back();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this booking permanently?")) return;
    try {
      await deleteBooking.mutateAsync(bookingId);
      toast.success("Booking deleted");
      router.push("/bookings");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="cursor-pointer">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>

          <Button variant="destructive" onClick={handleDelete} className="cursor-pointer">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* ---------- PATIENT INFO ---------- */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Patient Name">
              <Input
                value={form.name ?? ""}
                onChange={e => update("name", e.target.value)}
              />
            </Field>

            <Field label="Mobile">
              <Input
                value={form.mobile ?? ""}
                onChange={e => update("mobile", e.target.value)}
              />
            </Field>

            <Field label="Age">
              <Input
                type="number"
                value={form.age ?? ""}
                onChange={e => update("age", Number(e.target.value))}
              />
            </Field>

            <Field label="Patient ID">
              <Input
                type="number"
                value={form.patientId ?? ""}
                onChange={e => update("patientId", Number(e.target.value))}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* ---------- BOOKING DETAILS ---------- */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Booking Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Date">
              <Input
                type="date"
                value={form.date?.slice(0, 10) ?? ""}
                onChange={e => update("date", e.target.value)}
              />
            </Field>

            <Field label="Time Slot">
              <Input
                value={form.timeSlot ?? ""}
                onChange={e => update("timeSlot", e.target.value)}
              />
            </Field>

            <Field label="Latitude">
              <Input
                type="number"
                value={form.latitude ?? ""}
                onChange={e => update("latitude", Number(e.target.value))}
              />
            </Field>

            <Field label="Longitude">
              <Input
                type="number"
                value={form.longitude ?? ""}
                onChange={e => update("longitude", Number(e.target.value))}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* ---------- STATUS & PAYMENT ---------- */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Status & Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Booking Status">
              <select
                className="w-full border rounded px-2 py-2"
                value={form.status}
                onChange={e =>
                  update("status", e.target.value as BookingStatus)
                }
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="SAMPLE_COLLECTED">Sample Collected</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </Field>

            <Field label="Payment Status">
              <select
                className="w-full border rounded px-2 py-2"
                value={form.paymentStatus}
                onChange={e =>
                  update(
                    "paymentStatus",
                    e.target.value as PaymentStatus
                  )
                }
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
              </select>
            </Field>

            <Field label="Payment Mode">
              <select
                className="w-full border rounded px-2 py-2"
                value={form.paymentMode ?? ""}
                onChange={e =>
                  update("paymentMode", e.target.value as PaymentMode)
                }
              >
                <option value="">—</option>
                <option value="PAY_LATER">Pay Later</option>
                <option value="ESEWA">eSewa</option>
                <option value="KHALTI">Khalti</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </Field>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- REUSABLE FIELD ---------- */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
