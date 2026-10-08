import { useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import { CARS, carById, carName } from '../data/cars';
import { useStore } from '../lib/store';
import { priceShort, ref } from '../lib/format';
import { scrollToEl, scrollToTop } from '../lib/smooth';
import { useTitle } from '../lib/useTitle';
import { PageIntro } from '../components/Chrome';
import { Checkbox, Confirmation, Field, PhoneInput, Segmented, validEmail, validPhone } from '../components/Form';
import Img from '../components/Img';
import { Link } from '../lib/router';

const SLOTS = ['10:30', '12:00', '14:30', '16:00', '18:00'];
const PLACES = ['At the showroom', 'At my home or office'] as const;
const STEPS = ['Car', 'Day and time', 'Your details'];
const EASE = [0.22, 1, 0.36, 1] as const;

function nextDays(n: number) {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) out.push(new Date(d));
  }
  return out;
}

export default function ViewingView({ query }: { query: URLSearchParams }) {
  useTitle('Book a viewing');
  const { addAppointment } = useStore();
  const preset = carById(query.get('car') ?? '');
  const [step, setStep] = useState(preset ? 1 : 0);
  const [carId, setCarId] = useState(preset?.id ?? '');
  const days = useMemo(() => nextDays(12), []);
  const [day, setDay] = useState<string>('');
  const [slot, setSlot] = useState('');
  const [place, setPlace] = useState<(typeof PLACES)[number]>('At the showroom');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licence, setLicence] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);

  const car = carById(carId);
  const dayDate = days.find((d) => d.toDateString() === day);
  const whenText = dayDate && slot ? `${dayDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}, ${slot}` : '';

  const go = (s: number) => {
    setErrors({});
    setStep(s);
    const bar = document.getElementById('steps');
    if (bar && bar.getBoundingClientRect().top < 0) scrollToEl(bar, -96);
  };

  const nextFromTime = () => {
    const err: Record<string, string> = {};
    if (!day || !slot) err.time = 'Choose a day and a time.';
    if (place === 'At my home or office' && address.trim().length < 8) err.address = 'Enter the address where we should bring the car.';
    setErrors(err);
    if (!Object.keys(err).length) go(2);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Enter your name.';
    if (!validPhone(phone)) err.phone = 'Enter a 10-digit Indian mobile number.';
    if (email && !validEmail(email)) err.email = 'This email address looks incomplete.';
    if (!licence) err.licence = 'A valid driving licence is needed for a test drive.';
    setErrors(err);
    if (Object.keys(err).length || !car) return;
    const id = ref('VIEW');
    addAppointment({ id, kind: 'viewing', title: carName(car), detail: place === 'At the showroom' ? 'At the Gomti Nagar showroom' : `Brought to ${address}`, when: whenText });
    setDone(id);
    scrollToTop(false);
  };

  if (done && car) {
    return (
      <div className="wrap pt-[calc(var(--header-h)+80px)] pb-32 md:pt-[calc(var(--header-h)+120px)]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Confirmation title={`Your viewing of the ${car.model} is booked.`} reference={done}>
              {whenText}, {place === 'At the showroom' ? 'at the showroom in Gomti Nagar' : 'at your address'}. We will call the day before to confirm, and the car will be ready to drive. Please bring your driving licence.
            </Confirmation>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to={`/car/${car.id}`} className="btn btn-primary">
                Back to the {car.model}
              </Link>
              <Link to="/collection" className="btn btn-ghost">
                Browse the collection
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-carbon lg:col-span-6">
            <Img id={car.photos[0]} sizes="50vw" position={car.focus} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageIntro title="Book a viewing" lead="See the car in person and drive it. At the showroom, or we bring it to your home or office anywhere in Lucknow." />

      <div className="wrap pb-32">
        {/* Steps — a genuine sequence */}
        <ol id="steps" className="flex border-y border-line" aria-label="Booking steps">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1">
              <button
                type="button"
                disabled={i > step || (i > 0 && !carId)}
                onClick={() => go(i)}
                aria-current={i === step ? 'step' : undefined}
                className={`flex w-full items-center gap-3 py-5 text-left text-[0.875rem] transition-colors ${i === step ? 'text-bone' : i < step ? 'text-ash hover:text-bone' : 'text-smoke'}`}
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border t-num text-[0.75rem] ${i < step ? 'border-brass bg-brass text-ink' : i === step ? 'border-bone' : 'border-line'}`}>
                  {i < step ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.45, ease: EASE }}>
                {step === 0 && (
                  <div>
                    <h2 className="t-h3">Which car would you like to see?</h2>
                    <div role="radiogroup" aria-label="Car" className="mt-8 grid gap-4 sm:grid-cols-2">
                      {CARS.map((c) => (
                        <button
                          key={c.id}
                          role="radio"
                          aria-checked={carId === c.id}
                          onClick={() => {
                            setCarId(c.id);
                            go(1);
                          }}
                          className={`group flex items-center gap-4 rounded-[4px] border p-3 text-left transition-colors duration-300 ${carId === c.id ? 'border-bone bg-graphite' : 'border-line hover:border-line-strong'}`}
                        >
                          <span className="relative h-[64px] w-[92px] shrink-0 overflow-hidden rounded-[2px] bg-graphite">
                            <Img id={c.photos[0]} w={300} sizes="92px" position={c.focus} alt="" className="absolute inset-0 h-full w-full object-cover" />
                          </span>
                          <span className="min-w-0">
                            <span className="block t-label">{c.marque}</span>
                            <span className="block truncate text-[0.9375rem]">{c.model}</span>
                            <span className="block t-num t-label">{priceShort(c.price)}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-10">
                    <div>
                      <h2 className="t-h3">Choose a day</h2>
                      <div role="radiogroup" aria-label="Day" className="no-scrollbar -mx-[var(--gutter)] mt-6 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0">
                        {days.map((d) => {
                          const key = d.toDateString();
                          const on = key === day;
                          return (
                            <button
                              key={key}
                              role="radio"
                              aria-checked={on}
                              onClick={() => setDay(key)}
                              className={`flex w-[68px] shrink-0 flex-col items-center rounded-[4px] border py-3 lg:w-auto transition-colors duration-300 ${on ? 'border-bone bg-bone text-ink' : 'border-line hover:border-line-strong'}`}
                            >
                              <span className={`text-[0.75rem] ${on ? 'text-ink/70' : 'text-ash'}`}>{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                              <span className="t-num mt-1 text-[1.35rem] font-[350]">{d.getDate()}</span>
                              <span className={`text-[0.75rem] ${on ? 'text-ink/70' : 'text-ash'}`}>{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h2 className="t-h3">And a time</h2>
                      <div className="mt-6">
                        <Segmented options={SLOTS} value={slot} onChange={setSlot} label="Time" />
                      </div>
                      {errors.time && <p className="mt-3 text-[0.8125rem] text-alert">{errors.time}</p>}
                    </div>
                    <div>
                      <h2 className="t-h3">Where</h2>
                      <div className="mt-6">
                        <Segmented options={PLACES} value={place} onChange={setPlace} label="Where" />
                      </div>
                      <AnimatePresence initial={false}>
                        {place === 'At my home or office' && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden">
                            <Field label="Address" htmlFor="vw-address" error={errors.address} className="pt-6" hint="Within 40 km of Lucknow">
                              <input id="vw-address" className="field" value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" />
                            </Field>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex gap-3 border-t border-line pt-8">
                      <button className="btn btn-ghost" onClick={() => go(0)}>
                        Back
                      </button>
                      <button className="btn btn-primary" onClick={nextFromTime}>
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <form onSubmit={submit} noValidate className="space-y-6">
                    <h2 className="t-h3">Your details</h2>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Your name" htmlFor="vw-name" error={errors.name}>
                        <input id="vw-name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                      </Field>
                      <Field label="Mobile number" htmlFor="vw-phone" error={errors.phone}>
                        <PhoneInput id="vw-phone" value={phone} onChange={setPhone} invalid={!!errors.phone} />
                      </Field>
                    </div>
                    <Field label="Email (optional)" htmlFor="vw-email" error={errors.email}>
                      <input id="vw-email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                    </Field>
                    <div>
                      <Checkbox id="vw-licence" checked={licence} onChange={setLicence}>
                        I hold a valid Indian or international driving licence and will bring it
                      </Checkbox>
                      {errors.licence && <p className="mt-2 text-[0.8125rem] text-alert">{errors.licence}</p>}
                    </div>
                    <div className="flex gap-3 border-t border-line pt-8">
                      <button type="button" className="btn btn-ghost" onClick={() => go(1)}>
                        Back
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Confirm the viewing
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Running summary */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)] overflow-hidden rounded-[6px] border border-line bg-carbon">
              {car ? (
                <>
                  <div className="relative aspect-[16/10] bg-graphite">
                    <AnimatePresence initial={false}>
                      <motion.div key={car.id} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                        <Img id={car.photos[0]} sizes="(min-width: 1024px) 30vw, 100vw" position={car.focus} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="p-6">
                    <p className="t-label">{car.marque}</p>
                    <p className="t-h3 mt-1">{car.model}</p>
                    <dl className="mt-6 space-y-3 border-t border-line pt-5 text-[0.875rem]">
                      <div className="flex justify-between gap-4">
                        <dt className="t-label">When</dt>
                        <dd className="text-right">{whenText || <span className="text-smoke">Not chosen yet</span>}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="t-label">Where</dt>
                        <dd className="text-right">{place === 'At the showroom' ? 'Gomti Nagar showroom' : address || 'Your address'}</dd>
                      </div>
                    </dl>
                  </div>
                </>
              ) : (
                <p className="p-6 t-body text-ash">Choose a car to begin. You can change it at any point.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
