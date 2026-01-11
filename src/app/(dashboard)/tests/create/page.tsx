"use client";

import { TestForm } from "@/components/tests/TestForm";
import { useCreateTest } from "@/hooks/tests/useCreateTest";
import { useRouter } from "next/navigation";

export default function CreateTestPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateTest();

  return (
    <TestForm
      title="Create Test"
      isLoading={isPending}
      onSubmit={(data) =>
        mutate(data, {
          onSuccess: () => router.push("/tests"),
        })
      }
    />
  );
}
