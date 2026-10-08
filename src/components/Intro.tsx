import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Mark } from './Brand';
import { BRAND } from '../data/site';
import { preload } from '../lib/img';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * First visit only: the horse draws across, the line fills as the hero photo loads,
 * then the curtain lifts straight into the hero. Skipped for reduced motion and repeat visits.
 */
export default function Intro({ heroSrc, onReveal }: { heroSrc: string; onReveal: () => void }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0.08);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();
    const minTime = 1300;
    const maxTime = 3200;
    const tick = window.setInterval(() => setProgress((p) => Math.min(0.9, p + (0.9 - p) * 0.12)), 90);
    const done = () => {
      if (cancelled) return;
      window.clearInterval(tick);
      setProgress(1);
      window.setTimeout(() => {
        if (cancelled) return;
        setVisible(false);
        onReveal();
      }, 380);
    };
    const fallback = window.setTimeout(done, maxTime);
    preload(heroSrc).then(() => {
      const wait = Math.max(0, minTime - (performance.now() - start));
      window.setTimeout(() => {
        window.clearTimeout(fallback);
        done();
      }, wait);
    });
    return () => {
      cancelled = true;
      window.clearInterval(tick);
      window.clearTimeout(fallback);
    };
  }, [heroSrc]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-ink"
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <div className="flex w-[min(64vw,320px)] flex-col items-center">
            <Mark play className="w-full h-auto" />
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
              className="mt-8 text-center uppercase text-ash"
              style={{ fontStretch: '125%', letterSpacing: '0.32em', fontSize: 11, fontWeight: 500 }}
            >
              {BRAND}
            </motion.p>
            <div className="mt-8 h-px w-full bg-line overflow-hidden">
              <div className="h-full bg-bone origin-left transition-transform duration-500 ease-[var(--ease-out-soft)]" style={{ transform: `scaleX(${progress})` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
