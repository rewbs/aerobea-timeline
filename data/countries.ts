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
    name: "Halvar Moo - Mooson Peak",
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
    death: d(1986,12, 5),
    events: [
      { date: d(1947, 1, 1), type: PRESIDENCY_BEGINS, text: "Centralised fog permits" },
      { date: d(1955, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1986, 12, 5), type: DEATH, text: "Died of kidney failure" }
    ]
  },
  {
    name: "Coiler Jacxs",
    party: "Republican Fogpipe Party",
    birth: d(1911, 3, 4),
    death: d(2006, 6, 1),
    events: [
      { date: d(1955, 1, 1), type: PRESIDENCY_BEGINS, text: "Ritual fogpipe era" },
      { date: d(1957, 1, 1), type: PRESIDENCY_ENDS, text: "Party banned after Scroll Clog Incident" },
      { date: d(2006, 6, 1), type: DEATH, text: "Died of natural causes" }
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
    birth: d(1935, 7, 11),
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
    name: "Moo 18 - John Moo",
    party: "Cow Party",
    birth: d(1958, 5, 5),
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
    birth: d(1987, 1, 4),
    death: null,
    events: [
      { date: d(2014, 1, 1), type: PRESIDENCY_BEGINS, text: "First alpaca president" },
      { date: d(2015, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" }
    ]
  },
  {
    name: "Moploxoo Mala",
    party: "United Party",
    birth: d(1965, 8, 1),
    death: null,
    events: [
      { date: d(2015, 1, 1), type: PRESIDENCY_BEGINS, text: "Fog literacy and pasture-scroll equity" },
      { date: d(2019, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" }
    ]
  },
  {
    name: "Losca Molpoa",
    party: "Goat Party",
    birth: d(1977, 5, 1),
    death: null,
    events: [
      { date: d(2019, 1, 1), type: PRESIDENCY_BEGINS, text: "Legalised scroll skipping" },
      { date: d(2023, 1, 1), type: PRESIDENCY_ENDS, text: "Term ended" }
    ]
  },
  {
    name: "Andy Nittalot",
    party: "United Party",
    birth: d(1983, 8, 29),
    death: null,
    events: [
      { date: d(2023, 1, 1), type: PRESIDENCY_BEGINS, text: "First donkey president; scroll-to-data modernisation" }
    ]
  }
];



const NITOPIA_MONARCHS: Monarch[] = [
  {
    name: "King Loo Loo I Lop",
    birth: d(1530, 1, 24),
    death: d(1600, 9, 12),
    death_cause: "Old age",
    start_reign: d(1560, 1, 1),
    end_reign: d(1600, 9, 12),
    notes: "Founder of Nitopia; united wool provinces and established the capital at Needles."
  },
  {
    name: "King Woolbrain I",
    birth: d(1554, 11, 15),
    death: d(1604, 9, 5),
    death_cause: "Fever",
    start_reign: d(1600, 9, 12),
    end_reign: d(1604, 9, 5),
    notes: "Expanded fleece trade and built the first royal granaries in Needles."
  },
  {
    name: "King Baahman I",
    birth: d(1569, 7, 24),
    death: d(1625, 6, 25),
    death_cause: "Heart failure",
    start_reign: d(1604, 9, 5),
    end_reign: d(1625, 6, 25),
    notes: "Brother of Woolbrain I; founded the Council of Scrolls and established early diplomacy with Aerobea."
  },
  {
    name: "King Loo Loo II Lop",
    birth: d(1570, 6, 1),
    death: d(1633, 4, 22),
    death_cause: "Killed in the crash of Zoom Air Flight 378",
    start_reign: d(1625, 6, 25),
    end_reign: d(1633, 4, 22),
    notes: "Died in the 1633 airship disaster with poet Butter Chum; remembered as 'Loo Loo the Lost'."
  },
  {
    name: "King Baahman II",
    birth: d(1618, 7, 2),
    death: d(1680, 8, 4),
    death_cause: "Natural causes",
    start_reign: d(1633, 4, 22),
    end_reign: d(1680, 8, 4),
    notes: "Restored calm after Loo Loo II's death; introduced fair fog-tax reforms."
  },
  {
    name: "King Woolbrain II",
    birth: d(1648, 8, 23),
    death: d(1709, 9, 6),
    death_cause: "Blood infection",
    start_reign: d(1680, 8, 4),
    end_reign: d(1709, 9, 6),
    notes: "Known as 'Woolbrain the Clean'; introduced hygiene laws and standardised wool measures."
  },
  {
    name: "King Baahman III",
    birth: d(1658, 4, 26),
    death: d(1720, 9, 3),
    death_cause: "Stroke",
    start_reign: d(1709, 9, 6),
    end_reign: d(1720, 9, 3),
    notes: "Philosopher-king who founded Needles University and promoted plain-language law."
  },
  {
    name: "King John Woolman",
    birth: d(1694, 5, 15),
    death: d(1764, 8, 24),
    death_cause: "Old age",
    start_reign: d(1720, 9, 3),
    end_reign: d(1764, 8, 24),
    notes: "A humble and practical ruler; abolished fleece tithe and championed equality among herders."
  },
  {
    name: "King Baahman IV",
    birth: d(1725, 5, 6),
    death: d(1809, 8, 25),
    death_cause: "Old age",
    start_reign: d(1764, 8, 24),
    end_reign: d(1809, 8, 25),
    notes: "Longest-reigning monarch; remembered as 'Baahman the Peaceful' of the Golden Fleece Era."
  },
  {
    name: "King Baahman V",
    birth: d(1770, 3, 22),
    death: d(1810, 9, 3),
    death_cause: "Assassinated at harvest banquet",
    start_reign: d(1809, 8, 25),
    end_reign: d(1810, 9, 3),
    notes: "Poet-king known for gentleness and art; his death is mourned as the Lantern of Mercy tragedy."
  },
  {
    name: "King Baahman VI",
    birth: d(1780, 7, 1),
    death: d(1828, 8, 2),
    death_cause: "Killed in blimp crash (King's Dream airship)",
    start_reign: d(1810, 9, 3),
    end_reign: d(1828, 8, 2),
    notes: "Visionary inventor; built the first fog-powered airship, dying during its maiden voyage."
  },
  {
    name: "King Jorvic I",
    birth: d(1810, 8, 5),
    death: d(1878, 8, 5),
    death_cause: "Heart attack on his birthday",
    start_reign: d(1828, 8, 2),
    end_reign: d(1843, 1, 1),
    notes: "Accepted transition to republic; first ceremonial monarch; beloved as 'The Shepherd-King'."
  },
  {
    name: "King Jorvic II",
    birth: d(1815, 8, 24),
    death: d(1890, 7, 23),
    death_cause: "Lung failure after balloon accident",
    start_reign: d(1878, 8, 5),
    end_reign: d(1890, 7, 23),
    notes: "Nicknamed 'Jorvic the Fast'; sponsored balloon flight experiments and modern communication towers."
  },
  {
    name: "Queen Lamberta",
    birth: d(1860, 5, 2),
    death: d(1948, 9, 27),
    death_cause: "Pneumonia",
    start_reign: d(1890, 7, 23),
    end_reign: d(1948, 9, 27),
    notes: "Long-lived queen; industrial reformer who brought Nitopia into the 20th century."
  },
  {
    name: "King Loo I",
    birth: d(1880, 6, 24),
    death: d(1948, 10, 31),
    death_cause: "Heart failure",
    start_reign: d(1948, 9, 27),
    end_reign: d(1948, 10, 31),
    notes: "Reigned just over a month; served as bridge between Lamberta and the modern Loo line."
  },
  {
    name: "King Loo II",
    birth: d(1909, 9, 12),
    death: d(1987, 9, 22),
    death_cause: "Natural causes",
    start_reign: d(1948, 10, 31),
    end_reign: d(1987, 9, 22),
    notes: "Guided postwar reconstruction; remembered as 'Loo the Steady' for decades of peace."
  },
  {
    name: "King Loo III",
    birth: d(1927, 8, 3),
    death: d(2009, 8, 1),
    death_cause: "Old age",
    start_reign: d(1987, 9, 22),
    end_reign: d(2009, 8, 1),
    notes: "A humble moderniser; opened government archives and promoted education for all citizens."
  },
  {
    name: "King Loo IV",
    birth: d(1945, 5, 24),
    death: d(2018, 7, 6),
    death_cause: "Heart complications after surgery",
    start_reign: d(2009, 8, 1),
    end_reign: d(2018, 7, 6),
    notes: "Oversaw Nitopia's entry into the digital age; environmental advocate and reformer."
  },
  {
    name: "King Loo V",
    birth: d(1980, 1, 24),
    death: null,
    death_cause: null,
    start_reign: d(2018, 7, 6),
    end_reign: null,
    notes: "Current monarch; ceremonial eco-king working alongside President Andy Nittalot; promotes environmental diplomacy and cultural unity."
  }
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
