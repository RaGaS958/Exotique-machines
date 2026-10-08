import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { CARS, carById } from '../data/cars';
import { Link } from '../lib/router';
import { useStore } from '../lib/store';
import { indicativeEmi, km, priceFull, priceShort } from '../lib/format';
import { img, srcSet } from '../lib/img';
import { useTitle } from '../lib/useTitle';
import CarCard from '../components/CarCard';
import NotFound from './NotFound';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CarView({ id }: { id?: string }) {
  const car = carById(id);
  useTitle(car ? `${car.marque} ${car.model}${car.variant ? ' ' + car.variant : ''}` : 'Car not found');
  const { isSaved, toggleSaved, openEnquiry } = useStore();
  const [shot, setShot] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => setShot(0), [id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (!car || (t instanceof Element && t.closest('input,select,textarea,[role=dialog]')) || document.querySelector('[role=dialog]')) return;
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!car) return <NotFound />;
  const n = car.photos.length;
  const move = (d: number) => {
    setDir(d);
    setShot((s) => (s + d + n) % n);
  };
  const saved = isSaved(car.id);
  const monthly = indicativeEmi(car.price);

  const related = CARS.filter((c) => c.id !== car.id)
    .sort((a, b) => Number(b.body === car.body) - Number(a.body === car.body) || Math.abs(a.price - car.price) - Math.abs(b.price - car.price))
    .slice(0, 3);

  const specs: [string, string][] = [
    ['Engine', car.engine],
    ['Power', `${car.powerPs} PS`],
    ['Torque', `${car.torqueNm} Nm`],
    ['0 to 100 km/h', `${car.zeroToHundred.toFixed(1)} s`],
    ['Top speed', `${car.topSpeed} km/h`],
    ['Gearbox', car.transmission],
    ['Drive', car.drive === 'AWD' ? 'All-wheel drive' : 'Rear-wheel drive'],
    ['Seats', car.seats],
    ...(car.range ? ([['Range', car.range]] as [string, string][]) : []),
  ];

  const details: [string, string][] = [
    ['Condition', car.status === 'New' ? 'New' : 'Pre-owned, inspected'],
    ['Year', car.status === 'New' ? `${car.year} model year` : String(car.year)],
    ...(car.odometerKm ? ([['Odometer', km(car.odometerKm)]] as [string, string][]) : []),
    ...(car.owners ? ([['Previous owners', String(car.owners)]] as [string, string][]) : []),
    ...(car.registration ? ([['Registered in', car.registration]] as [string, string][]) : []),
    ['Exterior', car.exterior],
    ['Interior', car.interior],
  ];

  return (
    <article>
      <div className="wrap pt-[calc(var(--header-h)+28px)] md:pt-[calc(var(--header-h)+40px)]">
        <Link to="/collection" className="inline-flex items-center gap-1.5 t-label hover:text-bone transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> The collection
        </Link>

        <header className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="t-label">{car.marque}</p>
            <h1 className="t-h1 mt-3 text-balance">
              {car.model}
              {car.variant && <span className="block text-ash text-[0.5em] mt-2 tracking-[-0.02em]">{car.variant}</span>}
            </h1>
          </div>
          <div className="md:col-span-4 md:text-right">
            <p className="t-num text-[clamp(1.6rem,2.4vw,2.2rem)] font-[300] tracking-[-0.02em]" style={{ fontStretch: '115%' }}>
              {priceShort(car.price)}
            </p>
            <p className="t-label mt-1">{car.status === 'New' ? 'Ex-showroom, Lucknow' : 'Asking price'}</p>
          </div>
        </header>

        {/* Gallery */}
        <div className="mt-10 md:mt-14">
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-carbon sm:aspect-[16/9]"
            onTouchStart={(e) => ((e.currentTarget as any)._x = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - ((e.currentTarget as any)._x ?? 0);
              if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1);
            }}
          >
            <AnimatePresence initial={false} custom={dir}>
              <motion.img
                key={shot}
                custom={dir}
                src={img(car.photos[shot], 2000)}
                srcSet={srcSet(car.photos[shot], [800, 1200, 1600, 2200])}
                sizes="(min-width: 1480px) 1400px, 100vw"
                alt={`${car.marque} ${car.model}, photo ${shot + 1} of ${n}`}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: shot === 0 ? car.focus : undefined }}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 40, scale: 1.02 }),
                  center: { opacity: 1, x: 0, scale: 1 },
                  exit: (d: number) => ({ opacity: 0, x: d * -40 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.8, ease: EASE }}
                draggable={false}
              />
            </AnimatePresence>
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <span className="t-num mr-2 rounded-full bg-ink/50 px-3 py-1.5 text-[0.8125rem] backdrop-blur-md">
                {shot + 1} / {n}
              </span>
              <button className="btn-icon h-10 w-10 bg-ink/50 backdrop-blur-md" onClick={() => move(-1)} aria-label="Previous photo">
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button className="btn-icon h-10 w-10 bg-ink/50 backdrop-blur-md" onClick={() => move(1)} aria-label="Next photo">
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {car.photos.map((p, i) => (
              <button
                key={p}
                onClick={() => {
                  setDir(i > shot ? 1 : -1);
                  setShot(i);
                }}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === shot}
                className={`relative aspect-[16/10] overflow-hidden rounded-[2px] bg-carbon transition-opacity duration-500 ${i === shot ? 'opacity-100' : 'opacity-45 hover:opacity-80'}`}
              >
                <img src={img(p, 400, 70)} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
                {i === shot && <motion.span layoutId="thumb-mark" className="absolute inset-x-0 bottom-0 h-0.5 bg-bone" transition={{ duration: 0.5, ease: EASE }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="mt-16 grid gap-14 pb-24 md:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="t-lead text-bone/90 max-w-[46ch] text-pretty">{car.note}</p>

            <h2 className="t-h3 mt-16">Performance</h2>
            <dl className="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
              {specs.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                  <dt className="t-label">{k}</dt>
                  <dd className="t-num text-right text-[0.9375rem]">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="t-h3 mt-16">This car</h2>
            <dl className="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
              {details.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                  <dt className="t-label">{k}</dt>
                  <dd className="text-right text-[0.9375rem]">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="t-h3 mt-16">Equipment</h2>
            <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
              {car.equipment.map((e) => (
                <li key={e} className="border-b border-line py-3.5 text-[0.9375rem] text-bone/90">
                  {e}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)] rounded-[6px] border border-line bg-carbon p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <p className="t-label">{car.status === 'New' ? 'Ex-showroom price' : 'Asking price'}</p>
                <p className="t-num text-[1.25rem]">{priceFull(car.price)}</p>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <p className="t-label">Finance from</p>
                <Link to={`/finance?car=${car.id}`} className="t-num link text-[0.9375rem] text-bone">
                  {priceFull(Math.round(monthly / 100) * 100)} a month
                </Link>
              </div>
              <p className="mt-2 t-label text-smoke">20% down, 60 months at 9.25%. Indicative only.</p>

              <div className="mt-8 grid gap-3">
                <Link to={`/viewing?car=${car.id}`} className="btn btn-primary w-full">
                  Book a viewing
                </Link>
                <button className="btn btn-ghost w-full" onClick={() => openEnquiry({ carId: car.id })}>
                  Ask about this car
                </button>
                <button className="btn w-full !h-11 text-ash hover:text-bone" onClick={() => toggleSaved(car.id)} aria-pressed={saved}>
                  <Heart className={`h-4 w-4 ${saved ? 'fill-brass text-brass' : ''}`} strokeWidth={1.5} />
                  {saved ? 'Saved' : 'Save this car'}
                </button>
              </div>

              <div className="mt-6 border-t border-line pt-6 t-label">
                Have a car to part-exchange?{' '}
                <Link to="/trade-in" className="link text-bone">
                  Get a value
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <section className="border-t border-line py-24 md:py-32" aria-labelledby="related-h">
        <div className="wrap">
          <h2 id="related-h" className="t-h2 mb-12">
            Also in the showroom
          </h2>
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
