import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MAKES } from '../data/site';
import { useStore } from '../lib/store';
import { priceShort, ref } from '../lib/format';
import { useTitle } from '../lib/useTitle';
import { PageIntro } from '../components/Chrome';
import { Confirmation, Field, PhoneInput, Segmented, validPhone } from '../components/Form';
import Img from '../components/Img';

const CONDITIONS = ['Excellent', 'Good', 'Fair'] as const;
const CONDITION_HELP: Record<(typeof CONDITIONS)[number], string> = {
  Excellent: 'No marks worth mentioning, full service history, original paint.',
  Good: 'Light marks from normal use, serviced on time.',
  Fair: 'Visible damage, a gap in the service history, or a repaint.',
};
const STRONG_RESIDUALS = ['Porsche', 'Ferrari', 'Lexus', 'Land Rover', 'Lamborghini'];
const LOCATIONS = ['At the showroom', 'At my address in Lucknow'] as const;

export default function TradeInView() {
  useTitle('Trade-in');
  const { addAppointment } = useStore();
  const thisYear = new Date().getFullYear();
  const [make, setMake] = useState('Mercedes-Benz');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(thisYear - 3);
  const [kms, setKms] = useState('');
  const [original, setOriginal] = useState('');
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number]>('Good');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [range, setRange] = useState<[number, number] | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [where, setWhere] = useState<(typeof LOCATIONS)[number]>('At the showroom');
  const [bookErrors, setBookErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);

  const estimate = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!model.trim()) err.model = 'Enter the model, for example GLE 300d.';
    const km = Number(kms);
    if (!kms || Number.isNaN(km) || km < 0) err.kms = 'Enter the odometer reading in kilometres.';
    const orig = Number(original);
    if (!original || Number.isNaN(orig) || orig < 5) err.original = 'Enter roughly what the car cost new, in lakh.';
    setErrors(err);
    if (Object.keys(err).length) return;

    const age = Math.max(0, thisYear - year);
    let v = orig * 1e5 * Math.pow(STRONG_RESIDUALS.includes(make) ? 0.88 : 0.85, age);
    const expected = Math.max(1, age) * 12_000;
    const excess = (km - expected) / 10_000;
    v *= Math.max(0.7, Math.min(1.06, 1 - excess * 0.025));
    v *= condition === 'Excellent' ? 1.04 : condition === 'Fair' ? 0.86 : 1;
    v = Math.max(200_000, v);
    setRange([Math.round((v * 0.94) / 10_000) * 10_000, Math.round((v * 1.06) / 10_000) * 10_000]);
  };

  const book = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Enter your name.';
    if (!validPhone(phone)) err.phone = 'Enter a 10-digit Indian mobile number.';
    setBookErrors(err);
    if (Object.keys(err).length || !range) return;
    const id = ref('VAL');
    addAppointment({ id, kind: 'tradein', title: `${year} ${make} ${model}`, detail: `Estimate ${priceShort(range[0])} to ${priceShort(range[1])}. Inspection ${where.toLowerCase()}.` });
    setDone(id);
  };

  return (
    <>
      <PageIntro title="Trade-in" lead="Tell us about the car you have now. You get an indicative range straight away; the firm figure follows a 45-minute inspection." />

      <section className="wrap pb-24 md:pb-36">
        <div className="grid gap-12 border-t border-line pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-16">
          <form onSubmit={estimate} noValidate className="space-y-6 lg:col-span-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Make" htmlFor="ti-make">
                <select id="ti-make" className="field" value={make} onChange={(e) => setMake(e.target.value)}>
                  {MAKES.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </Field>
              <Field label="Model" htmlFor="ti-model" error={errors.model}>
                <input id="ti-model" className="field" value={model} onChange={(e) => setModel(e.target.value)} placeholder="GLE 300d" />
              </Field>
              <Field label="Year of registration" htmlFor="ti-year">
                <select id="ti-year" className="field t-num" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {Array.from({ length: 16 }, (_, i) => thisYear - i).map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </Field>
              <Field label="Odometer (km)" htmlFor="ti-km" error={errors.kms}>
                <input id="ti-km" className="field t-num" inputMode="numeric" value={kms} onChange={(e) => setKms(e.target.value.replace(/\D/g, ''))} placeholder="32000" />
              </Field>
            </div>
            <Field label="Price when new (lakh)" htmlFor="ti-orig" error={errors.original} hint="A rough figure is fine. It anchors the estimate.">
              <input id="ti-orig" className="field t-num" inputMode="decimal" value={original} onChange={(e) => setOriginal(e.target.value.replace(/[^\d.]/g, ''))} placeholder="95" />
            </Field>
            <div>
              <p className="field-label">Condition</p>
              <Segmented options={CONDITIONS} value={condition} onChange={setCondition} label="Condition" />
              <p className="mt-3 t-label">{CONDITION_HELP[condition]}</p>
            </div>
            <button type="submit" className="btn btn-primary">
              {range ? 'Update the estimate' : 'Get an estimate'}
            </button>
          </form>

          <div className="lg:col-span-5 lg:col-start-8">
            <AnimatePresence mode="wait">
              {range ? (
                <motion.div key="r" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="rounded-[6px] border border-line bg-carbon p-6 sm:p-8">
                  <p className="t-label">Indicative value</p>
                  <p className="t-num mt-3 text-[clamp(1.9rem,3.4vw,2.8rem)] font-[300] tracking-[-0.03em]" style={{ fontStretch: '112%' }}>
                    {priceShort(range[0])} to {priceShort(range[1])}
                  </p>
                  <p className="mt-3 t-label">
                    {year} {make} {model}, {Number(kms).toLocaleString('en-IN')} km, {condition.toLowerCase()} condition
                  </p>
                  <div className="mt-8 border-t border-line pt-8">
                    {done ? (
                      <Confirmation title="Inspection requested." reference={done}>
                        We will call to fix a time. Bring the registration certificate, insurance and service book.
                      </Confirmation>
                    ) : (
                      <form onSubmit={book} noValidate className="space-y-5">
                        <p className="t-body text-bone">Book an inspection to turn this into a firm offer.</p>
                        <Field label="Your name" htmlFor="ti-name" error={bookErrors.name}>
                          <input id="ti-name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                        </Field>
                        <Field label="Mobile number" htmlFor="ti-phone" error={bookErrors.phone}>
                          <PhoneInput id="ti-phone" value={phone} onChange={setPhone} invalid={!!bookErrors.phone} />
                        </Field>
                        <div>
                          <p className="field-label">Where</p>
                          <Segmented options={LOCATIONS} value={where} onChange={setWhere} label="Where" />
                        </div>
                        <button type="submit" className="btn btn-primary w-full">
                          Book an inspection
                        </button>
                      </form>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-carbon">
                  <Img id="photo-1694026006855-6f4f0cdee8c0" sizes="(min-width: 1024px) 40vw, 100vw" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                  <p className="t-body absolute inset-x-6 bottom-6 text-bone/90 max-w-[34ch]">The value is deducted from the price of your next car, or paid to you directly if you are only selling.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
