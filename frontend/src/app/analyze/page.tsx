'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { analyzeText } from '@/lib/api';
import type { AnalyzeResponse } from '@/types/analyze';

import { MOCK_ANALYZE_RESPONSE } from '@/mocks/analyze.mock';
import { SemanticGraph } from '@/components/semantic_graph/SemanticGraph';

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'visualizing'>('idle');

  const handleAnalyze = async () => {
    if (loading) return;

    if (text.trim().length < 20) {
      setError('Please enter at least 20 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    setPhase('thinking');

    try {
      if (0) {
        await new Promise((r) => setTimeout(r, 1200));
        setResult(MOCK_ANALYZE_RESPONSE);
        await new Promise((r) => setTimeout(r, 300));
        setPhase('visualizing');
      } 
      else {
        const res = await analyzeText({ text });
        setResult(res);
        setPhase('visualizing');
        console.log('ANALYSIS RESULT:', res);
      }
    } 
    catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } 
      else {
        setError('Analysis failed.');
        setPhase('idle');
      }
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen px-6 py-16 max-w-4xl mx-auto">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="
            inline-flex items-center gap-2
            rounded-md
            px-3 py-1.5
            text-sm font-medium
            text-zinc-400
            border border-zinc-800
            bg-zinc-900/40
            backdrop-blur
            hover:text-zinc-200
            hover:border-zinc-700
            hover:bg-zinc-900/70
            transition-colors
          "
        >
          <span className="text-base leading-none">←</span>
          <span>Home</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6"
      >
        <header className="space-y-1 mt-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Analyze text
          </h2>
          <p className="text-sm font-semibold text-zinc-400 max-w-3xl">
            Paste raw thoughts, notes, or documents.
            Semantiq will extract concepts and reveal structure.
          </p>
        </header>

        <section className="relative">
          <div className="absolute inset-0 rounded-xl ring-1 ring-zinc-800/60 pointer-events-none" />

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            placeholder="Start writing or paste text here…"
            className="
              relative z-10
              min-h-[260px]
              max-h-[320px]
              overflow-y-auto
              resize-none
              text-[15px]
              leading-relaxed
              bg-zinc-900/60
              backdrop-blur
              border-none
              focus:ring-0
              placeholder:text-zinc-500
              disabled:opacity-60

              scrollbar-thin
              scrollbar-thumb-zinc-700/60
              scrollbar-track-transparent
            "
          />

          <div className="mx-1 mt-1 text-xs text-zinc-500">
            Tip: longer, messier input produces better structure.
          </div>
        </section>

        {error && (
          <div className="text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <motion.div
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
          >
            <Button
              size="lg"
              className="px-9 py-3 text-sm font-medium"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? 'Analyzing…' : 'Analyze'}
            </Button>
          </motion.div>
        </div>

        {phase === 'visualizing' && result && (
          <SemanticGraph data={result} />
        )}
      </motion.div>
    </main>
  );
}