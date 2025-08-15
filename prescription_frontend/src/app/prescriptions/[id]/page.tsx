"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Protected } from "@/components/auth/Protected";
import { getPrescription } from "@/lib/api";
import type { PrescriptionRead } from "@/lib/types";
import { QRCodeViewer } from "@/components/prescriptions/QRCodeViewer";

export default function PrescriptionDetailPage() {
  return (
    <Protected roles={["doctor", "pharmacist", "admin"]}>
      <Content />
    </Protected>
  );
}

function Content() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [data, setData] = useState<PrescriptionRead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const d = await getPrescription(id);
        setData(d);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-semibold mb-2">Prescription #{data.id}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-4 bg-white">
          <div className="text-lg font-semibold mb-2">Details</div>
          <dl className="text-sm space-y-1">
            <div>
              <span className="text-gray-500">Code:</span> {data.code}
            </div>
            <div>
              <span className="text-gray-500">Patient:</span> {data.patient_name}
            </div>
            <div>
              <span className="text-gray-500">Medication:</span> {data.medication_name}
            </div>
            <div>
              <span className="text-gray-500">Dosage:</span> {data.dosage || "-"}
            </div>
            <div>
              <span className="text-gray-500">Quantity:</span>{" "}
              {data.quantity ?? "-"}
            </div>
            <div>
              <span className="text-gray-500">Status:</span>{" "}
              <span className="px-2 py-0.5 rounded-full border text-xs">{data.status}</span>
            </div>
          </dl>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <div className="text-lg font-semibold mb-2">QR Code</div>
          <QRCodeViewer prescriptionId={data.id} />
        </div>
      </div>
    </div>
  );
}
