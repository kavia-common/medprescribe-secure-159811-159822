import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export const metadata: Metadata = {
  title: "MedPrescribe",
  description: "Create and verify medical prescriptions securely with Solana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-gray-50 text-gray-900">
        <ClientProviders>
          <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar />
              <main className="p-4">{children}</main>
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
