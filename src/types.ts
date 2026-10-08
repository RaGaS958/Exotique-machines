export type Body = 'Supercar' | 'Grand tourer' | 'Sports car' | 'SUV' | 'Saloon';
export type Powertrain = 'Petrol' | 'Electric';
export type Status = 'New' | 'Pre-owned';

export interface Car {
  id: string;
  marque: string;
  model: string;
  /** Short line under the model name, e.g. "Performance" or "Black Badge" */
  variant?: string;
  year: number;
  status: Status;
  body: Body;
  powertrain: Powertrain;
  /** Ex-showroom (new) or asking price (pre-owned), in rupees */
  price: number;
  odometerKm?: number;
  owners?: number;
  registration?: string;
  exterior: string;
  interior: string;
  engine: string;
  powerPs: number;
  torqueNm: number;
  zeroToHundred: number; // seconds
  topSpeed: number; // km/h
  transmission: string;
  drive: 'RWD' | 'AWD';
  seats: string;
  range?: string;
  /** One or two sentences, written like a sales note, not an advert */
  note: string;
  equipment: string[];
  /** Unsplash photo ids, first is the lead image */
  photos: string[];
  /** CSS object-position for the lead image when cropped wide */
  focus?: string;
}

export interface Wheel {
  id: string;
  name: string;
  series: string;
  construction: string;
  material: string;
  diameters: string[];
  weight: string;
  finishes: string[];
  description: string;
  photo: string;
  priceFrom: number; // per set of four, rupees
}

export type SavedKind = 'viewing' | 'service' | 'finance' | 'tradein' | 'enquiry' | 'wheels';

export interface Appointment {
  id: string;
  kind: SavedKind;
  title: string;
  detail: string;
  when?: string;
  createdAt: string;
  status: 'active' | 'cancelled';
}
