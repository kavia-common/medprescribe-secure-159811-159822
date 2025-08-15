"use client";

import React, { useEffect, useState } from "react";
import { connectPhantom, isPhantomInstalled } from "@/lib/solana";

export default function WalletConnectButton() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [phantom, setPhantom] = useState(false);

  useEffect(() => {
    setPhantom(isPhantomInstalled());
  }, []);

  const handleClick = async () => {
    const key = await connectPhantom();
    if (key) setWallet(key);
  };

  if (!phantom) return null;

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
    >
      {wallet ? `Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}` : "Connect Phantom"}
    </button>
  );
}
