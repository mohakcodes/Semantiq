'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHRASES = [
  'Extracting key concepts',
  'Encoding semantic meaning',
  'Measuring conceptual distance',
  'Identifying hidden relationships',
  'Structuring knowledge graph',
  'Preparing visualization',
];

export function ThinkingLoader() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setIndex((i) => (i + 1) % PHRASES.length);
    }, 1200);
    return () => clearInterval(phraseTimer);
  }, []);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        return p + Math.random() * 4;
      });
    }, 600);
    return () => clearInterval(progressTimer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative mt-6 rounded-2xl border border-zinc-800/80
                 bg-gradient-to-b from-zinc-950/80 via-zinc-950/70 to-black/80
                 px-6 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden"
    >
      {/* subtle glow */}
      <div
        className="pointer-events-none absolute inset-0 
                   bg-[radial-gradient(circle_at_50%_30%,
                   rgba(255,255,255,0.06),transparent_65%)]"
      />

      {/* node animation */}
      <div className="mb-4 flex items-center justify-center gap-4">
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                className="h-2.5 w-2.5 rounded-full bg-zinc-200"
                animate={{
                    scale: [1, 1.9, 1],
                    opacity: [0.35, 1, 0.35],
                    boxShadow: [
                    '0 0 0px rgba(255,255,255,0)',
                    '0 0 12px rgba(255,255,255,0.9)',
                    '0 0 0px rgba(255,255,255,0)',
                    ],
                }}
                transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: 'easeInOut',
                }}
            />
        ))}
      </div>

      {/* rotating phrase */}
      <div className="relative h-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 text-sm font-medium tracking-wide text-zinc-200"
          >
            {PHRASES[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* fake progress bar */}
      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-zinc-400 via-zinc-200 to-white"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-1.5 text-center text-xs text-zinc-500">
          Building semantic understanding
        </div>
      </div>
    </motion.div>
  );
}