import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { WHEELS, ATELIER_STEPS } from '../data/site';
import { CARS, carName } from '../data/cars';
import { useStore } from '../lib/store';
import { priceShort, ref } from '../lib/format';
import { img, srcSet } from '../lib/img';
import { useTitle } from '../lib/useTitle';
import { prefersReducedMotion, scrollToEl } from '../lib/smooth';
import Img from '../components/Img';
import { Field, PhoneInput, Segmented, Confirmation, validPhone } from '../components/Form';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AtelierView() {
  useTitle('Atelier: forged wheels');
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 160]);

  return (
    <>
      <section className="relative h-[88svh] min-h-[560px] overflow-hidden">
        <motion.img
          src={img('photo-1611633235555-45e252fe48c8', 2200)}
          srcSet={srcSet('photo-1611633235555-45e252fe48c8')}
          sizes="100vw"
          alt="Forged wheels on the workshop shelves"
          className="absolute inset-0 h-[115%] w-full object-cover"
          style={{ y: prefersReducedMotion() ? 0 : y, objectPosition: '50% 60%' }}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        <div className="wrap relative flex h-full flex-col justify-end pb-14 md:pb-20">
          <p className="t-label !text-bone/75">Exotique Atelier</p>
          <h1 className="t-h1 mt-4 max-w-[14ch] text-balance">Wheels, made one set at a time</h1>
          <p className="t-lead mt-6 max-w-[44ch] text-bone/85">Three designs, forged and machined from aerospace-grade aluminium, finished by hand and fitted in our Gomti Nagar workshop.</p>
        </div>
      </section>

      {/* The range */}
      <section className="wrap py-24 md:py-36" aria-labelledby="range-h">
        <h2 id="range-h" className="t-h2 mb-16 md:mb-24">
          The range
        </h2>
        <div className="space-y-24 md:space-y-36">
          {WHEELS.map((w, i) => (
            <div key={w.id} className="grid gap-10 md:grid-cols-12 md:items-center md:gap-16">
              <div className={`relative aspect-[4/5] overflow-hidden rounded-[3px] bg-carbon md:col-span-6 ${i % 2 ? 'md:order-2 md:col-start-7' : ''}`}>
                <Img id={w.photo} sizes="(min-width: 768px) 50vw, 100vw" alt={`${w.name} wheel`} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className={`md:col-span-5 ${i % 2 ? 'md:order-1 md:col-start-1' : 'md:col-start-8'}`}>
                <p className="t-label">{w.series}</p>
                <h3 className="mt-3 text-[clamp(2.4rem,5vw,4.5rem)] leading-none tracking-[-0.03em]" style={{ fontStretch: '125%', fontWeight: 330 }}>
                  {w.name}
                </h3>
                <p className="t-body mt-6 text-ash max-w-[44ch]">{w.description}</p>
                <dl className="mt-8 border-t border-line text-[0.9375rem]">
                  {(
                    [
                      ['Construction', w.construction],
                      ['Material', w.material],
                      ['Sizes', w.diameters.join(', ')],
                      ['Weight', w.weight],
                      ['Set of four from', priceShort(w.priceFrom)],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-6 border-b border-line py-3.5">
                      <dt className="t-label">{k}</dt>
                      <dd className="t-num text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 t-label">Finishes</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {w.finishes.map((f) => (
                    <li key={f} className="rounded-full border border-line px-3.5 py-1.5 text-[0.8125rem] text-bone/90">
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#specify" className="btn btn-ghost mt-9" onClick={(e) => {
                    e.preventDefault();
                    scrollToEl(document.getElementById('specify'));
                    window.dispatchEvent(new CustomEvent('atelier:pick', { detail: w.id }));
                  }}>
                  Specify a set of {w.name}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How they are made — a real sequence, so it is numbered */}
      <section className="border-t border-line py-24 md:py-36" aria-labelledby="process-h">
        <div className="wrap">
          <div className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end">
            <h2 id="process-h" className="t-h2 md:col-span-6">
              How a set is made
            </h2>
            <p className="t-lead text-ash md:col-span-5 md:col-start-8 max-w-[40ch]">Around six weeks from order to fitting. You are welcome to visit the workshop while yours is being made.</p>
          </div>
          <ol className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {ATELIER_STEPS.map((s, i) => (
              <li key={s.title}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-carbon">
                  <Img id={s.photo} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" alt="" className="absolute inset-0 h-full w-full object-cover grayscale-[35%]" />
                </div>
                <div className="mt-6 flex items-baseline gap-4">
                  <span className="t-num text-[0.875rem] text-brass">{i + 1}</span>
                  <h3 className="t-h3">{s.title}</h3>
                </div>
                <p className="t-body mt-3 pl-7 text-ash">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Specify />
    </>
  );
}

function Specify() {
  const { addAppointment } = useStore();
  const [wheelId, setWheelId] = useState(WHEELS[0].id);
  const wheel = WHEELS.find((w) => w.id === wheelId)!;
  const [size, setSize] = useState(wheel.diameters[1] ?? wheel.diameters[0]);
  const [finish, setFinish] = useState(wheel.finishes[0]);
  const [carId, setCarId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    setSize(wheel.diameters[1] ?? wheel.diameters[0]);
    setFinish(wheel.finishes[0]);
  }, [wheelId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const on = (e: Event) => setWheelId((e as CustomEvent<string>).detail);
    window.addEventListener('atelier:pick', on);
    return () => window.removeEventListener('atelier:pick', on);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Enter your name.';
    if (!validPhone(phone)) err.phone = 'Enter a 10-digit Indian mobile number.';
    setErrors(err);
    if (Object.keys(err).length) return;
    const id = ref('ATL');
    const car = CARS.find((c) => c.id === carId);
    addAppointment({ id, kind: 'wheels', title: `${wheel.name}, ${size}, ${finish}`, detail: car ? `For ${carName(car)}` : 'Car to be confirmed' });
    setDone(id);
  };

  return (
    <section id="specify" className="border-t border-line bg-carbon/40 py-24 md:py-36" aria-labelledby="specify-h">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 id="specify-h" className="t-h2">
            Specify a set
          </h2>
          <p className="t-lead mt-6 text-ash max-w-[38ch]">Choose a design, size and finish. We will confirm fitment for your car and send a quotation within two working days.</p>
          <div className="relative mt-10 aspect-square overflow-hidden rounded-[3px] bg-carbon">
            <AnimatePresence initial={false}>
              <motion.img
                key={wheel.photo}
                src={img(wheel.photo, 1200)}
                alt={`${wheel.name} wheel`}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
              />
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          {done ? (
            <Confirmation title="We will be in touch about your wheels." reference={done}>
              Our Atelier team will call you to confirm fitment and finish, then send a written quotation.
            </Confirmation>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-9">
              <div>
                <p className="field-label">Design</p>
                <Segmented options={WHEELS.map((w) => w.id)} value={wheelId} onChange={setWheelId} label="Design" format={(id) => WHEELS.find((w) => w.id === id)?.name ?? id} />
              </div>
              <div>
                <p className="field-label">Diameter</p>
                <Segmented options={wheel.diameters} value={size} onChange={setSize} label="Diameter" />
              </div>
              <div>
                <p className="field-label">Finish</p>
                <Segmented options={wheel.finishes} value={finish} onChange={setFinish} label="Finish" />
              </div>
              <Field label="For which car?" htmlFor="sp-car">
                <select id="sp-car" className="field" value={carId} onChange={(e) => setCarId(e.target.value)}>
                  <option value="">A car I already own</option>
                  {CARS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {carName(c)}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name" htmlFor="sp-name" error={errors.name}>
                  <input id="sp-name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </Field>
                <Field label="Mobile number" htmlFor="sp-phone" error={errors.phone}>
                  <PhoneInput id="sp-phone" value={phone} onChange={setPhone} invalid={!!errors.phone} />
                </Field>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
                <div>
                  <p className="t-label">Set of four from</p>
                  <p className="t-num mt-1 text-[1.5rem] font-[300]">{priceShort(wheel.priceFrom)}</p>
                </div>
                <button type="submit" className="btn btn-primary">
                  Request a quotation
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
