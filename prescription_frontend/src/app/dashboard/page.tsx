"use client";

import React from "react";
import { Protected } from "@/components/auth/Protected";
import { useAuth } from "@/components/auth/AuthProvider";
import { PrescriptionList } from "@/components/prescriptions/PrescriptionList";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <Protected roles={["doctor", "pharmacist", "admin"]}>
      <Content />
    </Protected>
  );
}

function Content() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="text-gray-600 text-sm">Welcome back, {user?.username}</div>
        </div>
        {user?.role === "doctor" && (
          <Link
            href="/prescriptions/new"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            New Prescription
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PrescriptionList title="Your Prescriptions" />
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <div className="text-lg font-semibold mb-2">Quick Actions</div>
          <ul className="text-sm list-disc list-inside space-y-1">
            <li>
              <Link href="/verify" className="text-blue-600 hover:underline">
                Verify prescription by code
              </Link>
            </li>
            {user?.role === "doctor" && (
              <li>
                <Link href="/prescriptions/new" className="text-blue-600 hover:underline">
                  Create a new prescription
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
