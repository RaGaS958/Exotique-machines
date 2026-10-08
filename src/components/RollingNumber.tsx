import { useEffect, useState } from 'react';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Digits that roll into place like an odometer when the value changes.
 * Non-digit characters (decimal point, commas) are rendered as they are.
 */
export default function RollingNumber({ value, className = '', delay = 0 }: { value: string; className?: string; delay?: number }) {
  // Start from zeros on first paint so the first value rolls in too.
  const [shown, setShown] = useState(() => value.replace(/\d/g, '0'));
  useEffect(() => {
    const shape = (s: string) => s.replace(/\d/g, '0');
    // If the number changes shape (e.g. "720" to "2.9"), new columns mount at zero first.
    setShown((prev) => (shape(prev) === shape(value) ? prev : shape(value)));
    const t = window.setTimeout(() => setShown(value), 40 + delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);

  const chars = shown.split('');
  return (
    <span className={`t-num inline-flex ${className}`} aria-label={value} role="text">
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="roll" aria-hidden>
            <span
              className="roll-col"
              style={{
                transform: `translateY(-${Number(ch)}em)`,
                transitionDelay: `${(chars.length - i) * 45}ms`,
              }}
            >
              {DIGITS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden className="leading-none">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
