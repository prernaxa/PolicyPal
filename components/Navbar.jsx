'use client';

import { ShieldCheck, LogOut } from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';

export default function PolicyPalPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-white">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center bg-[#0f172a] shadow-md">
        {/* Logo (Lucide) */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-white" />
          <h1 className="text-xl font-bold text-white">PolicyPal</h1>
        </div>

        {/* Sign Out */}
        <SignOutButton>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition text-white font-medium">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </SignOutButton>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4">
        {/* Your existing content */}
      </main>
    </div>
  );
}
