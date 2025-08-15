"use client";

import React, { useEffect, useState } from "react";
import { listPrescriptions } from "@/lib/api";
import type { PrescriptionRead } from "@/lib/types";
import Link from "next/link";

export function PrescriptionList({ title }: { title?: string }) {
  const [items, setItems] = useState<PrescriptionRead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listPrescriptions();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title || "Recent Prescriptions"}</h3>
        <button
          onClick={load}
          className="text-sm px-2 py-1 border rounded-md hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">No prescriptions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2">ID</th>
                <th className="py-2">Code</th>
                <th className="py-2">Patient</th>
                <th className="py-2">Medication</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.id}</td>
                  <td className="py-2">{p.code}</td>
                  <td className="py-2">{p.patient_name}</td>
                  <td className="py-2">{p.medication_name}</td>
                  <td className="py-2">
                    <span className="px-2 py-0.5 rounded-full border text-xs">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <Link
                      href={`/prescriptions/${p.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
