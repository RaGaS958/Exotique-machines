import { useEffect, useState, type FormEvent } from 'react';
import { Dialog } from './Overlay';
import { useStore } from '../lib/store';
import { CARS, carById, carName } from '../data/cars';
import { Field, PhoneInput, Segmented, Confirmation, validPhone, validEmail } from './Form';
import { ref } from '../lib/format';

const CONTACT = ['WhatsApp', 'Phone call', 'Email'] as const;

export default function EnquiryDialog() {
  const { enquiry, closeEnquiry, addAppointment } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [carId, setCarId] = useState('');
  const [message, setMessage] = useState('');
  const [via, setVia] = useState<(typeof CONTACT)[number]>('WhatsApp');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    if (enquiry.open) {
      setCarId(enquiry.carId ?? '');
      setMessage(enquiry.topic ?? '');
      setDone(null);
      setErrors({});
    }
  }, [enquiry.open, enquiry.carId, enquiry.topic]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Enter your name so we know who to ask for.';
    if (!validPhone(phone)) err.phone = 'Enter a 10-digit Indian mobile number.';
    if (via === 'Email' && !validEmail(email)) err.email = 'Enter an email address, or choose another way to reach you.';
    else if (email && !validEmail(email)) err.email = 'This email address looks incomplete.';
    setErrors(err);
    if (Object.keys(err).length) return;
    const id = ref('ENQ');
    const car = carById(carId);
    addAppointment({ id, kind: 'enquiry', title: car ? carName(car) : 'General enquiry', detail: `Reply by ${via.toLowerCase()} to +91 ${phone}` });
    setDone(id);
  };

  const car = carById(carId);

  return (
    <Dialog open={enquiry.open} onClose={closeEnquiry} label="Send an enquiry">
      <div className="p-6 sm:p-9">
        {done ? (
          <Confirmation title="Thank you. We have your enquiry." reference={done}>
            A member of the sales team will reply by {via.toLowerCase()} within working hours, usually the same day.
            <div className="mt-8">
              <button className="btn btn-primary" onClick={closeEnquiry}>
                Close
              </button>
            </div>
          </Confirmation>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2 className="t-h3 pr-12">{car ? `Ask about the ${car.model}` : 'Send an enquiry'}</h2>
            <p className="mt-2 t-label max-w-[40ch]">A member of the sales team replies within working hours, usually the same day.</p>

            <div className="mt-8 space-y-5">
              <Field label="Your name" htmlFor="enq-name" error={errors.name}>
                <input id="enq-name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </Field>
              <Field label="Mobile number" htmlFor="enq-phone" error={errors.phone}>
                <PhoneInput id="enq-phone" value={phone} onChange={setPhone} invalid={!!errors.phone} />
              </Field>
              <Field label="Email (optional)" htmlFor="enq-email" error={errors.email}>
                <input id="enq-email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </Field>
              <Field label="Car" htmlFor="enq-car">
                <select id="enq-car" className="field" value={carId} onChange={(e) => setCarId(e.target.value)}>
                  <option value="">Not sure yet</option>
                  {CARS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {carName(c)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Message (optional)" htmlFor="enq-msg">
                <textarea id="enq-msg" className="field" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
              </Field>
              <div>
                <p className="field-label">How should we reply?</p>
                <Segmented options={CONTACT} value={via} onChange={setVia} label="How should we reply?" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-9 w-full">
              Send enquiry
            </button>
          </form>
        )}
      </div>
    </Dialog>
  );
}
