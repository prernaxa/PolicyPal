"use client";

import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const router = useRouter();

  return (
    <div className="flex justify-end gap-4 p-4">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <button
          onClick={() => router.push('/sign-in')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push('/sign-up')}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </SignedOut>
    </div>
  );
}
