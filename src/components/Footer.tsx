import { Link } from '../lib/router';
import { SHOWROOM } from '../data/site';
import { BODIES } from '../data/cars';
import { Mark } from './Brand';
import { BRAND } from '../data/site';

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink pb-24 lg:pb-0">
      <div className="wrap pt-20 md:pt-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4">
              <Mark className="h-20 w-auto" title={BRAND} />
              <span className="uppercase text-bone" style={{ fontStretch: '125%', letterSpacing: '0.22em', fontSize: 12, fontWeight: 520 }}>
                {BRAND}
              </span>
            </div>
            <p className="t-lead mt-8 max-w-[26ch] text-bone">Every car here can be seen, sat in and driven before you decide.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/viewing" className="btn btn-primary">
                Book a viewing
              </Link>
              <a href={SHOWROOM.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-ghost">
                Message us on WhatsApp
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7 md:pl-8">
            <div>
              <h2 className="t-label mb-5">Collection</h2>
              <ul className="space-y-3 text-[0.9375rem]">
                {BODIES.map((b) => (
                  <li key={b}>
                    <Link to={`/collection?body=${encodeURIComponent(b)}`} className="link text-bone/90 hover:text-bone">
                      {b === 'SUV' ? 'SUVs' : b + 's'}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/atelier" className="link text-bone/90 hover:text-bone">
                    Forged wheels
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="t-label mb-5">Ownership</h2>
              <ul className="space-y-3 text-[0.9375rem]">
                <li><Link to="/finance" className="link text-bone/90 hover:text-bone">Finance</Link></li>
                <li><Link to="/trade-in" className="link text-bone/90 hover:text-bone">Trade-in</Link></li>
                <li><Link to="/service" className="link text-bone/90 hover:text-bone">Service</Link></li>
                <li><Link to="/viewing" className="link text-bone/90 hover:text-bone">Test drives</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="t-label mb-5">Showroom</h2>
              <address className="not-italic text-[0.9375rem] leading-relaxed text-bone/90">
                {SHOWROOM.address.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </address>
              <div className="mt-4 space-y-1 text-[0.9375rem]">
                <a href={SHOWROOM.phoneHref} className="link block w-fit text-bone/90 t-num">{SHOWROOM.phoneDisplay}</a>
                <a href={`mailto:${SHOWROOM.email}`} className="link block w-fit whitespace-nowrap text-[0.8125rem] text-bone/90">{SHOWROOM.email}</a>
              </div>
              <ul className="mt-4 t-label space-y-1">
                {SHOWROOM.hours.map((h) => (
                  <li key={h.days}>
                    {h.days}, {h.time.toLowerCase()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line py-8 t-label md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {BRAND}, Lucknow</p>
          <p className="max-w-xl md:text-right">
            Prices are indicative. New cars are quoted ex-showroom; pre-owned cars at the asking price. Taxes, registration and insurance are extra.
          </p>
        </div>
      </div>
    </footer>
  );
}
