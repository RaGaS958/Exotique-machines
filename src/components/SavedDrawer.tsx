import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { Drawer } from './Overlay';
import { useStore } from '../lib/store';
import { CARS } from '../data/cars';
import { Link } from '../lib/router';
import { priceShort } from '../lib/format';
import Img from './Img';
import type { SavedKind } from '../types';

const KIND: Record<SavedKind, string> = {
  viewing: 'Viewing',
  service: 'Service',
  finance: 'Finance application',
  tradein: 'Trade-in inspection',
  enquiry: 'Enquiry',
  wheels: 'Wheel consultation',
};

export default function SavedDrawer() {
  const { drawerOpen, setDrawerOpen, saved, toggleSaved, appointments, cancelAppointment } = useStore();
  const [tab, setTab] = useState<'cars' | 'appointments'>('cars');
  const cars = saved.map((id) => CARS.find((c) => c.id === id)).filter(Boolean) as typeof CARS;
  const close = () => setDrawerOpen(false);

  return (
    <Drawer open={drawerOpen} onClose={close} label="Saved cars and appointments">
      <div className="px-6 pt-7 pb-5 border-b border-line">
        <h2 className="t-h3">Saved</h2>
        <div className="mt-6 flex gap-2" role="tablist">
          {(
            [
              ['cars', `Cars (${cars.length})`],
              ['appointments', `Appointments (${appointments.length})`],
            ] as const
          ).map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} className="chip" onClick={() => setTab(k)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6" data-lenis-prevent>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3 }}>
            {tab === 'cars' ? (
              cars.length ? (
                <ul className="space-y-5">
                  {cars.map((c) => (
                    <li key={c.id} className="flex items-center gap-4">
                      <Link to={`/car/${c.id}`} onClick={close} className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="relative h-[68px] w-[96px] shrink-0 overflow-hidden rounded-[3px] bg-graphite">
                          <Img id={c.photos[0]} w={300} sizes="96px" position={c.focus} className="absolute inset-0 h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="t-label">{c.marque}</p>
                          <p className="truncate text-[0.9375rem]">{c.model}</p>
                          <p className="t-num t-label text-bone/80">{priceShort(c.price)}</p>
                        </div>
                      </Link>
                      <button className="btn-icon h-9 w-9 shrink-0" aria-label={`Remove ${c.model}`} onClick={() => toggleSaved(c.id)}>
                        <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty text="Tap the heart on any car to keep it here, then compare them side by side when you visit." action={<Link to="/collection" onClick={close} className="btn btn-primary btn-sm">Browse the collection</Link>} />
              )
            ) : appointments.length ? (
              <ul className="space-y-4">
                {appointments.map((a) => (
                  <li key={a.id} className={`rounded-[4px] border border-line p-4 ${a.status === 'cancelled' ? 'opacity-50' : ''}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="t-label">
                          {KIND[a.kind]} <span className="t-num">{a.id}</span>
                        </p>
                        <p className="mt-1 text-[0.9375rem]">{a.title}</p>
                        <p className="t-label mt-1">{a.detail}</p>
                        {a.when && <p className="mt-2 text-[0.875rem] text-bone">{a.when}</p>}
                      </div>
                      {a.status === 'active' ? (
                        <button className="t-label link shrink-0 hover:text-bone" onClick={() => cancelAppointment(a.id)}>
                          Cancel
                        </button>
                      ) : (
                        <span className="t-label shrink-0">Cancelled</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty text="Viewings, service bookings and applications you make will appear here." action={<Link to="/viewing" onClick={close} className="btn btn-primary btn-sm">Book a viewing</Link>} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="border-t border-line px-6 py-4 t-label">Saved on this device only.</p>
    </Drawer>
  );
}

function Empty({ text, action }: { text: string; action: ReactNode }) {
  return (
    <div className="py-10">
      <p className="t-body text-ash max-w-[34ch]">{text}</p>
      <div className="mt-6">{action}</div>
    </div>
  );
}
