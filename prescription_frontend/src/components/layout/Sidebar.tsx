"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useAuth } from "../auth/AuthProvider";

const NavItem = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-md ${
        active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
};

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 border-r bg-white h-screen sticky top-0 p-4 hidden md:block">
      <div className="text-xl font-semibold text-blue-700 mb-4">MedPrescribe</div>
      <nav className="space-y-2">
        <NavItem href="/dashboard" label="Dashboard" />
        {user?.role === "doctor" && (
          <>
            <NavItem href="/prescriptions/new" label="New Prescription" />
          </>
        )}
        <NavItem href="/verify" label="Verify Prescription" />
      </nav>
      <div className="mt-8 text-xs text-gray-400">
        Logged in as: <span className="font-medium text-gray-600">{user?.username}</span>
      </div>
    </aside>
  );
}
