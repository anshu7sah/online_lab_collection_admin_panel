"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";

type TestFormValues = {
  department: string;
  testCode: string;
  testName: string;
  amount: number;
  methodName: string;
  specimen: string;
  specimenVolume: string;
  container: string;
  reported: string;
  specialInstruction?: string;
};

interface Props {
  defaultValues?: Partial<TestFormValues>;
  onSubmit: (data: TestFormValues) => void;
  isLoading?: boolean;
  title: string;
}


export function TestForm({
  defaultValues,
  onSubmit,
  isLoading,
  title,
}: Props) {
  const { register, handleSubmit, reset } = useForm<TestFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Department" {...register("department")} />
          <Input placeholder="Test Code" {...register("testCode")} />
          <Input placeholder="Test Name" {...register("testName")} />

          <Input
            type="number"
            placeholder="Amount"
            {...register("amount", { valueAsNumber: true })}
          />

          <Input placeholder="Method Name" {...register("methodName")} />
          <Input placeholder="Specimen" {...register("specimen")} />
          <Input placeholder="Specimen Volume" {...register("specimenVolume")} />
          <Input placeholder="Container" {...register("container")} />
          <Input placeholder="Reported" {...register("reported")} />

          <Textarea
            placeholder="Special Instruction (optional)"
            {...register("specialInstruction")}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Test"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
