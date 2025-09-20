import {
  d,
  START,
  END,
  PRESIDENTS,
  MONARCHS,
  President,
  Monarch,
  PRESIDENCY_BEGINS,
  PRESIDENCY_ENDS,
  DEATH,
} from './presidents';

export interface CountryTimeline {
  code: string;
  name: string;
  start: Date;
  end: Date;
  presidents: President[];
  monarchs: Monarch[];
}

const NITOPIA_START = d(1801, 1, 1);
const NITOPIA_END = d(2004, 12, 31);

const NITOPIA_PRESIDENTS: President[] = [
  {
    name: 'Bertram Woolcrest',
    party: 'Ghanaio Party',
    birth: d(1801, 2, 14),
    death: d(1875, 10, 6),
    events: [
      {
        date: d(1843, 5, 11),
        type: PRESIDENCY_BEGINS,
        text: 'First president of the Nitopian Republic',
      },
      {
        date: d(1851, 12, 3),
        type: PRESIDENCY_ENDS,
        text: 'Retired from office',
      },
      {
        date: d(1875, 10, 6),
        type: DEATH,
        text: 'Died aged 74 of Deep Scroll Mecholisa cancer',
      },
    ],
  },
  {
    name: 'James Jones Loo Moo',
    party: 'Organisational Conservative Party',
    birth: d(1921, 7, 9),
    death: d(2004, 8, 18),
    events: [
      {
        date: d(1975, 4, 29),
        type: PRESIDENCY_BEGINS,
        text: 'Caretaker president during instability',
      },
      {
        date: d(1976, 1, 22),
        type: PRESIDENCY_ENDS,
        text: 'Stepped down',
      },
      {
        date: d(2004, 8, 18),
        type: DEATH,
        text: 'Died aged 83 of heatstroke',
      },
    ],
  },
];

const NITOPIA_MONARCHS: Monarch[] = [
  {
    name: 'Regent Solenne Thry',
    birth: d(1770, 4, 2),
    death: d(1848, 6, 19),
    start_reign: d(1798, 11, 1),
    end_reign: d(1848, 6, 19),
    death_cause: 'Complications of silver lung fever',
  },
  {
    name: 'Crown Marshal Dagan Pell',
    birth: d(1815, 8, 23),
    death: d(1892, 2, 17),
    start_reign: d(1848, 6, 19),
    end_reign: d(1892, 2, 17),
    death_cause: 'Sky barge collision over the violet marshes',
  },
  {
    name: 'Speaker Imara Quell',
    birth: d(1860, 1, 14),
    death: d(1972, 9, 30),
    start_reign: d(1892, 2, 17),
    end_reign: d(1972, 9, 30),
    death_cause: 'Quiet fade illness',
  },
  {
    name: 'Crown Mediator Halevi Morcant',
    birth: d(1938, 12, 5),
    death: null,
    start_reign: d(1972, 10, 1),
    end_reign: null,
    death_cause: null,
  },
];

export const COUNTRIES: CountryTimeline[] = [
  {
    code: 'aerobea',
    name: 'Aerobea',
    start: START,
    end: END,
    presidents: PRESIDENTS,
    monarchs: MONARCHS,
  },
  {
    code: 'nitopia',
    name: 'Nitopia',
    start: NITOPIA_START,
    end: NITOPIA_END,
    presidents: NITOPIA_PRESIDENTS,
    monarchs: NITOPIA_MONARCHS,
  },
];

export const DEFAULT_COUNTRY_CODE = 'aerobea';

export function getCountryByCode(code: string): CountryTimeline | undefined {
  return COUNTRIES.find(country => country.code === code);
}
