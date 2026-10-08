import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarDays, MessageCircle, Phone } from 'lucide-react';
import { Link } from '../lib/router';
import { useStore } from '../lib/store';
import { SHOWROOM } from '../data/site';

/** Thumb-reach actions on phones: call, WhatsApp, book. */
export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[50] border-t border-line bg-ink/85 backdrop-blur-xl pb-safe lg:hidden">
      <div className="grid grid-cols-3 text-[0.75rem]">
        <a href={SHOWROOM.phoneHref} className="flex flex-col items-center gap-1.5 py-3 text-ash active:text-bone">
          <Phone className="h-[18px] w-[18px] text-bone" strokeWidth={1.4} />
          Call
        </a>
        <a href={SHOWROOM.whatsappHref} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 py-3 text-ash active:text-bone border-x border-line">
          <MessageCircle className="h-[18px] w-[18px] text-bone" strokeWidth={1.4} />
          WhatsApp
        </a>
        <Link to="/viewing" className="flex flex-col items-center gap-1.5 py-3 text-ash active:text-bone">
          <CalendarDays className="h-[18px] w-[18px] text-bone" strokeWidth={1.4} />
          Book a viewing
        </Link>
      </div>
    </div>
  );
}

export function Toast() {
  const { toast } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex justify-center px-4 lg:bottom-8" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-full border border-line-strong bg-graphite/95 px-5 py-3 text-[0.875rem] text-bone backdrop-blur-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Page opening used across inner pages. */
export function PageIntro({ title, lead, children, kicker }: { title: string; lead?: string; children?: ReactNode; kicker?: ReactNode }) {
  return (
    <header className="wrap pt-[calc(var(--header-h)+56px)] md:pt-[calc(var(--header-h)+96px)] pb-12 md:pb-16">
      {kicker && <div className="mb-6 t-label">{kicker}</div>}
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <h1 className="t-h1 md:col-span-7 text-balance">{title}</h1>
        {lead && <p className="t-lead text-ash md:col-span-5 md:pb-2 max-w-[44ch] text-pretty">{lead}</p>}
      </div>
      {children}
    </header>
  );
}
