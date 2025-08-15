"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { hasRole, useAuth } from "./AuthProvider";
import type { Role } from "@/lib/types";

export function Protected({
  roles,
  children,
}: {
  roles?: Role[];
  children: React.ReactNode;
}) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!token) {
      // default to doctor login if role is not specified
      const target =
        roles && roles.includes("pharmacist") && !roles.includes("doctor")
          ? "/login/pharmacist"
          : "/login/doctor";
      router.replace(`${target}?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (roles && !hasRole(user, roles)) {
      // redirect to dashboard if role mismatch
      router.replace("/dashboard");
    }
  }, [token, loading, user, router, pathname, roles]);

  if (loading || !token) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (roles && !hasRole(user, roles)) {
    return null;
  }

  return <>{children}</>;
}
