import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Horizontal shelf of cards. Scroll-snaps, drags with a mouse, swipes with a finger,
 * and exposes previous/next buttons for keyboard and trackpad users.
 */
export default function Rail({ children, label, controls }: { children: ReactNode; label: string; controls?: (api: { prev: () => void; next: () => void; atStart: boolean; atEnd: boolean }) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [dragging, setDragging] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 8);
  };

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-rail-item]');
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <>
      {controls?.({ prev: () => step(-1), next: () => step(1), atStart, atEnd })}
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={update}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || !ref.current) return;
          drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          if (!drag.current || !ref.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 4) {
            drag.current.moved = true;
            if (!dragging) setDragging(true);
          }
          ref.current.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => {
          drag.current = null;
          setTimeout(() => setDragging(false), 0);
        }}
        onPointerLeave={() => {
          drag.current = null;
          setDragging(false);
        }}
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          if (dragging) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`no-scrollbar flex gap-6 overflow-x-auto overscroll-x-contain px-[var(--gutter)] pb-2 ${dragging ? 'cursor-grabbing select-none' : 'snap-x snap-mandatory cursor-grab'}`}
        style={{ scrollPaddingInline: 'var(--gutter)' }}
      >
        {children}
        <div className="w-px shrink-0" aria-hidden />
      </div>
    </>
  );
}

export function RailButtons({ prev, next, atStart, atEnd }: { prev: () => void; next: () => void; atStart: boolean; atEnd: boolean }) {
  return (
    <div className="hidden md:flex gap-2">
      <button className="btn-icon" onClick={prev} disabled={atStart} aria-label="Scroll back">
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <button className="btn-icon" onClick={next} disabled={atEnd} aria-label="Scroll forward">
        <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
