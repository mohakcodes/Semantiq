'use client';

import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useEffect } from 'react';
import { tsParticles } from '@tsparticles/engine';

export function AmbientBackground() {
  useEffect(() => {
    loadSlim(tsParticles);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Particles
        id="tsparticles"
        className="h-full w-full"
        options={{
          fullScreen: { enable: false },
          background: { color: { value: 'transparent' } },

          fpsLimit: 40,

          particles: {
            number: {
              value: 85,
              density: {
                enable: true,
                width: 800,
                height: 800,
              },
            },

            color: { value: '#ffffff' },

            opacity: {
              value: { min: 0.35, max: 0.7 },
              animation: {
                enable: true,
                speed: 0.4,
              },
            },

            size: {
              value: { min: 1.5, max: 2.5 },
            },

            move: {
              enable: true,
              speed: 0.25,
              outModes: { default: 'out' },
            },

            links: {
              enable: true,
              distance: 120,
              color: '#ffffff',
              opacity: 0.15,
              width: 1,
            },

            // ❌ REMOVE SHADOWS (huge perf gain)
            shadow: {
              enable: false,
            },
          },

          interactivity: {
            events: {
              // 🔑 grab is MUCH cheaper than repulse
              onHover: {
                enable: true,
                mode: 'grab',
              },
              resize: { enable: true },
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.35,
                },
              },
            },
          },
        }}
      />
    </div>
  );
}