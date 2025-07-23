"use client";

import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function AuthButtons() {
  return (
    <div className="flex justify-end gap-4 p-4">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Sign Up</button>
        </SignUpButton>
      </SignedOut>
    </div>
  );
}
