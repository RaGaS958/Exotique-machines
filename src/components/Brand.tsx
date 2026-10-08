import { useId } from 'react';
import { motion } from 'motion/react';
import { EMBLEM_PATH } from './emblemPath';
import { BRAND } from '../data/site';

/*
 * The badge, redrawn from the original logo: the gold horse running inside a
 * full silver ring. Coordinates are those of the original 1024px artwork, so
 * the horse keeps its original size. The ring is cut away wherever the horse
 * crosses it, the way the mane and head break out of the circle in the badge.
 */
export const MARK_VIEWBOX = '205 140 760 676';
// The horse sits on the ring's centre line (its own artwork places it higher,
// above the lettering, which this badge leaves out).
const HORSE_OFFSET = 'translate(206 357)';
const RING = { cx: 570, cy: 478, r: 317.5, width: 26 };
// Full ring, drawn from the left (where the mane leaves it) clockwise over the top.
export const RING_PATH = 'M252.5 478A317.5 317.5 0 1 1 887.5 478A317.5 317.5 0 1 1 252.5 478';

const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '');

type MarkProps = {
  className?: string;
  title?: string;
  /** Draw the ring and reveal the horse instead of showing them at rest */
  play?: boolean;
};

export function Mark({ className = '', title, play = false }: MarkProps) {
  const id = sid(useId());
  const EASE = [0.22, 1, 0.36, 1] as const;
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3f0ea" />
          <stop offset="0.5" stopColor="#8e8a84" />
          <stop offset="1" stopColor="#d8d4cd" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b3843c" />
          <stop offset="0.55" stopColor="#e7c47e" />
          <stop offset="1" stopColor="#c49548" />
        </linearGradient>
        <mask id={`${id}k`} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="1200">
          <rect width="1200" height="1200" fill="#fff" />
          <path transform={HORSE_OFFSET} d={EMBLEM_PATH} fill="#000" stroke="#000" strokeWidth="22" strokeLinejoin="round" />
        </mask>
        <clipPath id={`${id}c`}>
          <motion.rect
            x="200"
            y="140"
            height="680"
            initial={{ width: play ? 0 : 770 }}
            animate={{ width: 770 }}
            transition={{ duration: 1.3, ease: EASE, delay: play ? 0.55 : 0 }}
          />
        </clipPath>
      </defs>
      <g mask={`url(#${id}k)`}>
        <motion.path
          d={RING_PATH}
          fill="none"
          stroke={`url(#${id}s)`}
          strokeWidth={RING.width}
          strokeLinecap="round"
          initial={{ pathLength: play ? 0 : 1 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
        />
      </g>
      <g clipPath={`url(#${id}c)`}>
        <path transform={HORSE_OFFSET} d={EMBLEM_PATH} fill={`url(#${id}g)`} fillRule="evenodd" />
      </g>
    </svg>
  );
}

/**
 * Mark plus name, used in the header. On phones the name stacks on two lines,
 * the way it does in the badge, so the header's buttons stay on screen.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  const [first, ...rest] = BRAND.split(' ');
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Mark className="h-[40px] w-auto shrink-0 sm:h-[46px]" />
      <span
        className="flex flex-col gap-[5px] whitespace-nowrap uppercase leading-none text-bone tracking-[0.18em] sm:flex-row sm:gap-[0.6em] sm:tracking-[0.2em]"
        style={{ fontStretch: '125%', fontWeight: 520, fontSize: 12 }}
      >
        <span>{first}</span>
        {rest.length > 0 && <span>{rest.join(' ')}</span>}
      </span>
    </span>
  );
}

/** Name for places where the mark is shown separately. */
export const Emblem = Mark;
