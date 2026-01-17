export interface Test {
  id: number
  department: string
  testCode: string
  testName: string
  amount: number
  methodName: string
  specimen: string
  specimenVolume: string
  container: string
  reported: string
  specialInstruction?: string
  createdAt?: string
  updatedAt?: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TestApiResponse {
  tests: Test[]
  pagination: Pagination
}

export type TestFilters = Partial<{
  department: string
  testCode: string
  testName: string
  methodName: string
  specimen: string
  specimenVolume: string
  container: string
  reported: string
  minAmount: number
  maxAmount: number
  specialInstruction: string
}>



// ---------------- PACKAGE TYPES ----------------

export interface Package {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  tests: Test[]; // array of full test objects
  createdAt?: string;
  updatedAt?: string;
}

// Filters for fetching packages
export type PackageFilters = Partial<{
  name: string;
  minPrice: number;
  maxPrice: number;
  testName: string;      // filter by included test's name
  testCode: string;      // filter by included test's code
  department: string;    // filter by included test's department
  methodName: string;    // filter by included test's method
  specimen: string;
  specimenVolume: string;
  container: string;
  reported: string;
  specialInstruction: string;
}>;

// Pagination response for packages
export interface PackageApiResponse {
  data: Package[];
  pagination: Pagination;
}



export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN";
}

export type PackageFormValues = {
  name: string;
  description?: string | null;
  price: number;
  testIds: number[];
};
