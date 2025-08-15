"use client";

import React from "react";
import { AuthProvider } from "./auth/AuthProvider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
