'use client';

import { useRouter } from 'next/navigation';
import { Lightbulb, FileText, ShieldCheck, ArrowRight, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleInsightsClick = () => {
    if (isSignedIn) {
      router.push('/analysis-history');
    } else {
      document.getElementById('trigger-signin')?.click();
    }
  };

  const handleStartAnalyzingClick = () => {
    if (isSignedIn) {
      router.push('/analyze-policy');
    } else {
      document.getElementById('trigger-signin')?.click();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
      <header className="flex justify-between items-center w-full max-w-7xl mx-auto mb-14 sm:mb-16 px-2 sm:px-0">
  <div className="flex items-center gap-3">
    <div className="bg-blue-600 p-2 rounded-full shadow-md">
      <ShieldCheck className="text-white w-6 h-6" />
    </div>
    <h1 className="text-2xl font-bold tracking-tight">PolicyPal</h1>
  </div>

  <div className="flex items-center gap-2">
    <button
      onClick={handleInsightsClick}
      className="flex items-center ml-2 sm:ml-0 gap-1 text-xs sm:text-sm bg-gray-800 hover:bg-gray-700 px-3  py-2 rounded-md shadow transition h-9"
    >
      <List size={16} />
      Privacy Insights
    </button>

    <SignInButton mode="modal">
      <button id="trigger-signin" className="hidden" aria-hidden="true" />
    </SignInButton>

    <SignedOut>
      <SignInButton mode="modal">
        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-0.5 text-xs sm:text-sm font-medium rounded-md transition h-9">
          Get Started
        </button>
      </SignInButton>
    </SignedOut>

    <SignedIn>
      <button
        onClick={() => router.push('/analyze-policy')}
        className="bg-blue-600 hover:bg-blue-700 px-3 py-0.5 text-xs sm:text-sm font-medium rounded-md transition h-9"
      >
        Go to Dashboard
      </button>
    </SignedIn>
  </div>
</header>


      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
        >
          Understand <span className="text-blue-400">Privacy Policies</span> in Seconds
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10"
        >
          AI-powered summaries that decode the legal jargon — so you know exactly what you're agreeing to.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12 px-2"
        >
          <FeatureCard
            icon={<Lightbulb size={28} />}
            title="AI-Powered Analysis"
            desc="Breaks down policies using advanced AI to show what's important."
          />
          <FeatureCard
            icon={<ShieldCheck size={28} />}
            title="Stay Informed"
            desc="Quick summaries that highlight potential risks and data usage."
          />
          <FeatureCard
            icon={<FileText size={28} />}
            title="Multiple Formats"
            desc="Paste text, upload PDF, or analyze via URL — all supported."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg"
            onClick={handleStartAnalyzingClick}
          >
            Start Analyzing
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight size={20} />
            </motion.span>
          </motion.button>

          <p className="text-sm text-gray-400 mt-1">No credit card required • Instant results</p>
        </motion.div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 text-left">
      <div className="mb-4 text-blue-400" aria-hidden="true">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
