"use client";

import React, { useState } from "react";
import { pharmacistVerifyByCode, publicVerifyByCode } from "@/lib/api";
import type { PrescriptionRead } from "@/lib/types";
import { useAuth } from "../auth/AuthProvider";

export function VerifyForm() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<PrescriptionRead | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = token && user?.role === "pharmacist"
        ? await pharmacistVerifyByCode(code)
        : await publicVerifyByCode(code);
      setResult(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onVerify} className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 border rounded-md px-3 py-2"
          placeholder="Enter prescription code"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
      {result && (
        <div className="border rounded-lg p-4 bg-white">
          <div className="text-lg font-semibold mb-2">Verification Result</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Code:</span> {result.code}
            </div>
            <div>
              <span className="text-gray-500">Patient:</span> {result.patient_name}
            </div>
            <div>
              <span className="text-gray-500">Medication:</span> {result.medication_name}
            </div>
            <div>
              <span className="text-gray-500">Status:</span>{" "}
              <span className="px-2 py-0.5 rounded-full border">
                {result.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
