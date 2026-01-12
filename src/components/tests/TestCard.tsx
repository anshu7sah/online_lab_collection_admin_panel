"use client";
import { Test } from "@/types";
import { useState } from "react";
import {AnimatePresence, motion} from "framer-motion";
import { Eye, Pencil, Trash2 } from "lucide-react";
export const TestCard = ({
  test,
  onDelete,
}: {
  test: Test;
  onDelete: (id: number) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div layout className="border rounded-xl p-4 shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{test.testName}</h3>
          <p className="text-sm text-gray-500">
            Code: {test.testCode} | Amount: ₹{test.amount} | Reported:{" "}
            {new Date(test.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3">
          <Eye
            className="cursor-pointer text-blue-500"
            onClick={() => setOpen(!open)}
          />
          <Pencil className="cursor-pointer text-yellow-500" />
          <Trash2
            className="cursor-pointer text-red-500"
            onClick={() => onDelete(test.id)}
          />
        </div>
      </div>

      {/* DETAILS */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-1 text-sm text-gray-600"
          >
            <p>
              <b>Department:</b> {test.department}
            </p>
            <p>
              <b>Method:</b> {test.methodName}
            </p>
            <p>
              <b>Specimen:</b> {test.specimen}
            </p>
            <p>
              <b>Volume:</b> {test.specimenVolume}
            </p>
            <p>
              <b>Container:</b> {test.container}
            </p>
            <p>
              <b>Reported:</b> {test.reported}
            </p>
            {test.specialInstruction && (
              <p>
                <b>Note:</b> {test.specialInstruction}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};