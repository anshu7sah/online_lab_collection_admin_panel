"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking, BookingStatus, PaymentStatus } from "@/types/booking";
import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface BookingCardProps {
  booking: Booking;
  onStatusChange: (id: number, status: BookingStatus) => void;
  onPaymentChange: (id: number, paymentStatus: PaymentStatus) => void;
  onUploadReport: (id: number) => void;
  onAssignPatientId: (id: number, patientId: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  isUploading?: boolean;
}

export const BookingCard = ({
  booking,
  onStatusChange,
  onPaymentChange,
  onUploadReport,
  onAssignPatientId,
  onDelete,
  onEdit,
  isUploading = false,
}: BookingCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // Local state for instant updates
  const [localStatus, setLocalStatus] = useState<BookingStatus>(booking.status);
  const [localPayment, setLocalPayment] = useState<PaymentStatus>(booking.paymentStatus);
  const [patientIdInput, setPatientIdInput] = useState("");

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm space-y-2">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{booking.name}</h3>
          <p className="text-sm text-gray-500">📞 {booking.mobile}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge>{booking.status}</Badge>

          <Eye
            className="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-600"
            onClick={() => setExpanded(p => !p)}
          />

          <Pencil
            className="w-5 h-5 cursor-pointer text-gray-600 hover:text-green-600"
            onClick={() => onEdit(booking.id)}
          />

          <Trash2
            className="w-5 h-5 cursor-pointer text-gray-600 hover:text-red-600"
            onClick={() => {
              if (confirm("Delete this booking?")) onDelete(booking.id);
            }}
          />
        </div>
      </div>

      {/* EXPANDED DETAILS */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden text-sm grid grid-cols-2 gap-2 pt-3"
          >
            {/* BASIC INFO */}
            <p><b>Booking ID:</b> {booking.id}</p>
            <p><b>User Name:</b> {booking.user?.name}</p>
            <p><b>User Mobile:</b> {booking.user?.mobile}</p>
            <p><b>Patient ID:</b> {booking.patientId ?? "Not assigned"}</p>
            <p><b>Name:</b> {booking.name}</p>
            <p><b>Age:</b> {booking.age}</p>
            <p><b>Gender:</b> {booking.gender}</p>
            <p className="col-span-2"><b>Address:</b> {booking.address}</p>
            <p><b>Date:</b> {new Date(booking.date).toLocaleDateString()}</p>
            <p><b>Time Slot:</b> {booking.timeSlot}</p>
            <p><b>Doctor:</b> {booking.prcDoctor ?? "—"}</p>
            <p><b>Has Prescription:</b> {booking.hasPrescription ? "Yes" : "No"}</p>

            {booking.prescriptionFile && (
              <p className="col-span-2">
                <b>Prescription File:</b>{" "}
                <a
                  href={booking.prescriptionFile}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </p>
            )}

            {/* STATUS & PAYMENT */}
            <p><b>Status:</b> {booking.status}</p>
            <p><b>Payment Status:</b> {booking.paymentStatus}</p>
            <p><b>Payment Mode:</b> {booking.paymentMode ?? "—"}</p>
            <p><b>Notes:</b> {booking.notes ?? "—"}</p>
            <p><b>Created At:</b> {new Date(booking.createdAt).toLocaleString()}</p>
            <p><b>Updated At:</b> {new Date(booking.updatedAt).toLocaleString()}</p>

            {/* BOOKING ITEMS */}
            {booking.items?.length > 0 && (
              <div className="col-span-2 pt-2">
                <b>Items:</b>
                <ul className="list-disc pl-5">
                  {booking.items.map(item => (
                    <li key={item.id}>
                      {item.name} ({item.type}) – ₹{item.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* MAP */}
            {booking.latitude && booking.longitude && (
              <div className="col-span-2 mt-2">
                <b>Location:</b>
                <iframe
                  width="100%"
                  height="200"
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${booking.latitude},${booking.longitude}&hl=es;z=14&output=embed`}
                />
              </div>
            )}

            {/* REPORT */}
            <p className="col-span-2">
              <b>Report:</b>{" "}
              {booking.reportUrl ? (
                <a
                  href={`${API_URL}/bookings/${booking.id}/report/view`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              ) : (
                "Not uploaded"
              )}
            </p>

            {/* ACTIONS */}
            <div className="col-span-2 flex flex-wrap gap-2 pt-3 border-t mt-2">
              {/* Booking Status */}
              <select
                value={localStatus}
                onChange={e => {
                  const val = e.target.value as BookingStatus;
                  setLocalStatus(val);
                  onStatusChange(booking.id, val);
                }}
                className="border rounded px-2 py-1"
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="SAMPLE_COLLECTED">Sample Collected</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              {/* Payment Status */}
              <select
                value={localPayment}
                onChange={e => {
                  const val = e.target.value as PaymentStatus;
                  setLocalPayment(val);
                  onPaymentChange(booking.id, val);
                }}
                className="border rounded px-2 py-1"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
              </select>

              {/* Upload / Replace Report */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUploadReport(booking.id)}
                disabled={isUploading}
              >
                {isUploading
                  ? "Uploading..."
                  : booking.reportUrl
                  ? "Replace Report"
                  : "Upload Report"}
              </Button>

              {/* Assign Patient ID */}
              {!booking.patientId && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Patient ID"
                    value={patientIdInput}
                    onChange={e => setPatientIdInput(e.target.value)}
                    className="border rounded px-2 py-1 w-24"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const id = Number(patientIdInput);
                      if (!id) return;
                      onAssignPatientId(booking.id, id);
                      setPatientIdInput("");
                    }}
                  >
                    Assign ID
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
