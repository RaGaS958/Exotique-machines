import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { CARS, carById, carName } from '../data/cars';
import { FINANCE_FAQS } from '../data/site';
import { useStore } from '../lib/store';
import { emi, priceFull, priceShort, ref } from '../lib/format';
import { replaceQuery } from '../lib/router';
import { scrollToEl } from '../lib/smooth';
import { useTitle } from '../lib/useTitle';
import { PageIntro } from '../components/Chrome';
import RollingNumber from '../components/RollingNumber';
import Accordion from '../components/Accordion';
import { Checkbox, Confirmation, Field, PhoneInput, Segmented, validPhone } from '../components/Form';

const TENURES = ['3 years', '4 years', '5 years', '7 years'] as const;
const EMPLOYMENT = ['Salaried', 'Self-employed professional', 'Business owner'] as const;

export default function FinanceView({ query }: { query: URLSearchParams }) {
  useTitle('Finance');
  const initial = carById(query.get('car') ?? '');
  const [carId, setCarId] = useState(initial?.id ?? '');
  const [price, setPrice] = useState(initial?.price ?? 25_000_000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(9.25);
  const [tenure, setTenure] = useState<(typeof TENURES)[number]>('5 years');

  useEffect(() => {
    const c = carById(carId);
    if (c) setPrice(c.price);
    replaceQuery({ car: carId || undefined });
  }, [carId]);

  const months = parseInt(tenure) * 12;
  const loan = price * (1 - downPct / 100);
  const monthly = useMemo(() => emi(loan, rate, months), [loan, rate, months]);
  const total = monthly * months;
  const interest = Math.max(0, total - loan);
  const principalShare = total > 0 ? (loan / total) * 100 : 100;

  return (
    <>
      <PageIntro title="Finance" lead="Work out a monthly figure for any car in the showroom. Our finance desk compares lenders for you, and you are never obliged to finance through us." />

      <section className="wrap pb-24 md:pb-36">
        <div className="grid gap-12 border-t border-line pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-16">
          <div className="space-y-10 lg:col-span-7">
            <Field label="Car" htmlFor="fin-car">
              <select id="fin-car" className="field" value={carId} onChange={(e) => setCarId(e.target.value)}>
                <option value="">Enter a price myself</option>
                {CARS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {carName(c)}, {priceShort(c.price)}
                  </option>
                ))}
              </select>
            </Field>

            <Slider
              id="fin-price"
              label="Price of the car"
              value={price / 1e5}
              min={20}
              max={1000}
              step={5}
              display={priceShort(price)}
              onChange={(v) => {
                setPrice(v * 1e5);
                if (carId) setCarId('');
              }}
            />
            <Slider id="fin-down" label="Down payment" value={downPct} min={10} max={60} step={5} display={`${downPct}%, ${priceShort((price * downPct) / 100)}`} onChange={setDownPct} />
            <Slider id="fin-rate" label="Interest rate" value={rate} min={7} max={14} step={0.05} display={`${rate.toFixed(2)}% a year`} onChange={(v) => setRate(Math.round(v * 100) / 100)} />
            <div>
              <p className="field-label">Term</p>
              <Segmented options={TENURES} value={tenure} onChange={setTenure} label="Term" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)] rounded-[6px] border border-line bg-carbon p-6 sm:p-8">
              <p className="t-label">Monthly payment</p>
              <p className="mt-3 flex items-baseline gap-1 text-[clamp(2.4rem,4.4vw,3.6rem)] font-[300] tracking-[-0.03em]" style={{ fontStretch: '112%' }}>
                <span className="text-[0.6em] text-ash">₹</span>
                <RollingNumber value={Math.round(monthly).toLocaleString('en-IN')} />
              </p>
              <p className="t-label mt-1">for {months} months</p>

              <div className="mt-8" aria-hidden>
                <div className="flex h-1.5 overflow-hidden rounded-full bg-steel">
                  <motion.div className="h-full bg-bone" animate={{ width: `${principalShare}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
                  <div className="h-full flex-1 bg-brass/80" />
                </div>
                <div className="mt-3 flex justify-between t-label">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-bone" />Loan</span>
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brass/80" />Interest</span>
                </div>
              </div>

              <dl className="mt-8 border-t border-line text-[0.9375rem]">
                {(
                  [
                    ['Loan amount', priceFull(loan)],
                    ['Total interest', priceFull(interest)],
                    ['Total repaid', priceFull(total)],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-line py-3.5">
                    <dt className="t-label">{k}</dt>
                    <dd className="t-num">{v}</dd>
                  </div>
                ))}
              </dl>
              <button className="btn btn-primary mt-8 w-full" onClick={() => scrollToEl(document.getElementById('apply'))}>
                Apply for finance
              </button>
              <p className="mt-4 t-label text-smoke">An estimate only. The rate you are offered depends on the lender and your credit history.</p>
            </div>
          </div>
        </div>
      </section>

      <Apply carId={carId} loan={loan} monthly={monthly} months={months} />

      <section className="wrap grid gap-10 py-24 md:py-36 lg:grid-cols-12" aria-labelledby="faq-h">
        <h2 id="faq-h" className="t-h2 lg:col-span-4">
          Questions people ask
        </h2>
        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion items={FINANCE_FAQS} />
        </div>
      </section>
    </>
  );
}

function Slider({ id, label, value, min, max, step, display, onChange }: { id: string; label: string; value: number; min: number; max: number; step: number; display: string; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="field-label !mb-0">
          {label}
        </label>
        <span className="t-num text-[1.0625rem] text-bone">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        className="range mt-4"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--p' as string]: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

function Apply({ carId, loan, monthly, months }: { carId: string; loan: number; monthly: number; months: number }) {
  const { addAppointment } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [job, setJob] = useState<(typeof EMPLOYMENT)[number]>('Salaried');
  const [whatsapp, setWhatsapp] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Enter your name as it appears on your PAN card.';
    if (!validPhone(phone)) err.phone = 'Enter a 10-digit Indian mobile number.';
    setErrors(err);
    if (Object.keys(err).length) return;
    const id = ref('FIN');
    const car = carById(carId);
    addAppointment({
      id,
      kind: 'finance',
      title: car ? carName(car) : 'Finance enquiry',
      detail: `${priceShort(loan)} over ${months} months, about ${priceFull(Math.round(monthly))} a month`,
    });
    setDone(id);
  };

  return (
    <section id="apply" className="border-y border-line bg-carbon/40 py-24 md:py-32" aria-labelledby="apply-h">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 id="apply-h" className="t-h2">
            Apply
          </h2>
          <p className="t-lead mt-6 text-ash max-w-[36ch]">Leave your details and our finance desk will call with offers from several lenders, usually within one working day.</p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          {done ? (
            <Confirmation title="Your application is with our finance desk." reference={done}>
              We will call you with lender offers within one working day. Keep your PAN, Aadhaar and last three months of bank statements to hand.
            </Confirmation>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-6">
              <Field label="Full name" htmlFor="ap-name" error={errors.name}>
                <input id="ap-name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </Field>
              <Field label="Mobile number" htmlFor="ap-phone" error={errors.phone}>
                <PhoneInput id="ap-phone" value={phone} onChange={setPhone} invalid={!!errors.phone} />
              </Field>
              <div>
                <p className="field-label">Employment</p>
                <Segmented options={EMPLOYMENT} value={job} onChange={setJob} label="Employment" />
              </div>
              <Checkbox id="ap-wa" checked={whatsapp} onChange={setWhatsapp}>
                Send offers and updates on WhatsApp
              </Checkbox>
              <button type="submit" className="btn btn-primary">
                Send application
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
