import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';

export default function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="border-b border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={it.q} className="border-t border-line">
            <button
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
              aria-expanded={isOpen}
              aria-controls={`acc-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="text-[1.0625rem] text-bone" style={{ fontStretch: '108%' }}>
                {it.q}
              </span>
              <Plus className={`h-4 w-4 shrink-0 text-ash transition-transform duration-500 ease-[var(--ease-out-soft)] ${isOpen ? 'rotate-45' : ''}`} strokeWidth={1.5} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`acc-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="t-body pb-7 pr-10 text-ash max-w-[62ch]">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
