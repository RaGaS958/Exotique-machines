import { ArrowUpRight } from 'lucide-react';
import Hero from './home/Hero';
import { CARS, BODIES } from '../data/cars';
import { SHOWROOM } from '../data/site';
import { Link } from '../lib/router';
import CarCard from '../components/CarCard';
import Rail, { RailButtons } from '../components/Rail';
import FlowingMenu from '../components/FlowingMenu';
import ZoomReveal from '../components/ZoomReveal';
import Img from '../components/Img';
import { useTitle } from '../lib/useTitle';

const BODY_PHOTO: Record<string, string> = {
  Supercar: 'photo-1657217674164-9cbf85acfc6d',
  'Grand tourer': 'photo-1720070227808-9a8f79279af8',
  'Sports car': 'photo-1711963307913-af439816c855',
  SUV: 'photo-1549632891-a0bea6d0355b',
  Saloon: 'photo-1739545884216-634937b0e664',
};

const ATELIER_CLUSTER = [
  'photo-1760413452186-962c960667fe',
  'photo-1713371398485-7bde1bde9def',
  'photo-1611633235555-45e252fe48c8',
  'photo-1594500067118-456bba17ba14',
  'photo-1711418235334-8895331a6cf9',
  'photo-1714557769791-7b3010a4789d',
  'photo-1624775106346-874426ec3831',
];

const OWNERSHIP = [
  { to: '/finance', title: 'Finance', text: 'Estimate the monthly payment on any car in the showroom, then apply in a couple of minutes.', action: 'Open the calculator' },
  { to: '/trade-in', title: 'Trade-in', text: 'Tell us about the car you have now and get an indicative value straight away.', action: 'Value my car' },
  { to: '/service', title: 'Service', text: 'Scheduled maintenance, paint protection and wheel work, with collection from your door.', action: 'Book a service' },
];

const plural = (b: string) => (b === 'SUV' ? 'SUVs' : b + 's');

export default function HomeView({ ready }: { ready: boolean }) {
  useTitle('Exotic and luxury cars in Lucknow');

  return (
    <>
      <Hero ready={ready} />

      {/* Showroom rail */}
      <section className="pt-28 md:pt-40" aria-labelledby="showroom-h">
        <Rail
          label="Cars in the showroom"
          controls={(api) => (
            <div className="wrap mb-10 grid gap-6 md:mb-14 md:grid-cols-12 md:items-end">
              <h2 id="showroom-h" className="t-h2 md:col-span-5">
                In the showroom
              </h2>
              <p className="t-lead text-ash md:col-span-5 max-w-[42ch]">
                {CARS.length} cars on the floor in Gomti Nagar. Each one has been through our 120-point inspection before you see it.
              </p>
              <div className="md:col-span-2 md:justify-self-end">
                <RailButtons {...api} />
              </div>
            </div>
          )}
        >
          {CARS.map((car) => (
            <div key={car.id} data-rail-item className="w-[78vw] max-w-[440px] shrink-0 snap-start sm:w-[46vw] lg:w-[31vw]">
              <CarCard car={car} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw" />
            </div>
          ))}
          <Link
            to="/collection"
            data-rail-item
            className="group flex w-[78vw] max-w-[440px] shrink-0 snap-start flex-col justify-between rounded-[3px] border border-line p-8 transition-colors duration-500 hover:border-line-strong sm:w-[46vw] lg:w-[31vw] aspect-[4/3]"
          >
            <span className="t-label">The full collection</span>
            <span className="flex items-end justify-between gap-6">
              <span className="t-h2">See all {CARS.length} cars</span>
              <ArrowUpRight className="h-7 w-7 shrink-0 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.2} />
            </span>
          </Link>
        </Rail>
      </section>

      {/* By body style — adapted from Luxura's lifestyle menu */}
      <section className="pt-32 md:pt-48" aria-labelledby="body-h">
        <div className="wrap mb-10 md:mb-14 grid gap-6 md:grid-cols-12 md:items-end">
          <h2 id="body-h" className="t-h2 md:col-span-6">
            Browse by body style
          </h2>
        </div>
        <FlowingMenu
          items={BODIES.map((b) => {
            const n = CARS.filter((c) => c.body === b).length;
            return { text: plural(b), href: `#/collection?body=${encodeURIComponent(b)}`, meta: `${n} ${n === 1 ? 'car' : 'cars'}`, image: BODY_PHOTO[b] };
          })}
        />
      </section>

      {/* Atelier — scroll zoom */}
      <div className="mt-32 md:mt-48">
        <ZoomReveal photos={ATELIER_CLUSTER}>
          <div className="wrap">
            <div className="max-w-2xl">
              <p className="t-label !text-bone/75">Exotique Atelier</p>
              <h2 className="t-h1 mt-4 text-balance">Wheels forged for the cars we sell</h2>
              <p className="t-lead mt-6 max-w-[40ch] text-bone/85">Cut from a single billet, finished by hand and fitted in our own workshop by the people who made them.</p>
              <Link to="/atelier" className="btn btn-primary mt-9">
                Visit the Atelier
              </Link>
            </div>
          </div>
        </ZoomReveal>
      </div>

      {/* Ownership */}
      <section className="wrap pt-32 md:pt-48" aria-labelledby="own-h">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end">
          <h2 id="own-h" className="t-h2 md:col-span-6">
            After you buy
          </h2>
          <p className="t-lead text-ash md:col-span-5 md:col-start-8 max-w-[42ch]">Finance, part-exchange and servicing are handled here, by the same people who sold you the car.</p>
        </div>
        <ul className="border-b border-line">
          {OWNERSHIP.map((o) => (
            <li key={o.to} className="border-t border-line">
              <Link to={o.to} className="group grid gap-3 py-8 md:grid-cols-12 md:items-center md:gap-8 md:py-10">
                <span className="t-h2 md:col-span-4 transition-transform duration-700 ease-[var(--ease-out-soft)] md:group-hover:translate-x-3">{o.title}</span>
                <span className="t-body text-ash md:col-span-5 max-w-[46ch]">{o.text}</span>
                <span className="mt-2 flex items-center gap-2 text-[0.875rem] text-bone md:col-span-3 md:mt-0 md:justify-self-end">
                  {o.action}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Visit */}
      <section className="wrap pt-32 pb-24 md:pt-48 md:pb-32" aria-labelledby="visit-h">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-carbon lg:col-span-7 lg:aspect-auto lg:min-h-[600px]">
            <Img id="photo-1618642624018-a370cbf3cd80" sizes="(min-width: 1024px) 58vw, 100vw" alt="Cars behind the glass of a showroom at night" className="absolute inset-0 h-full w-full object-cover" position="50% 60%" />
          </div>
          <div className="flex flex-col lg:col-span-5 lg:py-4">
            <h2 id="visit-h" className="t-h2">
              Visit the showroom
            </h2>
            <p className="t-lead mt-6 text-ash max-w-[38ch]">Walk in during opening hours, or book a time and we will have the car you want to see out of the line-up and ready to drive.</p>
            <dl className="mt-10 border-t border-line text-[0.9375rem]">
              <div className="grid grid-cols-3 gap-4 border-b border-line py-4">
                <dt className="t-label">Address</dt>
                <dd className="col-span-2">
                  {SHOWROOM.address.map((l) => (
                    <span className="block" key={l}>{l}</span>
                  ))}
                </dd>
              </div>
              {SHOWROOM.hours.map((h) => (
                <div key={h.days} className="grid grid-cols-3 gap-4 border-b border-line py-4">
                  <dt className="t-label">{h.days}</dt>
                  <dd className="col-span-2 t-num">{h.time}</dd>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-4 border-b border-line py-4">
                <dt className="t-label">Phone</dt>
                <dd className="col-span-2">
                  <a href={SHOWROOM.phoneHref} className="link t-num">{SHOWROOM.phoneDisplay}</a>
                </dd>
              </div>
            </dl>
            <div className="mt-10 flex flex-wrap gap-3 lg:mt-auto lg:pt-10">
              <Link to="/viewing" className="btn btn-primary">
                Book a viewing
              </Link>
              <a href={SHOWROOM.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
                Get directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
