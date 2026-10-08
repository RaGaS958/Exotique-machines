import { Heart } from 'lucide-react';
import type { Car } from '../types';
import { Link } from '../lib/router';
import { useStore } from '../lib/store';
import { km, priceShort } from '../lib/format';
import Img from './Img';

export function carLine(c: Car) {
  if (c.status === 'New') return `New, ${c.year} model year`;
  return `${c.year}, ${km(c.odometerKm ?? 0)}${c.owners ? `, ${c.owners === 1 ? 'one owner' : `${c.owners} owners`}` : ''}`;
}

export default function CarCard({ car, sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw', ratio = 'aspect-[4/3]', className = '' }: { car: Car; sizes?: string; ratio?: string; className?: string }) {
  const { isSaved, toggleSaved } = useStore();
  const saved = isSaved(car.id);
  return (
    <article className={`group relative ${className}`}>
      <Link to={`/car/${car.id}`} className="block" aria-label={`${car.marque} ${car.model}${car.variant ? ' ' + car.variant : ''}, ${priceShort(car.price)}`}>
        <div className={`relative ${ratio} overflow-hidden rounded-[3px] bg-carbon`}>
          <Img
            id={car.photos[0]}
            sizes={sizes}
            w={1200}
            position={car.focus}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.035]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="t-label">{car.marque}</p>
            <h3 className="t-h3 mt-1 text-balance">
              {car.model}
              {car.variant && <span className="text-ash"> {car.variant}</span>}
            </h3>
            <p className="t-label mt-2">{carLine(car)}</p>
          </div>
          <p className="t-num shrink-0 pt-[1.35rem] text-[1rem] text-bone">{priceShort(car.price)}</p>
        </div>
      </Link>
      <button
        onClick={() => toggleSaved(car.id)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${car.model} from saved` : `Save ${car.model}`}
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-ink/45 backdrop-blur-md transition-colors hover:bg-ink/70"
      >
        <Heart className={`h-4 w-4 transition-colors ${saved ? 'fill-brass text-brass' : 'text-bone'}`} strokeWidth={1.5} />
      </button>
    </article>
  );
}
