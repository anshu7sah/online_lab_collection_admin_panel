"use client";

import { TestForm } from "@/components/tests/TestForm";
import { useSingleTest } from "@/hooks/tests/useSingleTest";
import { useUpdateTest } from "@/hooks/tests/useUpdateTests";
import { useParams, useRouter } from "next/navigation";

export default function EditTestPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: test, isLoading } = useSingleTest(Number(id));
  const { mutate, isPending } = useUpdateTest(Number(id));

  if (isLoading || !test) return <p>Loading...</p>;

  const defaultValues = {
    department: test.department,
    testCode: test.testCode,
    testName: test.testName,
    amount: test.amount,
    methodName: test.methodName,
    specimen: test.specimen,
    specimenVolume: test.specimenVolume,
    container: test.container,
    reported: test.reported,
    specialInstruction: test.specialInstruction ?? undefined,
  };

  return (
    <TestForm
      title="Edit Test"
      defaultValues={defaultValues}
      isLoading={isPending}
      onSubmit={(data) =>
        mutate(data, {
          onSuccess: () => router.push("/tests"),
        })
      }
    />
  );
}
