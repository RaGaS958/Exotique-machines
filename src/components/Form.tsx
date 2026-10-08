import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export function Field({ label, htmlFor, error, hint, children, className = '' }: { label: string; htmlFor: string; error?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-2 text-[0.8125rem] text-alert" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 t-label">{hint}</p>
      ) : null}
    </div>
  );
}

export function PhoneInput({ id, value, onChange, invalid }: { id: string; value: string; onChange: (v: string) => void; invalid?: boolean }) {
  return (
    <div className="flex">
      <span className="grid h-[52px] place-items-center rounded-l-[4px] border border-r-0 border-line bg-graphite px-3.5 text-[0.9375rem] text-ash">+91</span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
        placeholder="10-digit mobile number"
        aria-invalid={invalid || undefined}
        className={`field !rounded-l-none t-num ${invalid ? '!border-alert' : ''}`}
      />
    </div>
  );
}

export const validPhone = (p: string) => /^[6-9]\d{9}$/.test(p);
export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export function Segmented<T extends string>({ options, value, onChange, label, format }: { options: readonly T[]; value: NoInfer<T>; onChange: (v: NoInfer<T>) => void; label: string; format?: (v: NoInfer<T>) => string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button type="button" key={o} role="radio" aria-checked={value === o} className="chip" onClick={() => onChange(o)}>
          {format ? format(o) : o}
        </button>
      ))}
    </div>
  );
}

export function Checkbox({ checked, onChange, children, id }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; id: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[0.875rem] text-ash">
      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[3px] border transition-colors ${checked ? 'border-bone bg-bone text-ink' : 'border-line-strong'}`}>
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={2.2} />}
      </span>
      <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}

/** Confirmation block shown after any form is sent. */
export function Confirmation({ title, reference, children }: { title: string; reference: string; children?: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
      <div className="mb-8 grid h-12 w-12 place-items-center rounded-full border border-brass text-brass">
        <Check className="h-5 w-5" strokeWidth={1.6} />
      </div>
      <h2 className="t-h2 text-balance">{title}</h2>
      <p className="mt-5 t-label">
        Reference <span className="t-num text-bone">{reference}</span>
      </p>
      {children && <div className="mt-6 t-body text-ash max-w-[52ch]">{children}</div>}
    </motion.div>
  );
}
