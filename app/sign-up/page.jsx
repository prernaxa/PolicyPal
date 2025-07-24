// app/sign-up/page.jsx (or pages/sign-up.jsx)
"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-lg">
        <SignUp />
      </div>
    </div>
  );
}
