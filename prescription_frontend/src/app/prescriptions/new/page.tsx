"use client";

import React from "react";
import { Protected } from "@/components/auth/Protected";
import { PrescriptionForm } from "@/components/prescriptions/PrescriptionForm";

export default function NewPrescriptionPage() {
  return (
    <Protected roles={["doctor", "admin"]}>
      <div className="max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Create Prescription</h2>
        <PrescriptionForm />
      </div>
    </Protected>
  );
}
