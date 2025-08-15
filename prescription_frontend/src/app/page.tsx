import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="rounded-lg border bg-white p-6">
        <h1 className="text-2xl font-semibold text-blue-700">MedPrescribe</h1>
        <p className="mt-2 text-gray-600">
          Secure prescription creation and verification using Solana.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/login/doctor"
            className="block rounded-md border p-4 hover:bg-blue-50"
          >
            <div className="text-lg font-medium">Doctor Login</div>
            <div className="text-sm text-gray-600">Create and manage prescriptions</div>
          </Link>
          <Link
            href="/login/pharmacist"
            className="block rounded-md border p-4 hover:bg-emerald-50"
          >
            <div className="text-lg font-medium">Pharmacist Login</div>
            <div className="text-sm text-gray-600">Verify and dispense prescriptions</div>
          </Link>
          <Link
            href="/verify"
            className="block rounded-md border p-4 hover:bg-yellow-50"
          >
            <div className="text-lg font-medium">Verify Code</div>
            <div className="text-sm text-gray-600">Public prescription verification</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
