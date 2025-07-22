'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  FileText,
  FileInput,
  Link,
  Loader2,
  XCircle,
  Lock,
  AlertTriangle,
  ShieldCheck,
  FolderOpen,
  Send,
} from 'lucide-react';

export default function PolicyPalPage() {
  const [inputType, setInputType] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (
      (inputType === 'text' && !text.trim()) ||
      (inputType === 'url' && !url.trim()) ||
      (inputType === 'pdf' && !pdfFile)
    ) {
      toast.error('Please provide valid input.');
      return;
    }

    setLoading(true);
    setResult(null);
    toast.loading('Analyzing policy...');

    try {
      let res;
      if (inputType === 'text') {
        res = await fetch('/api/policypal/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
      } else if (inputType === 'url') {
        res = await fetch('/api/policypal/analyze-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
      } else if (inputType === 'pdf') {
        const formData = new FormData();
        formData.append('file', pdfFile);
        res = await fetch('/api/policypal/analyze-pdf', {
          method: 'POST',
          body: formData,
        });
      }

      const json = await res.json();

      if (res.ok && json.success) {
        setResult(json.data);
        toast.dismiss();
        toast.success('Policy analyzed successfully!');
      } else {
        toast.dismiss();
        toast.error(json.error || 'Unexpected error occurred.');
        setResult({ error: json.error });
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Something went wrong.');
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputOptions = [
    { type: 'text', label: 'Text', icon: FileText },
    { type: 'pdf', label: 'PDF', icon: FileInput },
    { type: 'url', label: 'URL', icon: Link },
  ];

  const renderSummary = (summary) => {
    const sections = summary
      .split(/\n(?=📄|🔒|🚨|🔐|🗂️)/g)
      .filter((block) => block.trim() !== '');

    const sectionIcons = {
      '📄 Summary': FileText,
      '🔒 Summary of the Policy': Lock,
      '🚨 Risks': AlertTriangle,
      '🔐 Trust Score': ShieldCheck,
      '🗂️ Categories': FolderOpen,
    };

    const sectionColors = {
      '📄 Summary': 'bg-blue-500',
      '🔒 Summary of the Policy': 'bg-yellow-500',
      '🚨 Risks': 'bg-red-500',
      '🔐 Trust Score': 'bg-green-500',
      '🗂️ Categories': 'bg-purple-500',
    };

    return (
      <div className="space-y-6">
        {sections.map((block, index) => {
          const [headerLine, ...contentLines] = block.trim().split('\n');

          // FIXED LINE:
          const iconKey = Object.keys(sectionIcons).find((key) =>
            headerLine.startsWith(key)
          );

          const Icon = sectionIcons[iconKey] || FileText;
          const bgColor = sectionColors[iconKey] || 'bg-gray-500';
          const title = headerLine.replace(/^📄|🔒|🚨|🔐|🗂️/, '').trim();

          return (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${bgColor} bg-opacity-90`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white text-left">
                  {title}
                </h2>
              </div>
              <div className="text-gray-300 pl-1 space-y-2 text-sm leading-relaxed text-left">
                {contentLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-6 py-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <h1 className="text-4xl font-bold mb-6 text-left">
          PolicyPal AI — Understand Privacy Policies Instantly
        </h1>

        <div className="flex flex-wrap gap-4 mb-6">
          {inputOptions.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setInputType(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all
                ${inputType === type ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="mb-6">
          {inputType === 'text' && (
            <textarea
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white"
              rows="10"
              placeholder="Paste policy text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}

          {inputType === 'url' && (
            <input
              type="text"
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white"
              placeholder="https://example.com/privacy-policy"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          )}

          {inputType === 'pdf' && (
            <label
              htmlFor="pdf-upload"
              className="flex flex-col items-center justify-center gap-3 w-full p-6 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 transition-all text-gray-400"
            >
              <FileInput className="w-6 h-6 text-blue-400" />
              <span className="text-sm">
                {pdfFile ? pdfFile.name : 'Click to upload a PDF file'}
              </span>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              />
            </label>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all
            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="flex items-center gap-2"
            >
              <span>Analyze</span>
              <Send className="w-4 h-4" />
            </motion.div>
          )}
        </button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10 bg-gray-900 border border-gray-700 p-6 rounded-xl text-white"
          >
            {result.error ? (
              <div className="flex items-center gap-2 text-red-400 font-medium">
                <XCircle className="w-5 h-5" />
                <span>Error: {result.error}</span>
              </div>
            ) : (
              renderSummary(result.summary)
            )}
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
