const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('en-IN');

/** ₹3.95 Cr, ₹72 L, ₹4,25,000 */
export function priceShort(rupees: number): string {
  if (rupees >= 1e7) {
    const cr = rupees / 1e7;
    return `₹${cr.toFixed(2)} Cr`;
  }
  if (rupees >= 1e5) {
    const l = rupees / 1e5;
    return `₹${trim(l.toFixed(l >= 10 ? 1 : 2))} L`;
  }
  return `₹${inr.format(rupees)}`;
}

/** ₹39,50,000 */
export function priceFull(rupees: number): string {
  return `₹${inr.format(Math.round(rupees))}`;
}

export function km(n: number): string {
  return `${num.format(n)} km`;
}

export function numberIN(n: number): string {
  return num.format(n);
}

function trim(s: string) {
  return s.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
}

/** Equated monthly instalment. rate is annual percent. */
export function emi(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

/** The indicative monthly figure shown on cards: 20% down, 9.25%, 60 months. */
export function indicativeEmi(price: number): number {
  return emi(price * 0.8, 9.25, 60);
}

export function ref(prefix: string): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  const l = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix}-${n}${l}`;
}
