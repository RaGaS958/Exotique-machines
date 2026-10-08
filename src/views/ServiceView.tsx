import { useState, type FormEvent } from 'react';
import { SERVICES } from '../data/site';
import { useStore } from '../lib/store';
import { ref } from '../lib/format';
import { useTitle } from '../lib/useTitle';
import { PageIntro } from '../components/Chrome';
import { Checkbox, Confirmation, Field, PhoneInput, validPhone } from '../components/Form';
import Img from '../components/Img';

const iso = (d: Date) => d.toISOString().slice(0, 10);

export default function ServiceView() {
  useTitle('Service');
  const { addAppointment } = useStore();
  const tomorrow = new Date(Date.now() + 864e5);
  const [vehicle, setVehicle] = useState('');
  const [reg, setReg] = useState('');
  const [type, setType] = useState(SERVICES[0].title);
  const [date, setDate] = useState('');
  const [collect, setCollect] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!vehicle.trim()) err.vehicle = 'Tell us which car, for example 2022 Porsche Cayenne.';
    if (!date) err.date = 'Choose a preferred date.';
    else if (new Date(date + 'T12:00').getDay() === 0) err.date = 'The workshop is closed on Sundays. Choose another day.';
    else if (date < iso(tomorrow)) err.date = 'Choose a date from tomorrow onwards.';
    if (!name.trim()) err.name = 'Enter your name.';
    if (!validPhone(phone)) err.phone = 'Enter a 10-digit Indian mobile number.';
    setErrors(err);
    if (Object.keys(err).length) return;
    const id = ref('SRV');
    const when = new Date(date + 'T12:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    addAppointment({ id, kind: 'service', title: `${type}, ${vehicle}`, detail: collect ? 'We collect and return the car' : 'You drop the car at the workshop', when });
    setDone(id);
  };

  return (
    <>
      <PageIntro title="Service" lead="Servicing to the manufacturer schedule for every marque we sell, by technicians trained on them. We collect and return within 40 km of Lucknow." />

      <section className="wrap pb-24 md:pb-32" aria-label="What we do">
        <ul className="grid border-t border-line md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <li key={s.title} className={`border-b border-line py-8 md:py-10 ${i % 2 === 0 ? 'md:pr-12 md:border-r' : 'md:pl-12'}`}>
              <h2 className="t-h3">{s.title}</h2>
              <p className="t-body mt-3 text-ash max-w-[44ch]">{s.text}</p>
              <p className="mt-5 t-label text-bone/80">{s.interval}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line bg-carbon/40 py-24 md:py-32" aria-labelledby="book-h">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="book-h" className="t-h2">
              Book a service
            </h2>
            <p className="t-lead mt-6 text-ash max-w-[36ch]">Pick a day and we will confirm the time by phone. Most scheduled services are finished the same day.</p>
            <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[3px] bg-carbon lg:block">
              <Img id="photo-1694026078756-3743e4b9a09c" sizes="40vw" alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            {done ? (
              <Confirmation title="Your service is booked." reference={done}>
                We will call the day before to confirm the time{collect ? ' and the collection address' : ''}.
              </Confirmation>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Car" htmlFor="sv-car" error={errors.vehicle}>
                    <input id="sv-car" className="field" value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="2022 Porsche Cayenne" />
                  </Field>
                  <Field label="Registration (optional)" htmlFor="sv-reg">
                    <input id="sv-reg" className="field uppercase" value={reg} onChange={(e) => setReg(e.target.value)} placeholder="UP 32 AB 1234" />
                  </Field>
                </div>
                <Field label="What it needs" htmlFor="sv-type">
                  <select id="sv-type" className="field" value={type} onChange={(e) => setType(e.target.value)}>
                    {SERVICES.filter((s) => s.title !== 'Collection and delivery').map((s) => (
                      <option key={s.title}>{s.title}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Preferred date" htmlFor="sv-date" error={errors.date} hint="Monday to Saturday">
                  <input id="sv-date" type="date" className="field t-num" min={iso(tomorrow)} value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>
                <Checkbox id="sv-collect" checked={collect} onChange={setCollect}>
                  Collect the car from my home or office
                </Checkbox>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" htmlFor="sv-name" error={errors.name}>
                    <input id="sv-name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  </Field>
                  <Field label="Mobile number" htmlFor="sv-phone" error={errors.phone}>
                    <PhoneInput id="sv-phone" value={phone} onChange={setPhone} invalid={!!errors.phone} />
                  </Field>
                </div>
                <button type="submit" className="btn btn-primary">
                  Book the service
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
