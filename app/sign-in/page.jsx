// app/sign-in/page.jsx (or pages/sign-in.jsx)
"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-lg">
        <SignIn />
      </div>
    </div>
  );
}


