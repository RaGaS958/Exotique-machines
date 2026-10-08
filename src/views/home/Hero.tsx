import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES, carById } from '../../data/cars';
import type { Car } from '../../types';
import { Link } from '../../lib/router';
import { heroSrc, preload } from '../../lib/img';
import { prefersReducedMotion } from '../../lib/smooth';
import RollingNumber from '../../components/RollingNumber';

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 7000;

const slides = HERO_SLIDES.map((s) => ({ ...s, car: carById(s.id) as Car }));

export const heroFirstSrc = () => heroSrc(slides[0].car.photos[0]);

export default function Hero({ ready }: { ready: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const section = useRef<HTMLElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const reduced = prefersReducedMotion();

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 900], [0, 180]);
  const contentOpacity = useTransform(scrollY, [0, 520], [1, 0]);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), []);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Preload the remaining slides once the first is up.
  useEffect(() => {
    if (!ready) return;
    slides.slice(1).forEach((s) => preload(heroSrc(s.car.photos[0])));
  }, [ready]);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    const onVis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const running = ready && !paused && inView && !reduced;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(next, DURATION);
    return () => window.clearTimeout(t);
  }, [running, next, index]);

  const { car, line } = slides[index];

  return (
    <section
      ref={section}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label="Cars in the showroom"
      onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prev)();
        touch.current = null;
      }}
    >
      {/* Photographs */}
      <motion.div className="absolute inset-x-0 top-0 h-[60%] overflow-hidden sm:inset-0 sm:h-auto" style={{ y: reduced ? 0 : bgY }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <motion.img
              src={heroSrc(car.photos[0])}
              alt={`${car.marque} ${car.model} in ${car.exterior}`}
              className="h-full w-full object-cover"
              style={{ objectPosition: car.focus }}
              initial={{ scale: reduced ? 1 : 1.1 }}
              animate={{ scale: ready && !reduced ? 1 : 1.1 }}
              transition={{ duration: DURATION / 1000 + 1.6, ease: [0.25, 0.1, 0.25, 1] }}
              draggable={false}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          </motion.div>
        </AnimatePresence>
        {/* Light falls off towards the type */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-60 bg-[linear-gradient(to_bottom,var(--color-ink)_0%,rgb(10_10_11/0.82)_28%,rgb(10_10_11/0.4)_62%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] sm:h-[72%] bg-gradient-to-t from-ink via-ink/55 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-ink/45 to-transparent" />
      </motion.div>

      {/* Copy and instruments */}
      <motion.div style={{ opacity: reduced ? 1 : contentOpacity }} className="relative z-10 flex h-full flex-col justify-end pb-24 sm:pb-12 lg:pb-14">
        <div className="wrap grid gap-8 sm:gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={'m' + index}
                  className="t-label !text-bone/75"
                  initial={{ y: '110%' }}
                  animate={{ y: ready ? '0%' : '110%' }}
                  exit={{ y: '-110%' }}
                  transition={{ duration: 0.7, ease: EASE, delay: ready ? 0.05 : 0 }}
                >
                  {car.marque}
                  {car.status === 'New' ? ', new' : `, ${car.year}`}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-3 overflow-hidden pb-[0.08em]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.h1
                  key={'t' + index}
                  className={`t-display ${car.model.length > 9 ? '!text-[clamp(2.6rem,6.4vw,6.25rem)]' : ''}`}
                  initial={{ y: '105%' }}
                  animate={{ y: ready ? '0%' : '105%' }}
                  exit={{ y: '-105%', transition: { duration: 0.45, ease: [0.55, 0, 0.75, 0] } }}
                  transition={{ duration: 1, ease: EASE, delay: ready ? 0.1 : 0 }}
                >
                  {car.model}
                </motion.h1>
              </AnimatePresence>
            </div>
            <div className="mt-5 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={'l' + index}
                  className="t-lead max-w-[38ch] text-bone/80"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 14 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.8, ease: EASE, delay: ready ? 0.25 : 0 }}
                >
                  {line}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.dl
              className="mt-9 flex max-w-xl divide-x divide-[var(--line-strong)] border-y border-line-strong"
              initial={{ opacity: 0 }}
              animate={{ opacity: ready ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.35 }}
            >
              <Instrument label="Power" value={ready ? String(car.powerPs) : '000'} unit="PS" />
              <Instrument label="0 to 100 km/h" value={ready ? car.zeroToHundred.toFixed(1) : '0.0'} unit="s" />
              <Instrument label="Top speed" value={ready ? String(car.topSpeed) : '000'} unit="km/h" />
            </motion.dl>

            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            >
              <Link to={`/car/${car.id}`} className="btn btn-primary">
                View this car
              </Link>
              <Link to={`/viewing?car=${car.id}`} className="btn btn-ghost">
                Book a viewing
              </Link>
            </motion.div>
          </div>

          {/* Slide selector: what's next, and how long until it arrives */}
          <motion.div
            className="lg:col-span-4 lg:justify-self-end w-full lg:max-w-[360px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <p className="t-num t-label">
                <span className="text-bone">{String(index + 1).padStart(2, '0')}</span> of {String(slides.length).padStart(2, '0')}
              </p>
              <div className="flex gap-2">
                <button className="btn-icon h-10 w-10 bg-ink/30 backdrop-blur" onClick={prev} aria-label="Previous car">
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button className="btn-icon h-10 w-10 bg-ink/30 backdrop-blur" onClick={next} aria-label="Next car">
                  <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 lg:grid-cols-1 lg:gap-0">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => go(i)}
                  aria-label={`Show ${s.car.marque} ${s.car.model}`}
                  aria-current={i === index}
                  className="group text-left lg:py-3"
                >
                  <span className="relative block h-px w-full overflow-hidden bg-[var(--line-strong)]">
                    {i === index && (
                      <span
                        key={index + String(running)}
                        className="absolute inset-y-0 left-0 w-full origin-left bg-bone"
                        style={{
                          animation: running ? `hero-progress ${DURATION}ms linear forwards` : undefined,
                          transform: running ? undefined : 'scaleX(1)',
                        }}
                      />
                    )}
                  </span>
                  <span className={`mt-3 hidden lg:flex justify-between text-[0.8125rem] transition-colors duration-500 ${i === index ? 'text-bone' : 'text-ash group-hover:text-bone'}`}>
                    <span>
                      {s.car.marque} {s.car.model}
                    </span>
                    <span className="t-num">{s.car.powerPs} PS</span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
      <style>{`@keyframes hero-progress { from { transform: scaleX(0) } to { transform: scaleX(1) } }`}</style>
    </section>
  );
}

function Instrument({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex-1 px-4 py-4 first:pl-0 sm:px-6">
      <dt className="t-label">{label}</dt>
      <dd className="mt-2 flex items-baseline gap-1.5">
        <RollingNumber value={value} className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-[300] tracking-[-0.02em]" />
        <span className="text-[0.8125rem] text-ash">{unit}</span>
      </dd>
    </div>
  );
}
