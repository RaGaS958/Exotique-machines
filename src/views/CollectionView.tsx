import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CARS, BODIES } from '../data/cars';
import type { Body } from '../types';
import CarCard from '../components/CarCard';
import { PageIntro } from '../components/Chrome';
import { replaceQuery } from '../lib/router';
import { useTitle } from '../lib/useTitle';

const SORTS = {
  featured: 'Featured',
  'price-desc': 'Price, highest first',
  'price-asc': 'Price, lowest first',
  power: 'Most powerful',
  year: 'Newest',
} as const;
type Sort = keyof typeof SORTS;

const MARQUES = Array.from(new Set(CARS.map((c) => c.marque))).sort();

export default function CollectionView({ query }: { query: URLSearchParams }) {
  useTitle('The collection');
  const qBody = query.get('body') as Body | null;
  const qMarque = query.get('marque');
  const [body, setBody] = useState<Body | 'All'>(qBody && BODIES.includes(qBody) ? qBody : 'All');
  const [marque, setMarque] = useState(qMarque && MARQUES.includes(qMarque) ? qMarque : 'All');
  const [power, setPower] = useState<'Any' | 'Petrol' | 'Electric'>('Any');
  const [status, setStatus] = useState<'Any' | 'New' | 'Pre-owned'>('Any');
  const [sort, setSort] = useState<Sort>('featured');

  // Follow links like #/collection?body=SUV while already on this page.
  useEffect(() => {
    if (qBody && BODIES.includes(qBody)) setBody(qBody);
    if (qMarque && MARQUES.includes(qMarque)) setMarque(qMarque);
  }, [qBody, qMarque]);

  useEffect(() => {
    replaceQuery({ body: body === 'All' ? undefined : body, marque: marque === 'All' ? undefined : marque });
  }, [body, marque]);

  const list = useMemo(() => {
    const out = CARS.filter(
      (c) =>
        (body === 'All' || c.body === body) &&
        (marque === 'All' || c.marque === marque) &&
        (power === 'Any' || c.powertrain === power) &&
        (status === 'Any' || c.status === status),
    );
    const by: Record<Sort, (a: (typeof CARS)[number], b: (typeof CARS)[number]) => number> = {
      featured: () => 0,
      'price-desc': (a, b) => b.price - a.price,
      'price-asc': (a, b) => a.price - b.price,
      power: (a, b) => b.powerPs - a.powerPs,
      year: (a, b) => b.year - a.year,
    };
    return [...out].sort(by[sort]);
  }, [body, marque, power, status, sort]);

  const filtered = body !== 'All' || marque !== 'All' || power !== 'Any' || status !== 'Any';
  const clear = () => {
    setBody('All');
    setMarque('All');
    setPower('Any');
    setStatus('Any');
  };

  return (
    <>
      <PageIntro title="The collection" lead="New and pre-owned, all in Lucknow and all available to drive. Every price is shown in full." />

      <div className="wrap">
        <div className="border-y border-line py-5">
          <div className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)]" role="group" aria-label="Body style">
            {(['All', ...BODIES] as const).map((b) => (
              <button key={b} className="chip shrink-0" aria-pressed={body === b} onClick={() => setBody(b)}>
                {b === 'All' ? 'All cars' : b === 'SUV' ? 'SUVs' : b + 's'}
              </button>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Select label="Marque" value={marque} onChange={setMarque} options={[['All', 'All marques'], ...MARQUES.map((m) => [m, m] as [string, string])]} />
            <Select label="Powertrain" value={power} onChange={(v) => setPower(v as typeof power)} options={[['Any', 'Any powertrain'], ['Petrol', 'Petrol'], ['Electric', 'Electric']]} />
            <Select label="Condition" value={status} onChange={(v) => setStatus(v as typeof status)} options={[['Any', 'Any condition'], ['New', 'New'], ['Pre-owned', 'Pre-owned']]} />
            <Select label="Sort" value={sort} onChange={(v) => setSort(v as Sort)} options={Object.entries(SORTS) as [string, string][]} />
          </div>
        </div>

        <div className="flex items-center justify-between py-6 t-label" aria-live="polite">
          <p>
            Showing <span className="t-num text-bone">{list.length}</span> of {CARS.length} cars
          </p>
          {filtered && (
            <button onClick={clear} className="link hover:text-bone">
              Clear filters
            </button>
          )}
        </div>

        <motion.div layout className="grid gap-x-6 gap-y-14 pb-32 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((car) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </AnimatePresence>
          {list.length === 0 && (
            <div className="col-span-full py-16">
              <p className="t-h3">No cars match all of those filters.</p>
              <p className="t-body mt-3 text-ash max-w-[48ch]">Try removing one, or tell us what you are looking for. We source cars to order and can usually find one within a few weeks.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={clear} className="btn btn-primary">
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  const id = 'f-' + label.toLowerCase();
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select id={id} className="field !h-11 !text-[0.875rem]" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
