"use client";

import React, { useEffect, useState } from "react";
import { getPrescriptionQrPayload } from "@/lib/api";
import QRCode from "qrcode";
import Image from "next/image";

export function QRCodeViewer({ prescriptionId }: { prescriptionId: number }) {
  const [payload, setPayload] = useState<string>("");
  const [dataUrl, setDataUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        const res = await getPrescriptionQrPayload(prescriptionId); // { payload: string }
        setPayload(res.payload);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg || "Failed to load QR payload");
      }
    };
    load();
  }, [prescriptionId]);

  useEffect(() => {
    const makeQR = async () => {
      if (!payload) return;
      try {
        const url = await QRCode.toDataURL(payload, {
          margin: 1,
          width: 180,
          errorCorrectionLevel: "M",
        });
        setDataUrl(url);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg || "Failed to render QR code");
      }
    };
    void makeQR();
  }, [payload]);

  if (error) {
    return <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>;
  }

  if (!payload || !dataUrl) {
    return <div className="text-gray-500">Loading QR...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Image src={dataUrl} alt="Prescription QR" width={180} height={180} />
      <div className="text-xs text-gray-500 break-all max-w-sm text-center">{payload}</div>
    </div>
  );
}
