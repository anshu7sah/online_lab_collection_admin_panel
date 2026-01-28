// types/booking.ts
export type BookingStatus = "SCHEDULED" | "SAMPLE_COLLECTED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";
export type PaymentMode = "PAY_LATER" | "ESEWA" | "KHALTI" | "BANK_TRANSFER";

export interface BookingItem {
  id: number;
  type: "test" | "package";
  name: string;
  price: number;
  testId?: number | null;
  packageId?: number | null;
}

export interface Booking {
  id: number;
  name: string;     
  age: number;
  gender: string;
  mobile: string;
  address: string;
  latitude: number;
  longitude: number;
  date: string;           // ISO string from backend
  timeSlot: string;
  prcDoctor?: string | null;
  hasPrescription: boolean;
  prescriptionFile?: string | null;
  reportUrl?: string | null;

  patientId?: number | null;  // admin-assigned later
  paymentMode?: PaymentMode | null;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;

  items: BookingItem[];
  user?: { id: number; name: string; mobile: string }; // optional if you want to display
}


export interface BookingApiResponse {
  data: Booking[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

// types/booking.ts
export interface BookingFilters {
  status?: string;          // BookingStatus as string
  paymentStatus?: string;   // PaymentStatus as string
  paymentMode?: string;     // PaymentMode as string
  patientId?: number;
  mobile?: string;
  date?: string;            // ISO string
  timeSlot?: string;
}


