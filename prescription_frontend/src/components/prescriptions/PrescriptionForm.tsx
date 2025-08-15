"use client";

import React, { useState } from "react";
import {
  createPrescription,
  generatePrescriptionCode,
} from "@/lib/api";
import type { PrescriptionCreate } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthProvider";

export function PrescriptionForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<PrescriptionCreate>({
    code: "",
    patient_name: "",
    patient_dob: "",
    medication_name: "",
    dosage: "",
    quantity: undefined,
    instructions: "",
    status: "created",
    offchain_hash: "",
    doctor_id: user?.id || 0,
    pharmacist_id: undefined,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof PrescriptionCreate>(k: K, v: PrescriptionCreate[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const genCode = async () => {
    try {
      const { code } = await generatePrescriptionCode(8);
      setField("code", code);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Failed to generate code");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: PrescriptionCreate = {
        ...form,
        doctor_id: user?.id || 0,
        status: "created",
        patient_dob: form.patient_dob || null,
        dosage: form.dosage || null,
        instructions: form.instructions || null,
        quantity: form.quantity ?? null,
        offchain_hash: form.offchain_hash || null,
        pharmacist_id: form.pharmacist_id ?? null,
      };
      const created = await createPrescription(payload);
      router.push(`/prescriptions/${created.id}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Failed to create prescription");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="p-3 rounded-md bg-red-50 text-red-700">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Code</label>
          <div className="flex gap-2">
            <input
              value={form.code}
              onChange={(e) => setField("code", e.target.value)}
              className="flex-1 border rounded-md px-3 py-2"
              placeholder="Generate or enter"
              required
            />
            <button
              type="button"
              onClick={genCode}
              className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
            >
              Generate
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Patient Name</label>
          <input
            value={form.patient_name}
            onChange={(e) => setField("patient_name", e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Patient DOB</label>
          <input
            value={form.patient_dob || ""}
            onChange={(e) => setField("patient_dob", e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="YYYY-MM-DD"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Medication</label>
          <input
            value={form.medication_name}
            onChange={(e) => setField("medication_name", e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Atorvastatin"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dosage</label>
          <input
            value={form.dosage || ""}
            onChange={(e) => setField("dosage", e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="10mg once daily"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={form.quantity ?? ""}
            onChange={(e) => setField("quantity", e.target.value ? parseInt(e.target.value, 10) : undefined)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="30"
            min={1}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Instructions</label>
        <textarea
          value={form.instructions || ""}
          onChange={(e) => setField("instructions", e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          rows={3}
          placeholder="Take one tablet daily after dinner"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Off-chain Hash (optional)</label>
          <input
            value={form.offchain_hash || ""}
            onChange={(e) => setField("offchain_hash", e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Integrity hash"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pharmacist ID (optional)</label>
          <input
            type="number"
            value={form.pharmacist_id ?? ""}
            onChange={(e) =>
              setField("pharmacist_id", e.target.value ? parseInt(e.target.value, 10) : undefined)
            }
            className="w-full border rounded-md px-3 py-2"
            placeholder="Assigned pharmacist user ID"
            min={1}
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create Prescription"}
        </button>
      </div>
    </form>
  );
}
