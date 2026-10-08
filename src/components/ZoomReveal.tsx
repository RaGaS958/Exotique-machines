import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { img } from '../lib/img';
import { prefersReducedMotion } from '../lib/smooth';

/**
 * Rebuilt from Luxura's zoom parallax. Seven photographs sit in a loose cluster;
 * as you scroll, the centre one grows until it fills the screen and the copy arrives.
 */
const LAYOUT = [
  'w-[26vw] h-[26vh]',
  '-top-[30vh] left-[5vw] w-[34vw] h-[28vh]',
  '-top-[9vh] -left-[26vw] w-[20vw] h-[44vh]',
  'left-[28vw] w-[24vw] h-[26vh]',
  'top-[28vh] left-[6vw] w-[20vw] h-[24vh]',
  'top-[28vh] -left-[22vw] w-[28vw] h-[24vh]',
  'top-[23vh] left-[26vw] w-[15vw] h-[15vh]',
];
const SCALES: [number, number][] = [
  [1, 3.85],
  [1, 5],
  [1, 6],
  [1, 5],
  [1, 6],
  [1, 8],
  [1, 9],
];

function Tile({ id, i, progress }: { id: string; i: number; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 0.72], SCALES[i]);
  const dim = useTransform(progress, [0.5, 0.78], [0, i === 0 ? 0.35 : 0]);
  return (
    <motion.div style={{ scale }} className="absolute inset-0 flex items-center justify-center will-change-transform">
      <div className={`relative overflow-hidden rounded-[2px] ${LAYOUT[i]}`}>
        <img src={img(id, i === 0 ? 2000 : 900, 75)} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" draggable={false} />
        {i === 0 && <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-ink" />}
      </div>
    </motion.div>
  );
}

export default function ZoomReveal({ photos, children }: { photos: string[]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const textOpacity = useTransform(scrollYProgress, [0.68, 0.84], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.68, 0.9], [40, 0]);

  if (prefersReducedMotion()) {
    return (
      <section className="relative h-[100svh] overflow-hidden">
        <img src={img(photos[0], 2000, 75)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-ink)_0%,rgb(10_10_11/0.85)_35%,rgb(10_10_11/0.3)_70%)] md:bg-[linear-gradient(to_right,var(--color-ink)_0%,rgb(10_10_11/0.85)_35%,rgb(10_10_11/0.2)_65%,transparent_85%)]" />
        <div className="relative flex h-full items-end pb-20">{children}</div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {photos.slice(0, 7).map((id, i) => (
          <Tile key={id} id={id} i={i} progress={scrollYProgress} />
        ))}
        <motion.div
          style={{ opacity: textOpacity }}
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--color-ink)_0%,rgb(10_10_11/0.85)_30%,rgb(10_10_11/0.35)_60%,transparent_85%)] md:bg-[linear-gradient(to_right,var(--color-ink)_0%,rgb(10_10_11/0.85)_32%,rgb(10_10_11/0.2)_62%,transparent_80%)]"
        />
        <motion.div style={{ opacity: textOpacity, y: textY }} className="absolute inset-x-0 bottom-0 pb-16 md:pb-24">
          {children}
        </motion.div>
      </div>
    </section>
  );
}
