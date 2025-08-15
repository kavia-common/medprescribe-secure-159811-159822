"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { connectPhantom, isPhantomInstalled } from "@/lib/solana";
import Link from "next/link";

export function Topbar() {
  const { user, logout } = useAuth();
  const [wallet, setWallet] = useState<string | null>(null);
  const [phantom, setPhantom] = useState(false);

  useEffect(() => {
    setPhantom(isPhantomInstalled());
  }, []);

  const handleConnect = async () => {
    const key = await connectPhantom();
    if (key) setWallet(key);
  };

  const short = (addr: string) => addr.slice(0, 4) + "..." + addr.slice(-4);

  return (
    <header className="sticky top-0 z-10 border-b bg-white">
      <div className="h-14 px-4 flex items-center justify-between">
        <div className="md:hidden">
          <Link href="/dashboard" className="text-blue-700 font-semibold">
            MedPrescribe
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {phantom && (
            <button
              onClick={handleConnect}
              className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
            >
              {wallet ? `Wallet: ${short(wallet)}` : "Connect Phantom"}
            </button>
          )}
          <div className="text-sm text-gray-600 hidden sm:block">
            {user?.username} ({user?.role})
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-md bg-red-50 text-red-700 text-sm hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
