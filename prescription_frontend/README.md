# MedPrescribe Secure – Frontend (Next.js)

Overview

This is the Next.js frontend for MedPrescribe Secure. It provides role-based UI for doctors and pharmacists to log in, create prescriptions, view details with QR codes, and verify prescriptions by code. It communicates with the FastAPI backend via a base URL configured in environment variables.

Prerequisites

- Node.js (LTS recommended)
- A running FastAPI backend
- The backend should point to the SQLite database created by the database container if you want to use seeded users

Environment variables

- NEXT_PUBLIC_BACKEND_URL (required): Base URL of the backend API
  - Examples:
    - NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
    - NEXT_PUBLIC_BACKEND_URL="https://vscode-internal-22919-beta.beta01.cloud.kavia.ai:3001"

Create a .env.local file at the project root with:

NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"

Install and run

1) Install dependencies
   - npm install

2) Run in development
   - npm run dev
   - Visit http://localhost:3000

3) Build and run in production
   - npm run build
   - npm start

Seeded accounts (from the database initializer)

- Doctor
  - username: drdev
  - email: doctor@example.com
  - password: doctor123

- Pharmacist
  - username: pharmdev
  - email: pharmacist@example.com
  - password: pharmacist123

Routes and basic UI walkthrough

- /login/doctor
  - Enter doctor credentials to access the dashboard.
  - Auth is handled in components/auth/AuthProvider.tsx (JWT stored in local storage).

- /login/pharmacist
  - Enter pharmacist credentials to access verification and assigned prescriptions.

- /dashboard (protected)
  - Displays recent or relevant prescriptions for the current user.
  - Doctors see a “New Prescription” button linking to /prescriptions/new.

- /prescriptions/new (protected, doctor/admin)
  - Form to create a prescription.
  - “Generate” will request a unique code from the backend (GET /prescriptions/code).
  - Submission calls POST /prescriptions; the app redirects to the detail page on success.

- /prescriptions/[id] (protected)
  - Details for a prescription, including a QR tab showing a QR code generated from the backend payload (GET /prescriptions/{id}/qr).

- /verify
  - Enter a code to verify a prescription.
  - Unauthenticated users call GET /verify/code/{code}.
  - Logged-in pharmacists call POST /verify/code/{code} (automatically chosen by the UI), which additionally records a verified attempt under the pharmacist account.

Phantom wallet (optional)

- The top bar shows a “Connect Phantom” button if Phantom is installed (see components/layout/Topbar.tsx).
- Wallet connection is currently used for demonstration and future Solana-based flows; actual Solana auth endpoints are stubbed in the backend.

API notes for the frontend

- The frontend uses process.env.NEXT_PUBLIC_BACKEND_URL to call the backend (see src/lib/api.ts).
- If this variable is missing, the app will show “Missing NEXT_PUBLIC_BACKEND_URL environment variable for API calls.”
- Auth flow:
  - POST /auth/login → store access_token
  - GET /auth/me → load user profile into context
  - Authorization: Bearer token is included automatically for protected calls

Troubleshooting

- 401 / login issues
  - Ensure the backend’s SQLITE_DB points to the initialized database file with seeded users.
  - Verify NEXT_PUBLIC_BACKEND_URL matches the backend URL and that CORS allows your frontend origin.

- CORS
  - The backend allows localhost:3000 by default. If you use a different origin, update CORS_ORIGINS/CORS_ORIGIN_REGEX in the backend.

- QR rendering
  - The QR code is generated client-side using the payload from GET /prescriptions/{id}/qr and the qrcode package.

Project scripts

- npm run dev → start development server
- npm run build → build for production
- npm start → start production server
