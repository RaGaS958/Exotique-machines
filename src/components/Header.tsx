import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Heart } from 'lucide-react';
import { Link } from '../lib/router';
import { useStore } from '../lib/store';
import { lockScroll } from '../lib/smooth';
import { BRAND, SHOWROOM } from '../data/site';
import { Wordmark } from './Brand';

const EASE = [0.22, 1, 0.36, 1] as const;

const OWNERSHIP = [
  { to: '/finance', label: 'Finance', text: 'Work out a monthly payment' },
  { to: '/trade-in', label: 'Trade-in', text: 'Get a value for your current car' },
  { to: '/service', label: 'Service', text: 'Book maintenance or detailing' },
];

export default function Header({ path }: { path: string }) {
  const { saved, appointments, setDrawerOpen } = useStore();
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ownOpen, setOwnOpen] = useState(false);
  const lastY = useRef(0);
  const closeTimer = useRef<number | undefined>(undefined);

  const savedCount = saved.length + appointments.filter((a) => a.status === 'active').length;

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setAtTop(y < 24);
        const goingDown = y > lastY.current + 4;
        const goingUp = y < lastY.current - 4;
        if (goingDown && y > 240) setHidden(true);
        else if (goingUp || y < 240) setHidden(false);
        lastY.current = y;
      });
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      window.removeEventListener('scroll', on);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOwnOpen(false);
  }, [path]);

  useEffect(() => {
    if (!menuOpen) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const isActive = (to: string) => path === to || path.startsWith(to + '/');
  const ownershipActive = OWNERSHIP.some((o) => isActive(o.to));
  const solid = !atTop || menuOpen;

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`relative py-2 text-[0.875rem] transition-colors duration-300 ${isActive(to) ? 'text-bone' : 'text-ash hover:text-bone'}`}
      aria-current={isActive(to) ? 'page' : undefined}
    >
      {label}
      {isActive(to) && <motion.span layoutId="nav-mark" className="absolute -bottom-0.5 left-0 right-0 h-px bg-brass" transition={{ duration: 0.5, ease: EASE }} />}
    </Link>
  );

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[60]"
        animate={{ y: hidden && !menuOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <div
          className={`absolute inset-0 transition-[background-color,border-color,backdrop-filter] duration-500 border-b ${
            solid ? 'bg-ink/80 backdrop-blur-xl border-line' : 'bg-transparent border-transparent'
          }`}
          aria-hidden
        />
        <div className="wrap relative flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link to="/" aria-label={`${BRAND}, home`} className="relative z-[2] -m-2 p-2">
            <Wordmark />
          </Link>

          <nav className="hidden lg:flex items-center gap-9" aria-label="Main">
            {navLink('/collection', 'Collection')}
            {navLink('/atelier', 'Atelier')}
            <div
              className="relative"
              onMouseEnter={() => {
                window.clearTimeout(closeTimer.current);
                setOwnOpen(true);
              }}
              onMouseLeave={() => {
                closeTimer.current = window.setTimeout(() => setOwnOpen(false), 140);
              }}
            >
              <button
                className={`relative flex items-center gap-1.5 py-2 text-[0.875rem] transition-colors duration-300 ${ownershipActive || ownOpen ? 'text-bone' : 'text-ash hover:text-bone'}`}
                aria-expanded={ownOpen}
                aria-haspopup="true"
                onClick={() => setOwnOpen((v) => !v)}
              >
                Ownership
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-500 ${ownOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                {ownershipActive && <motion.span layoutId="nav-mark" className="absolute -bottom-0.5 left-0 right-5 h-px bg-brass" transition={{ duration: 0.5, ease: EASE }} />}
              </button>
              <AnimatePresence>
                {ownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="absolute left-1/2 top-full mt-3 w-[300px] -translate-x-1/2 rounded-[6px] border border-line bg-carbon/95 backdrop-blur-xl p-2"
                  >
                    {OWNERSHIP.map((o) => (
                      <Link key={o.to} to={o.to} className="group block rounded-[4px] px-4 py-3 transition-colors hover:bg-graphite" onClick={() => setOwnOpen(false)}>
                        <span className="block text-[0.9375rem] text-bone">{o.label}</span>
                        <span className="block text-[0.8125rem] text-ash">{o.text}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {navLink('/visit', 'Visit')}
          </nav>

          <div className="relative z-[2] flex items-center gap-2 sm:gap-3">
            <button onClick={() => setDrawerOpen(true)} className="btn-icon relative !border-transparent hover:!border-line-strong" aria-label={`Saved${savedCount ? `, ${savedCount} items` : ''}`}>
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.4} />
              <AnimatePresence>
                {savedCount > 0 && (
                  <motion.span
                    key={savedCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    className="t-num absolute right-1 top-1 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-brass px-1 text-[10px] font-semibold text-ink"
                  >
                    {savedCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <Link to="/viewing" className="btn btn-primary btn-sm hidden sm:inline-flex">
              Book a viewing
            </Link>
            <button
              className="lg:hidden btn-icon !border-transparent"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="relative block h-3 w-5" aria-hidden>
                <span className={`absolute left-0 right-0 h-px bg-bone transition-all duration-500 ease-[var(--ease-out-soft)] ${menuOpen ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 right-0 h-px bg-bone transition-all duration-500 ease-[var(--ease-out-soft)] ${menuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[55] bg-ink lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="wrap flex h-full flex-col pt-[calc(var(--header-h)+2rem)] pb-10">
              <nav className="flex flex-col" aria-label="Mobile">
                {[
                  ['/collection', 'Collection'],
                  ['/atelier', 'Atelier'],
                  ['/finance', 'Finance'],
                  ['/trade-in', 'Trade-in'],
                  ['/service', 'Service'],
                  ['/visit', 'Visit'],
                ].map(([to, label], i) => (
                  <div key={to} className="overflow-hidden">
                    <motion.div initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.18 + i * 0.05, ease: EASE }}>
                      <Link to={to} className={`block py-2 t-h2 !text-[2.4rem] ${isActive(to) ? 'text-bone' : 'text-ash'}`}>
                        {label}
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </nav>
              <motion.div className="mt-auto space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.6 }}>
                <Link to="/viewing" className="btn btn-primary w-full">
                  Book a viewing
                </Link>
                <div className="flex justify-between t-label">
                  <a href={SHOWROOM.phoneHref} className="text-bone">
                    {SHOWROOM.phoneDisplay}
                  </a>
                  <a href={SHOWROOM.whatsappHref} target="_blank" rel="noreferrer" className="text-bone">
                    WhatsApp
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
