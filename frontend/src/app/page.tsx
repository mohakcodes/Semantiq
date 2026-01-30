'use client';

import { motion, type Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-xl text-center"
      >
        {/* Quiet context cue */}
        <motion.div
          variants={itemVariants}
          className="mb-3 text-xs tracking-widest uppercase text-zinc-400"
        >
          Semantic intelligence
        </motion.div>

        {/* Brand */}
        <motion.h1
          variants={itemVariants}
          className="
            text-[46px] md:text-[66px]
            font-bold tracking-tight
            text-transparent bg-clip-text
            bg-gradient-to-b from-zinc-50 to-zinc-400
            drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]
          "
        >
          Semantiq
        </motion.h1>

        {/* Value proposition */}
        <motion.p
          variants={itemVariants}
          className="
            mt-4
            text-[16px] md:text-[17px]
            text-zinc-300
            leading-relaxed
          "
        >
          Turn unstructured text into clear concepts,
          meaningful relationships, and structured understanding.
        </motion.p>

        {/* Capability hint */}
        <motion.p
          variants={itemVariants}
          className="mt-3 text-sm text-zinc-400"
        >
          Designed for deep thinking, analysis, and sense-making.
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants} className="mt-8">
          <Button
            size="lg"
            className="
              px-8 py-5
              text-sm
              font-medium
              transition-transform
              hover:scale-[1.03]
            "
            onClick={() => router.push('/analyze')}
          >
            Analyze text
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}