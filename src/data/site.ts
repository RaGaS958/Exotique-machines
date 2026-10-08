import type { Wheel } from '../types';

export const BRAND = 'Exotique Machines';

export const SHOWROOM = {
  name: BRAND,
  address: ['Vibhuti Khand, Gomti Nagar', 'Lucknow, Uttar Pradesh 226010'],
  mapsUrl: 'https://maps.google.com/?q=Vibhuti+Khand+Gomti+Nagar+Lucknow',
  phoneDisplay: '+91 1800 419 8888',
  phoneHref: 'tel:+9118004198888',
  whatsappHref: 'https://wa.me/9118004198888',
  email: 'concierge@exotiquemachines.com',
  hours: [
    { days: 'Monday to Saturday', time: '10:30 to 19:30' },
    { days: 'Sunday', time: 'By appointment' },
  ],
};

export const WHEELS: Wheel[] = [
  {
    id: 'aero-x',
    name: 'AERO-X',
    series: 'Forged',
    construction: 'Monoblock forged',
    material: '6061-T6 aluminium',
    diameters: ['19"', '20"', '21"', '22"'],
    weight: '8.4 kg at 19 × 9.0"',
    finishes: ['Brushed titanium', 'Satin black', 'Polished clear', 'Machined silver'],
    description: 'Ten thin spokes cut from a single forging. The lightest wheel we make, and the one we fit most often to mid-engined cars.',
    photo: 'photo-1760413452186-962c960667fe',
    priceFrom: 720_000,
  },
  {
    id: 'rs-9',
    name: 'RS-9',
    series: 'Track',
    construction: 'Flow formed',
    material: 'A356 aluminium, flow-formed barrel',
    diameters: ['18"', '19"'],
    weight: '7.8 kg at 18 × 9.5"',
    finishes: ['Satin bronze', 'Matte black', 'Gunmetal'],
    description: 'Built for track days. The flow-formed barrel is close to forged in strength and leaves room for the largest brake kits.',
    photo: 'photo-1714557769791-7b3010a4789d',
    priceFrom: 360_000,
  },
  {
    id: 'sv-3',
    name: 'SV-3',
    series: 'Multi-piece',
    construction: '3-piece forged',
    material: 'Forged 6061-T6 centres, spun aluminium barrels',
    diameters: ['20"', '21"', '22"', '24"'],
    weight: '11.2 kg at 20 × 10.0"',
    finishes: ['Brushed gold centre, polished lip', 'Gloss black centre, satin lip'],
    description: 'A modular wheel for deep-dish and wide fitments. Centre, barrels and hardware are specified separately, so no two sets are the same.',
    photo: 'photo-1594500067118-456bba17ba14',
    priceFrom: 1_150_000,
  },
];

export const ATELIER_STEPS = [
  {
    title: 'Forging',
    text: 'A certified 6061-T6 billet is heated and pressed at 10,000 tonnes, so the grain of the metal follows the shape of the spokes.',
    photo: 'photo-1711418235334-8895331a6cf9',
  },
  {
    title: 'Machining',
    text: 'A five-axis CNC machine cuts the design out of the forged blank. Runout is held to a few hundredths of a millimetre.',
    photo: 'photo-1713371398485-7bde1bde9def',
  },
  {
    title: 'Finishing',
    text: 'Each wheel is brushed or polished by hand, then sealed with a ceramic clear coat that stands up to Indian summers.',
    photo: 'photo-1624775106346-874426ec3831',
  },
  {
    title: 'Fitting',
    text: 'Balanced, torqued and fitted in our Gomti Nagar workshop by the people who made them. We road-test every car before it leaves.',
    photo: 'photo-1760413454829-74202ea3d4eb',
  },
];

export const SERVICES = [
  {
    title: 'Scheduled maintenance',
    text: 'Servicing to the manufacturer schedule with genuine parts, for every marque we sell.',
    interval: 'Every 10,000 km or 12 months',
  },
  {
    title: 'Paint protection and detailing',
    text: 'Paint protection film, ceramic coating and interior care, done in a dust-controlled bay.',
    interval: 'Two to five days',
  },
  {
    title: 'Wheels, tyres and alignment',
    text: 'Tyre fitting, road-force balancing, four-wheel alignment and refurbishment of forged wheels.',
    interval: 'Same day',
  },
  {
    title: 'Collection and delivery',
    text: 'We collect the car from your home or office anywhere within 40 km of Lucknow and bring it back washed.',
    interval: 'With any booking',
  },
];

export const FINANCE_FAQS = [
  {
    q: 'How much do I need to put down?',
    a: 'Most lenders ask for 15 to 25 percent of the price on a luxury car. A larger down payment brings the monthly figure and the total interest down; the calculator shows both.',
  },
  {
    q: 'Which lenders do you work with?',
    a: 'Our finance desk compares offers from several private and public sector banks and arranges the one that suits you. You are never obliged to take finance through us.',
  },
  {
    q: 'Can I finance a pre-owned car?',
    a: 'Yes. Pre-owned cars up to seven years old can usually be financed, though tenures are shorter and rates slightly higher than for new cars.',
  },
  {
    q: 'Can my current car count towards the down payment?',
    a: 'Yes. Get an estimate on the trade-in page, and once our technician has inspected the car the agreed value is deducted from the price.',
  },
];

export const MAKES = ['Aston Martin', 'Audi', 'Bentley', 'BMW', 'Ferrari', 'Jaguar', 'Lamborghini', 'Land Rover', 'Lexus', 'Maserati', 'McLaren', 'Mercedes-Benz', 'Porsche', 'Rolls-Royce', 'Volvo', 'Other'];
