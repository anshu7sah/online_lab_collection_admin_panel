"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";
import { BookingCard } from "@/components/bookings/BookingCard";

import { Booking, BookingFilters, BookingStatus, PaymentStatus } from "@/types/booking";
import { toast } from "react-toastify";
import { useAllBookings } from "@/hooks/bookings/useAllBookings";
import { useUpdateBookingStatus } from "@/hooks/bookings/useUpdateBookingStatus";
import { useUploadReport } from "@/hooks/bookings/useUploadReport";
import { useUpdateBooking } from "@/hooks/bookings/useUpdateBookings";
import { useSingleBooking } from "@/hooks/bookings/useSingleBooking";
import { useRouter } from "next/navigation";
import { useDeleteBooking } from "@/hooks/bookings/useDeletebookings";


/* ---------------- SKELETON ---------------- */
const BookingSkeleton = () => (
  <div className="border rounded-xl p-4 animate-pulse space-y-3 bg-white shadow-sm">
    <div className="h-5 bg-gray-200 rounded w-1/3" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

export default function AdminBookingsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<BookingFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<number | null>(null);
  const [showSingleBooking, setShowSingleBooking] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);


  const fileInputRef = useRef<HTMLInputElement>(null);
  const debouncedFilters = useDebounce(filters, 400);

  /* ---------------- HOOKS ---------------- */
  const { data, isLoading, refetch } = useAllBookings({
    page,
    limit: 10,
    filters: debouncedFilters,
  });

  const updateBookingStatusMutation = useUpdateBookingStatus();
  const uploadReportMutation = useUploadReport();
  const updateBookingMutation = useUpdateBooking();
  const singleBookingQuery = useSingleBooking(activeBookingId || 0);
  const router=useRouter();

  const deleteBookingMutation = useDeleteBooking();

  /* ---------------- FILTER UPDATE ---------------- */
  const updateFilter = <K extends keyof BookingFilters>(key: K, value: BookingFilters[K]) => {
    setPage(1);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  /* ---------------- STATUS & PAYMENT UPDATE ---------------- */
  const handleStatusChange = async (id: number, status: BookingStatus) => {
    try {
      await updateBookingStatusMutation.mutateAsync({ id, status });
      toast.success("Booking status updated!");
      refetch();
    } catch {
      toast.error("Failed to update booking status");
    }
  };

  const handlePaymentChange = async (id: number, paymentStatus: PaymentStatus) => {
    try {
      await updateBookingStatusMutation.mutateAsync({ id, paymentStatus });
      toast.success("Payment status updated!");
      refetch();
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  /* ---------------- REPORT UPLOAD ---------------- */
  const handleUploadClick = (bookingId: number) => {
    setActiveBookingId(bookingId);
    fileInputRef.current?.click();
  };

const handleReportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !activeBookingId) return;

  try {
    setUploadingId(activeBookingId);
    await uploadReportMutation.mutateAsync({ id: activeBookingId, file });
    toast.success("Report uploaded successfully");
    refetch();
  } catch {
    toast.error("Failed to upload report");
  } finally {
    e.target.value = "";
    setUploadingId(null);
  }
};



  const closeSingleBooking = () => {
    setActiveBookingId(null);
    setShowSingleBooking(false);
  };

const handleEdit = (id: number) => {
  router.push(`/bookings/${id}/edit`);
};

const handleDelete = async (id: number) => {
  try {
    await deleteBookingMutation.mutateAsync(id);
    toast.success("Booking deleted");
    refetch();
  } catch {
    toast.error("Failed to delete booking");
  }
};

  const handleAssignPatientId = async (id: number, patientId: number) => {
  try {
    await updateBookingMutation.mutateAsync({ id, data: { patientId } });
    toast.success("Patient ID assigned!");
    refetch();
  } catch {
    toast.error("Failed to assign patient ID");
  }
};


  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex-1">Bookings Dashboard</h1>
        <div className="flex gap-2 flex-wrap items-center">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowAdvanced(true)}>
            <Filter size={16} /> Advanced Filters
          </Button>
        </div>
      </div>

      {/* ---------------- QUICK FILTERS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Input type="number" placeholder="Patient ID" onChange={e => updateFilter("patientId", e.target.value ? Number(e.target.value) : undefined)} />
        <Input placeholder="Mobile" onChange={e => updateFilter("mobile", e.target.value || undefined)} />
        <Input type="date" onChange={e => updateFilter("date", e.target.value || undefined)} />
        <Input placeholder="Time Slot" onChange={e => updateFilter("timeSlot", e.target.value || undefined)} />
      </div>

      {/* ---------------- BOOKINGS LIST ---------------- */}
      <div className="space-y-4">
        {isLoading && Array.from({ length: 5 }).map((_, i) => <BookingSkeleton key={i} />)}

        {!isLoading &&
          data?.data.map((booking: Booking) => (
<BookingCard
  key={booking.id}
  booking={booking}
  onStatusChange={handleStatusChange}
  onPaymentChange={handlePaymentChange}
  onUploadReport={handleUploadClick}
  onAssignPatientId={handleAssignPatientId}
  onEdit={handleEdit}
  onDelete={handleDelete}
  isUploading={uploadingId === booking.id}
/>



          ))}

        {!isLoading && data?.data.length === 0 && (
          <p className="text-gray-500 text-center py-6">No bookings found.</p>
        )}
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      {data && (
        <div className="flex justify-center gap-4 pt-6">
          <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
          <span className="py-2 text-gray-700">{page} / {Math.ceil(data.pagination.total / 10)}</span>
          <Button disabled={page * 10 >= data.pagination.total} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}

      {/* ---------------- REPORT INPUT ---------------- */}
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleReportUpload} />

      {/* ---------------- ADVANCED FILTERS ---------------- */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl p-6 overflow-auto z-50"
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Advanced Filters</h2>
              <Button variant="ghost" onClick={() => setShowAdvanced(false)}><X /></Button>
            </div>
            <div className="space-y-4">
              <select className="w-full border p-2 rounded" onChange={e => updateFilter("status", e.target.value || undefined)}>
                <option value="">Booking Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="SAMPLE_COLLECTED">Sample Collected</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <select className="w-full border p-2 rounded" onChange={e => updateFilter("paymentStatus", e.target.value || undefined)}>
                <option value="">Payment Status</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
              </select>

              <select className="w-full border p-2 rounded" onChange={e => updateFilter("paymentMode", e.target.value || undefined)}>
                <option value="">Payment Mode</option>
                <option value="PAY_LATER">Pay Later</option>
                <option value="ESEWA">eSewa</option>
                <option value="KHALTI">Khalti</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>

              <Input placeholder="Patient ID" type="number" onChange={e => updateFilter("patientId", e.target.value ? Number(e.target.value) : undefined)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- SINGLE BOOKING SLIDEOVER ---------------- */}
      <AnimatePresence>
        {showSingleBooking && singleBookingQuery.data && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 w-96 h-full bg-white shadow-2xl p-6 overflow-auto z-50"
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <Button variant="ghost" onClick={closeSingleBooking}><X /></Button>
            </div>

            <div className="space-y-3">
              <p><b>Name:</b> {singleBookingQuery.data.name}</p>
              <p><b>Mobile:</b> {singleBookingQuery.data.mobile}</p>
              <p><b>Status:</b> {singleBookingQuery.data.status}</p>
              <p><b>Payment Status:</b> {singleBookingQuery.data.paymentStatus}</p>
              <p><b>Payment Mode:</b> {singleBookingQuery.data.paymentMode ?? "—"}</p>
              <p><b>Patient ID:</b> {singleBookingQuery.data.patientId ?? "Not assigned"}</p>
              <p><b>Date:</b> {new Date(singleBookingQuery.data.date).toLocaleDateString()}</p>
              <p><b>Time Slot:</b> {singleBookingQuery.data.timeSlot}</p>

              <div className="flex gap-2 pt-2">
                <select
                  value={singleBookingQuery.data.status}
                  onChange={e => handleStatusChange(singleBookingQuery.data.id, e.target.value as BookingStatus)}
                  className="border rounded px-2 py-1"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="SAMPLE_COLLECTED">Sample Collected</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  value={singleBookingQuery.data.paymentStatus}
                  onChange={e => handlePaymentChange(singleBookingQuery.data.id, e.target.value as PaymentStatus)}
                  className="border rounded px-2 py-1"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="FAILED">Failed</option>
                </select>

                <Button size="sm" variant="outline" onClick={() => handleUploadClick(singleBookingQuery.data.id)}>
                  Upload Report
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
