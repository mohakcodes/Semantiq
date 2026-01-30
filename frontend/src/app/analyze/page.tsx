'use client';

import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AnalyzePage() {
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
          <span>Home Page</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="space-y-8"
      >
        {/* Header */}
        <header className="space-y-2 mt-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            Analyze text
          </h2>
          <p className="text-md font-semibold text-zinc-400 max-w-3xl">
            Paste raw thoughts, notes, or documents.
            Semantiq will extract concepts and reveal structure.
          </p>
        </header>

        {/* Input frame */}
        <section className="relative">
          <div className="absolute inset-0 rounded-xl ring-1 ring-zinc-800/60 pointer-events-none" />

          <Textarea
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

              scrollbar-thin
              scrollbar-thumb-zinc-700/60
              scrollbar-track-transparent
            "
          />

          <div className="mt-2 text-xs text-zinc-500">
            Tip: longer, messier input produces better structure.
          </div>
        </section>

        {/* Action row */}
        <div className="flex items-center justify-between pt-2">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              size="lg"
              className="px-9 py-5 text-sm font-medium"
            >
              Analyze
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}