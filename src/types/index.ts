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
  createdAt: string
  updatedAt: string
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



export interface Package {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  tests: Test[];
}


export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN";
}

export type PackageFormValues = {
  name: string;
  description?: string;
  price: number;
  testIds: number[];
};
