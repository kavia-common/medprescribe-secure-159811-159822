"use client";

import React from "react";
import { VerifyForm } from "@/components/verify/VerifyForm";

export default function VerifyPage() {
  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-3">Verify Prescription</h2>
      <p className="text-sm text-gray-600 mb-4">
        Enter a prescription code. Pharmacists who are logged in will automatically confirm verification.
      </p>
      <VerifyForm />
    </div>
  );
}
