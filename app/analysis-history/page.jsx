'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  CalendarClock,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Layers,
} from 'lucide-react';

export default function DashboardPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/analysis-history');
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    fetchHistory();
  }, []);

  const parseTrustScore = (score) => {
    if (typeof score === 'number') return score;
    if (typeof score === 'string') {
      const match = score.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    return 0;
  };

  const getTrustBadge = (score) => {
    if (score >= 7) return 'bg-green-600/20 text-green-300';
    if (score >= 4) return 'bg-yellow-600/20 text-yellow-300';
    return 'bg-red-600/20 text-red-300';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-6 py-10 font-sans text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📊 Analysis History</h1>

        {history.length === 0 ? (
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-10 text-center text-gray-400 shadow-sm">
            <FolderOpen className="w-10 h-10 mx-auto mb-4 text-gray-500" />
            <p className="text-lg">No past analysis yet</p>
            <p className="text-sm text-gray-500 mt-1">Start by uploading a document or URL to analyze.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {history.map((item) => {
              const trustScoreNum = parseTrustScore(item.trustScore);

              return (
                <motion.li
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-2 text-sm text-gray-400">
                      <CalendarClock className="w-4 h-4" />
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-semibold flex items-center gap-2 ${getTrustBadge(
                        trustScoreNum
                      )}`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {trustScoreNum}/10
                    </span>
                  </div>

                  {item.input && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-300 mb-1 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Your Input
                      </h3>
                      <div className="bg-[#0f172a] text-sm text-gray-300 p-3 rounded-md max-h-40 overflow-auto whitespace-pre-wrap">
                        {item.input}
                      </div>
                    </div>
                  )}

                  {item.summary && (
  <div className="mb-4 mt-4">
    <h3 className="font-semibold text-gray-300 mb-1 flex items-center gap-2">
      <FileText className="w-4 h-4" />
      Summary
    </h3>
    <div className="text-md text-gray-200 leading-relaxed space-y-1">
      {item.summary
        .split(' - ')
        .filter((s) => s.trim() !== '')
        .map((point, idx) => (
          <p key={idx}>{point.trim().startsWith('-') ? point.trim() : `- ${point.trim()}`}</p>
        ))}
    </div>
  </div>
)}


                  {item.risks && item.risks.length > 0 && (
                    <div className="mb-6 mt-6">
                      <h3 className="font-semibold text-gray-300 mb-1 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        Risks
                      </h3>
                      <ul className="list-disc list-inside text-sm text-red-300">
                        {item.risks
                          .filter((risk) => risk && risk.trim() !== '')
                          .map((risk, i) => (
                            <li key={i}>{risk}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {item.categories && (
                    <div>
                      <h3 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-300" />
                        Detected Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(item.categories)
                          .filter(([_, value]) => value)
                          .map(([key]) => (
                            <span
                              key={key}
                              className="bg-blue-700/30 text-blue-200 px-3 py-1 rounded-full text-xs font-medium capitalize"
                            >
                              {key.replace(/_/g, ' ')}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
