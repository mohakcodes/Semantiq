'use client';

import { motion, type Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
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
        className="max-w-[46rem] text-center"
      >
        {/* Context cue */}
        <motion.div
          variants={itemVariants}
          className="
            mb-5
            text-[11px]
            font-medium
            tracking-[0.26em]
            uppercase
            text-zinc-400
          "
        >
          Semantic Intelligence
        </motion.div>

        {/* Brand */}
        <motion.h1
          variants={itemVariants}
          className="
            text-[56px] md:text-[76px]
            font-semibold
            tracking-[-0.025em]
            leading-[1.02]
            text-transparent bg-clip-text
            bg-gradient-to-b from-zinc-50 via-zinc-300 to-zinc-500
            drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]
          "
        >
          Semantiq
        </motion.h1>

        {/* Value proposition */}
        <motion.p
          variants={itemVariants}
          className="
            mt-7
            mx-auto
            max-w-[42ch]
            text-[17.5px] md:text-[18.5px]
            leading-[1.65]
            text-zinc-300
          "
        >
          Turn unstructured text into clear concepts,
          meaningful relationships, and structured understanding.
        </motion.p>

        {/* Capability hint */}
        <motion.p
          variants={itemVariants}
          className="
            mt-4
            mx-auto
            max-w-[40ch]
            text-[14.5px]
            leading-relaxed
            text-zinc-400
          "
        >
          Designed for deep thinking, analysis, and sense-making.
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants} className="mt-12">
          <Button
            size="lg"
            className="
              px-11 py-5
              text-[14px]
              font-semibold
              tracking-wide
              rounded-xl
              transition-all
              hover:scale-[1.04]
              hover:shadow-[0_14px_40px_rgba(0,0,0,0.45)]
            "
            onClick={() => router.push('/analyze')}
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}