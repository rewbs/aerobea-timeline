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
const NITOPIA_END = d(2025, 10, 1);

const NITOPIA_PRESIDENTS: President[] = [
  {
    name: "Bertram Woolcrest",
    party: "Ghanaio Party",
    birth: d(1801, 4, 24),
    death: d(1875, 9, 2),
    events: [
      { date: d(1843, 1, 1), type: PRESIDENCY_BEGINS, text: "First president of the Nitopian Republic" },
      { date: d(1851, 1, 1), type: PRESIDENCY_ENDS, text: "Retired from office" },
      { date: d(1875, 9, 2), type: DEATH, text: "Died of Deep Scroll Mecholisa cancer" }
    ]
  },
  {
    name: "Tannon Moofield",
    party: "ZXMO Party",
    birth: d(1813, 3, 25),
    death: d(1896, 9, 27),
    events: [
      { date: d(1851, 1, 1), type: PRESIDENCY_BEGINS, text: "Succeeded Woolcrest" },
      { date: d(1859, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1896, 9, 27), type: DEATH, text: "Died of heart failure" }
    ]
  },
  {
    name: "Grissel Fleecehorn",
    party: "Ghanaio Party",
    birth: d(1817, 7, 24),
    death: d(1894, 7, 3),
    events: [
      { date: d(1859, 1, 1), type: PRESIDENCY_BEGINS, text: "Promoted wool hygiene reforms" },
      { date: d(1867, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1894, 7, 3), type: DEATH, text: "Died of pneumonia" }
    ]
  },
  {
    name: "Morric Haystrand",
    party: "ZXMO Party",
    birth: d(1824, 11, 26),
    death: d(1901, 8, 3),
    events: [
      { date: d(1867, 1, 1), type: PRESIDENCY_BEGINS, text: "Balanced fog levies" },
      { date: d(1875, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1901, 8, 3), type: DEATH, text: "Died of stroke" }
    ]
  },
  {
    name: "Farlan Shearback",
    party: "Ghanaio Party",
    birth: d(1824, 2, 28),
    death: d(1899, 8, 24),
    events: [
      { date: d(1875, 1, 1), type: PRESIDENCY_BEGINS, text: "Expanded Needles institutions" },
      { date: d(1883, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1899, 8, 24), type: DEATH, text: "Died of fog-lung disease" }
    ]
  },
  {
    name: "Jorvic Moo",
    party: "ZXMO Party",
    birth: d(1832, 1, 25),
    death: d(1904, 7, 3),
    events: [
      { date: d(1883, 1, 1), type: PRESIDENCY_BEGINS, text: "Strengthened financial order" },
      { date: d(1891, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1904, 7, 3), type: DEATH, text: "Died of cerebral haemorrhage" }
    ]
  },
  {
    name: "Derrin Woolmantle",
    party: "Ghanaio Party",
    birth: d(1837, 8, 24),
    death: d(1903, 9, 29),
    events: [
      { date: d(1891, 1, 1), type: PRESIDENCY_BEGINS, text: "Attempted fog-tax reforms" },
      { date: d(1899, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1903, 9, 29), type: DEATH, text: "Died in the fog-fever epidemic" }
    ]
  },
  {
    name: "Halvar Moo (Mooson Peak)",
    party: "ZXMO Party",
    birth: d(1842, 2, 25),
    death: d(1924, 8, 23),
    events: [
      { date: d(1899, 1, 1), type: PRESIDENCY_BEGINS, text: "First photographed president" },
      { date: d(1909, 1, 1), type: PRESIDENCY_ENDS, text: "Last First Republic president" },
      { date: d(1924, 8, 23), type: DEATH, text: "Died of heart failure" }
    ]
  },
  {
    name: "Flann Woolbarrel",
    party: "Fleece Party",
    birth: d(1879, 5, 10),
    death: d(1930, 2, 2),
    events: [
      { date: d(1909, 1, 1), type: PRESIDENCY_BEGINS, text: "Authored the Nitopian Constitution" },
      { date: d(1917, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1930, 2, 2), type: DEATH, text: "Died of pneumonia" }
    ]
  },
  {
    name: "Crispin Lintmane",
    party: "Organisational Conservative Party",
    birth: d(1882, 9, 9),
    death: d(1940, 12, 27),
    events: [
      { date: d(1917, 1, 1), type: PRESIDENCY_BEGINS, text: "Founded Silent Rotation Council" },
      { date: d(1925, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1940, 12, 27), type: DEATH, text: "Died of respiratory illness (scroll-mould infection)" }
    ]
  },
  {
    name: "Mabel Fluffback",
    party: "Fleece Party",
    birth: d(1890, 1, 28),
    death: d(1958, 10, 29),
    events: [
      { date: d(1925, 1, 1), type: PRESIDENCY_BEGINS, text: "First female president" },
      { date: d(1934, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1958, 10, 29), type: DEATH, text: "Died of stroke" }
    ]
  },
  {
    name: "Lossa Milco",
    party: "Cow Party",
    birth: d(1895, 5, 23),
    death: d(1978, 7, 4),
    events: [
      { date: d(1934, 1, 1), type: PRESIDENCY_BEGINS, text: "Brokered Fog-Trough Accords" },
      { date: d(1947, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1978, 7, 4), type: DEATH, text: "Died of heart disease" }
    ]
  },
  {
    name: "Kero Mason",
    party: "Organisational Conservative Party",
    birth: d(1901, 3, 25),
    death: d(1986, 1, 1),
    events: [
      { date: d(1947, 1, 1), type: PRESIDENCY_BEGINS, text: "Centralised fog permits" },
      { date: d(1955, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1986, 1, 1), type: DEATH, text: "Died of kidney failure" }
    ]
  },
  {
    name: "Coiler Jacxs",
    party: "Republican Fogpipe Party",
    birth: d(1911, 1, 1),
    death: d(2006, 1, 1),
    events: [
      { date: d(1955, 1, 1), type: PRESIDENCY_BEGINS, text: "Ritual fogpipe era" },
      { date: d(1957, 1, 1), type: PRESIDENCY_ENDS, text: "Party banned after Scroll Clog Incident" },
      { date: d(2006, 1, 1), type: DEATH, text: "Died of natural causes" }
    ]
  },
  {
    name: "Moo 17",
    party: "Cow Party",
    birth: d(1923, 7, 27),
    death: d(1981, 4, 21),
    events: [
      { date: d(1957, 1, 1), type: PRESIDENCY_BEGINS, text: "Introduced 'Four Fences' bans" },
      { date: d(1963, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1976, 1, 1), type: PRESIDENCY_BEGINS, text: "Returned to office" },
      { date: d(1981, 4, 21), type: PRESIDENCY_ENDS, text: "Died in office" },
      { date: d(1981, 4, 21), type: DEATH, text: "Died in a plane crash (smoke detector failure)" }
    ]
  },
  {
    name: "Ulf Moolf",
    party: "Goat Party",
    birth: d(1929, 5, 7),
    death: null,
    events: [
      { date: d(1963, 1, 1), type: PRESIDENCY_BEGINS, text: "Rural reforms" },
      { date: d(1975, 1, 1), type: PRESIDENCY_ENDS, text: "Retired from office" }
    ]
  },
  {
    name: "James Jones Loo Moo",
    party: "Organisational Conservative Party",
    birth: d(1921, 2, 20),
    death: d(2004, 8, 7),
    events: [
      { date: d(1975, 1, 1), type: PRESIDENCY_BEGINS, text: "Caretaker president" },
      { date: d(1976, 1, 1), type: PRESIDENCY_ENDS, text: "Stepped down" },
      { date: d(2004, 8, 7), type: DEATH, text: "Died of heatstroke" }
    ]
  },
  {
    name: "Helmut Moo",
    party: "Cow Party",
    birth: d(1930, 7, 5),
    death: d(1999, 7, 4),
    events: [
      { date: d(1981, 4, 21), type: PRESIDENCY_BEGINS, text: "Acting after Moo 17’s death" },
      { date: d(1981, 12, 31), type: PRESIDENCY_ENDS, text: "Caretaker term ended" },
      { date: d(1999, 7, 4), type: DEATH, text: "Died of lung cancer" }
    ]
  },
  {
    name: "Molly Moo",
    party: "Cow Party",
    birth: d(1935, 1, 1),
    death: null,
    events: [
      { date: d(1981, 1, 1), type: PRESIDENCY_BEGINS, text: "Elected; expanded oatworker rights" },
      { date: d(1996, 1, 1), type: PRESIDENCY_ENDS, text: "Retired from office" }
    ]
  },
  {
    name: "Edward Mooson Peak",
    party: "United Party",
    birth: d(1941, 3, 8),
    death: null,
    events: [
      { date: d(1996, 1, 1), type: PRESIDENCY_BEGINS, text: "Introduced universal scroll welfare" },
      { date: d(2004, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" }
    ]
  },
  {
    name: "Moo 18 (John Moo)",
    party: "Cow Party",
    birth: d(1958, 1, 1),
    death: null,
    events: [
      { date: d(2004, 1, 1), type: PRESIDENCY_BEGINS, text: "Milk-Scroll Initiative" },
      { date: d(2012, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" }
    ]
  },
  {
    name: "Bertha Baahman Woolsen",
    party: "Fleece Party",
    birth: d(1960, 5, 19),
    death: d(2014, 3, 4),
    events: [
      { date: d(2012, 1, 1), type: PRESIDENCY_BEGINS, text: "Champion of inclusivity" },
      { date: d(2014, 3, 4), type: PRESIDENCY_ENDS, text: "Assassinated in office" },
      { date: d(2014, 3, 4), type: DEATH, text: "Assassinated by scroll-trap" }
    ]
  },
  {
    name: "Herbert Mooson Peak",
    party: "United Party",
    birth: d(1964, 12, 12),
    death: null,
    events: [
      { date: d(2014, 3, 5), type: PRESIDENCY_BEGINS, text: "Acting president after Bertha’s death" },
      { date: d(2014, 12, 31), type: PRESIDENCY_ENDS, text: "Caretaker term ended" }
    ]
  },
  {
    name: "Ally the Alpaca",
    party: "Alpaca Justice Party",
    birth: d(1987, 1, 1),
    death: null,
    events: [
      { date: d(2014, 1, 1), type: PRESIDENCY_BEGINS, text: "First alpaca president" },
      { date: d(2015, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" }
    ]
  },
  {
    name: "Moploxoo Mala",
    party: "United Party",
    birth: d(1965, 1, 1),
    death: null,
    events: [
      { date: d(2015, 1, 1), type: PRESIDENCY_BEGINS, text: "Fog literacy and pasture-scroll equity" },
      { date: d(2019, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" }
    ]
  },
  {
    name: "Losca Molpoa",
    party: "Goat Party",
    birth: d(1977, 1, 1),
    death: null,
    events: [
      { date: d(2019, 1, 1), type: PRESIDENCY_BEGINS, text: "Legalised scroll skipping" },
      { date: d(2023, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" }
    ]
  },
  {
    name: "Andy Nittalot",
    party: "United Party",
    birth: d(1983, 1, 1),
    death: null,
    events: [
      { date: d(2023, 1, 1), type: PRESIDENCY_BEGINS, text: "First donkey president; scroll-to-data modernisation" }
    ]
  }
];




const NITOPIA_MONARCHS: Monarch[] = [
    {
      "name": "King Loo XII",
      "birth": d(1748,1,1),
      "death": d(1815,1,1),
      "death_cause": "Stroke",
      "start_reign": d(1800,1,1),
      "end_reign": d(1815,1,1),
      "notes": "Ruler of Nitopia when Bertram Woolcrest was born in 1801. Expanded fog levies."
    },
    {
      "name": "King Loo XIII",
      "birth": d(1785,1,1),
      "death": d(1839,1,1),
      "death_cause": "Tuberculosis",
      "start_reign": d(1815,1,1),
      "end_reign": d(1839,1,1),
      "notes": "Presided over growing unrest between sheep and cow herds. Weak monarch who attempted limited reforms."
    },
    {
      "name": "King Loo XIV",
      "birth": d(1810,1,1),
      "death": d(1843,1,1),
      "death_cause": "Assassinated by graziers’ rebels",
      "start_reign": d(1839,1,1),
      "end_reign": d(1843,1,1),
      "notes": "The last ruling monarch of Nitopia. His assassination in Needles triggered the 1843 revolution and the birth of the Republic."
    },
    {
      "name": "King Loo XV",
      "birth": d(1835,1,1),
      "death": d(1890,1,1),
      "death_cause": "Pneumonia",
      "start_reign": d(1843,1,1),
      "end_reign": d(1890,1,1),
      "notes": "First ceremonial monarch of the Loo line after the monarchy lost power. Kept dynastic traditions alive."
    },
    {
      "name": "King Loo XVI",
      "birth": d(1865,1,1),
      "death": d(1935,1,1),
      "death_cause": "Stroke",
      "start_reign": d(1890,1,1),
      "end_reign": d(1935,1,1),
      "notes": "Ceremonial monarch during Flann Woolbarrel’s constitution and early Republic era."
    },
    {
      "name": "King Loo XVII",
      "birth": d(1900,1,1),
      "death": d(1987,1,1),
      "death_cause": "Heart failure",
      "start_reign": d(1935,1,1),
      "end_reign": d(1987,1,1),
      "notes": "A symbolic monarch during Nitopia’s turbulent 20th century. Abdicated ceremonial duties shortly before his death."
    },
    {
      "name": "King Loo XVIII",
      "birth": d(1920,1,1),
      "death": d(2007,1,1),
      "death_cause": "Natural causes",
      "start_reign": d(1987,1,1),
      "end_reign": d(1987,1,1),
      "notes": "Briefly recognised in 1987 as ceremonial monarch but abdicated the same year. Lived privately until 2007."
    },
    {
      "name": "King Loo XIX",
      "birth": d(1950,1,1),
      "death": null,
      "death_cause": null,
      "start_reign": d(1987,1,1),
      "end_reign": d(2018,1,1),
      "notes": "Ceremonial monarch for three decades. Abdicated in 2018 but remains alive today. Attended Bertha the Sheep’s inauguration in 2012."
    },
    {
      "name": "King Loo XX",
      "birth": d(1980,1,1),
      "death": null,
      "death_cause": null,
      "start_reign": d(2018,1,1),
      "end_reign": null,
      "notes": "Current ceremonial monarch of Nitopia. Still reigning in 2025, often appears alongside President Andy Nittalot."
    }
  ]

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
