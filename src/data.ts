export type SupplyStatus = 'stocked' | 'low' | 'out';

export type SupplyCategory = {
  id: string;
  label: string;
  status: SupplyStatus;
  lastUpdate: string;
};

export type Site = {
  id: string;
  name: string;
  sector: string;
  reporter?: string;
  status: SupplyStatus;
  unacknowledged?: boolean;
  enRouteEta?: string;
  lastReport: string;
  categories: SupplyCategory[];
};

export type TickerItem = {
  id: string;
  age: string;
  level: SupplyStatus | 'info';
  message: string;
};

export const SUPPLY_CATEGORIES: SupplyCategory[] = [
  { id: 'water',   label: 'Water',   status: 'out',     lastUpdate: 'just sent' },
  { id: 'food',    label: 'Food',    status: 'low',     lastUpdate: 'now: Low' },
  { id: 'formula', label: 'Formula', status: 'stocked', lastUpdate: 'now: Stocked' },
  { id: 'diapers', label: 'Diapers', status: 'low',     lastUpdate: 'just sent' },
  { id: 'hygiene', label: 'Hygiene', status: 'stocked', lastUpdate: 'just sent' },
];

export const SITES: Site[] = [
  {
    id: 'riverview',
    name: 'Riverview High School',
    sector: 'Sector A',
    reporter: 'Maria Castillo',
    status: 'out',
    unacknowledged: true,
    lastReport: '2h ago',
    categories: SUPPLY_CATEGORIES,
  },
  {
    id: 'newtown',
    name: 'Newtown Estates Rec Center',
    sector: 'Sector A',
    reporter: 'Devon Hall',
    enRouteEta: 'ETA 15m',
    status: 'out',
    lastReport: '2h ago',
    categories: [
      { id: 'water',   label: 'Water',   status: 'stocked', lastUpdate: '' },
      { id: 'food',    label: 'Food',    status: 'low',     lastUpdate: '' },
      { id: 'formula', label: 'Formula', status: 'out',     lastUpdate: '' },
      { id: 'diapers', label: 'Diapers', status: 'stocked', lastUpdate: '' },
    ],
  },
  {
    id: 'firestation-2',
    name: 'POD 3 / Fire Station 2',
    sector: 'Sector B',
    status: 'low',
    lastReport: '2h ago',
    categories: [
      { id: 'water',   label: 'Water',   status: 'low',     lastUpdate: '' },
      { id: 'food',    label: 'Food',    status: 'stocked', lastUpdate: '' },
      { id: 'hygiene', label: 'Hygiene', status: 'stocked', lastUpdate: '' },
      { id: 'medical', label: 'Medical', status: 'stocked', lastUpdate: '' },
    ],
  },
  {
    id: 'bayfront',
    name: 'Bayfront Park Pavilion',
    sector: 'Sector A',
    status: 'low',
    lastReport: '3h ago',
    categories: [
      { id: 'water',   label: 'Water',   status: 'stocked', lastUpdate: '' },
      { id: 'food',    label: 'Food',    status: 'low',     lastUpdate: '' },
      { id: 'diapers', label: 'Diapers', status: 'stocked', lastUpdate: '' },
    ],
  },
  {
    id: 'fruitville',
    name: 'Fruitville Library',
    sector: 'Sector C',
    status: 'low',
    lastReport: '1h ago',
    categories: [
      { id: 'water',   label: 'Water',   status: 'stocked', lastUpdate: '' },
      { id: 'food',    label: 'Food',    status: 'low',     lastUpdate: '' },
      { id: 'hygiene', label: 'Hygiene', status: 'stocked', lastUpdate: '' },
    ],
  },
  {
    id: 'lakewood',
    name: 'Lakewood Ranch Town Hall',
    sector: 'Sector D',
    status: 'stocked',
    lastReport: '45m ago',
    categories: [
      { id: 'water',   label: 'Water',   status: 'stocked', lastUpdate: '' },
      { id: 'food',    label: 'Food',    status: 'stocked', lastUpdate: '' },
      { id: 'hygiene', label: 'Hygiene', status: 'stocked', lastUpdate: '' },
    ],
  },
  {
    id: 'venice-comm',
    name: 'Venice Community Center',
    sector: 'Sector B',
    status: 'stocked',
    lastReport: '1h ago',
    categories: [
      { id: 'water',   label: 'Water',   status: 'stocked', lastUpdate: '' },
      { id: 'food',    label: 'Food',    status: 'stocked', lastUpdate: '' },
      { id: 'hygiene', label: 'Hygiene', status: 'stocked', lastUpdate: '' },
    ],
  },
  {
    id: 'siesta-key',
    name: 'Siesta Key Chapel',
    sector: 'Sector C',
    status: 'stocked',
    lastReport: '30m ago',
    categories: [
      { id: 'water',   label: 'Water',   status: 'stocked', lastUpdate: '' },
      { id: 'food',    label: 'Food',    status: 'stocked', lastUpdate: '' },
      { id: 'hygiene', label: 'Hygiene', status: 'stocked', lastUpdate: '' },
    ],
  },
];

export const TICKER: TickerItem[] = [
  { id: 't1', age: '2h ago', level: 'low', message: 'Fire Station 2 went LOW (Water)' },
  { id: 't2', age: '2h ago', level: 'out', message: "Volunteer 'Maria' reported Water OUT at Riverview HS" },
  { id: 't3', age: '2h ago', level: 'info', message: 'Truck 4 marked en route, Formula to Newtown Estates' },
  { id: 't4', age: '2h ago', level: 'out', message: 'Ortega reported Formula OUT at Newtown Estates' },
];

export const SITUATION = {
  title: 'Sarasota County: Severe Flooding',
  code: 'ICS-209-2026-0512',
  activatedAgo: 'Activated 20h 33m ago',
  description:
    'Severe coastal and inland flooding across Sarasota and Venice. Storm surge along Siesta Key and Lido. PODs activated; mass care in coordination with Red Cross and Salvation Army.',
  countyLabel: 'SARASOTA COUNTY, FL · 8 SITES',
  commander: 'Cmdr. T. Reyes',
};
