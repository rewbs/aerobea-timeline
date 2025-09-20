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
      "name": "Bertram Woolcrest",
      "party": "Ghanaio Party",
      "birth": "d(1801, 4, 24)",
      "death": "d(1875, 9, 2)",
      "cause_of_death": "Deep Scroll Mecholisa cancer",
      "events": [
        { "date": "d(1843, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "First president of the Nitopian Republic" },
        { "date": "d(1851, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Retired from office" }
      ]
    },
    {
      "name": "Tannon Moofield",
      "party": "ZXMO Party",
      "birth": "d(1813, 3, 25)",
      "death": "d(1896, 9, 27)",
      "cause_of_death": "Heart failure",
      "events": [
        { "date": "d(1851, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Succeeded Woolcrest" },
        { "date": "d(1859, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Grissel Fleecehorn",
      "party": "Ghanaio Party",
      "birth": "d(1817, 7, 24)",
      "death": "d(1894, 7, 3)",
      "cause_of_death": "Pneumonia",
      "events": [
        { "date": "d(1859, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Promoted wool hygiene reforms" },
        { "date": "d(1867, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Morric Haystrand",
      "party": "ZXMO Party",
      "birth": "d(1824, 11, 26)",
      "death": "d(1901, 8, 3)",
      "cause_of_death": "Stroke",
      "events": [
        { "date": "d(1867, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Balanced fog levies" },
        { "date": "d(1875, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Farlan Shearback",
      "party": "Ghanaio Party",
      "birth": "d(1824, 2, 28)",
      "death": "d(1899, 8, 24)",
      "cause_of_death": "Fog-lung disease",
      "events": [
        { "date": "d(1875, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Expanded Needles institutions" },
        { "date": "d(1883, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Jorvic Moo",
      "party": "ZXMO Party",
      "birth": "d(1832, 1, 25)",
      "death": "d(1904, 7, 3)",
      "cause_of_death": "Cerebral haemorrhage",
      "events": [
        { "date": "d(1883, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Strengthened financial order" },
        { "date": "d(1891, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Derrin Woolmantle",
      "party": "Ghanaio Party",
      "birth": "d(1837, 8, 24)",
      "death": "d(1903, 9, 29)",
      "cause_of_death": "Fog-fever epidemic",
      "events": [
        { "date": "d(1891, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Attempted fog-tax reforms" },
        { "date": "d(1899, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Halvar Moo (Mooson Peak)",
      "party": "ZXMO Party",
      "birth": "d(1842, 2, 25)",
      "death": "d(1924, 8, 23)",
      "cause_of_death": "Heart failure",
      "events": [
        { "date": "d(1899, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "First photographed president" },
        { "date": "d(1909, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Last First Republic president" }
      ]
    },
    {
      "name": "Flann Woolbarrel",
      "party": "Fleece Party",
      "birth": "d(1879, 5, 10)",
      "death": "d(1930, 2, 2)",
      "cause_of_death": "Pneumonia",
      "events": [
        { "date": "d(1909, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Authored the Nitopian Constitution" },
        { "date": "d(1917, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Crispin Lintmane",
      "party": "Organisational Conservative Party",
      "birth": "d(1882, 9, 9)",
      "death": "d(1940, 12, 27)",
      "cause_of_death": "Respiratory illness (scroll-mould infection)",
      "events": [
        { "date": "d(1917, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Founded Silent Rotation Council" },
        { "date": "d(1925, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Mabel Fluffback",
      "party": "Fleece Party",
      "birth": "d(1890, 1, 28)",
      "death": "d(1958, 10, 29)",
      "cause_of_death": "Stroke",
      "events": [
        { "date": "d(1925, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "First female president" },
        { "date": "d(1934, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Lossa Milco",
      "party": "Cow Party",
      "birth": "d(1895, 5, 23)",
      "death": "d(1978, 7, 4)",
      "cause_of_death": "Heart disease",
      "events": [
        { "date": "d(1934, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Brokered Fog-Trough Accords" },
        { "date": "d(1947, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Kero Mason",
      "party": "Organisational Conservative Party",
      "birth": "d(1901, 3, 25)",
      "death": "d(1986, 1, 1)",
      "cause_of_death": "Kidney failure",
      "events": [
        { "date": "d(1947, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Centralised fog permits" },
        { "date": "d(1955, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Coiler Jacxs",
      "party": "Republican Fogpipe Party",
      "birth": "d(1911, 1, 1)",
      "death": "d(2006, 1, 1)",
      "cause_of_death": "Natural causes",
      "events": [
        { "date": "d(1955, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Ritual fogpipe era" },
        { "date": "d(1957, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Party banned after Scroll Clog Incident" }
      ]
    },
    {
      "name": "Moo 17",
      "party": "Cow Party",
      "birth": "d(1923, 7, 27)",
      "death": "d(1981, 4, 21)",
      "cause_of_death": "Plane crash (smoke detector failure)",
      "events": [
        { "date": "d(1957, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Introduced 'Four Fences' bans" },
        { "date": "d(1963, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": "d(1976, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Returned to office" },
        { "date": "d(1981, 4, 21)", "type": PRESIDENCY_ENDS, "text": "Died in office" }
      ]
    },
    {
      "name": "Ulf Moolf",
      "party": "Goat Party",
      "birth": "d(1929, 5, 7)",
      "death": null,
      "cause_of_death": null,
      "events": [
        { "date": "d(1963, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Rural reforms" },
        { "date": "d(1975, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Retired from office" }
      ]
    },
    {
      "name": "James Jones Loo Moo",
      "party": "Organisational Conservative Party",
      "birth": "d(1921, 2, 20)",
      "death": "d(2004, 8, 7)",
      "cause_of_death": "Heatstroke",
      "events": [
        { "date": "d(1975, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Caretaker president" },
        { "date": "d(1976, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Stepped down" }
      ]
    },
    {
      "name": "Helmut Moo",
      "party": "Cow Party",
      "birth": "d(1930, 7, 5)",
      "death": "d(1999, 7, 4)",
      "cause_of_death": "Lung cancer",
      "events": [
        { "date": "d(1981, 4, 21)", "type": PRESIDENCY_BEGINS, "text": "Acting after Moo 17’s death" },
        { "date": "d(1981, 12, 31)", "type": PRESIDENCY_ENDS, "text": "Caretaker term ended" }
      ]
    },
    {
      "name": "Molly Moo",
      "party": "Cow Party",
      "birth": "d(1935, 1, 1)",
      "death": null,
      "cause_of_death": null,
      "events": [
        { "date": "d(1981, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Elected; expanded oatworker rights" },
        { "date": "d(1996, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Retired from office" }
      ]
    },
    {
      "name": "Edward Mooson Peak",
      "party": "United Party",
      "birth": "d(1941, 3, 8)",
      "death": null,
      "cause_of_death": null,
      "events": [
        { "date": "d(1996, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Introduced universal scroll welfare" },
        { "date": "d(2004, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Moo 18 (John Moo)",
      "party": "Cow Party",
      "birth": "d(1958, 1, 1)",
      "death": null,
      "cause_of_death": null,
      "events": [
        { "date": "d(2004, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Milk-Scroll Initiative" },
        { "date": "d(2012, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Bertha Baahman Woolsen",
      "party": "Fleece Party",
      "birth": "d(1960, 5, 19)",
      "death": "d(2014, 3, 4)",
      "cause_of_death": "Assassinated by scroll-trap",
      "events": [
        { "date": "d(2012, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Champion of inclusivity" },
        { "date": "d(2014, 3, 4)", "type": PRESIDENCY_ENDS, "text": "Assassinated in office" }
      ]
    },
    {
      "name": "Herbert Mooson Peak",
      "party": "United Party",
      "birth": "d(1964, 12, 12)",
      "death": null,
      "cause_of_death": null,
      "events": [
        { "date": "d(2014, 3, 5)", "type": PRESIDENCY_BEGINS, "text": "Acting president after Bertha’s death" },
        { "date": "d(2014, 12, 31)", "type": PRESIDENCY_ENDS, "text": "Caretaker term ended" }
      ]
    },
    {
      "name": "Ally the Alpaca",
      "party": "Alpaca Justice Party",
      "birth": "d(1987, 1, 1)",
      "death": null,
      "cause_of_death": null,
      "events": [
        { "date": "d(2014, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "First alpaca president" },
        { "date": "d(2015, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Moploxoo Mala",
      "party": "United Party",
      "birth": "d(1965, 1, 1)",
      "death": null,
      "cause_of_death": null,
      "events": [
        { "date": "d(2015, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Fog literacy and pasture-scroll equity" },
        { "date": "d(2019, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Losca Molpoa",
      "party": "Goat Party",
      "birth": "d(1977, 1, 1)",
      "death": null,
      "cause_of_death": null,
      "events": [
        { "date": "d(2019, 1, 1)", "type": PRESIDENCY_BEGINS, "text": "Legalised scroll skipping" },
        { "date": "d(2023, 1, 1)", "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Andy Nittalot",
      "party": "United Party",
      "birth": d(1983,1,1),
      "death": null,
      "events": [
        { "date": d(2023,1,1), "type": PRESIDENCY_BEGINS, "text": "First donkey president; scroll-to-data modernisation" }
      ]
    }
  ]



const NITOPIA_MONARCHS: Monarch[] = [
    {
      "name": "King Loo XII",
      "birth": 1748,
      "death": 1815,
      "cause_of_death": "Stroke",
      "reign_start": 1800,
      "reign_end": 1815,
      "notes": "Ruler of Nitopia when Bertram Woolcrest was born in 1801. Expanded fog levies."
    },
    {
      "name": "King Loo XIII",
      "birth": 1785,
      "death": 1839,
      "cause_of_death": "Tuberculosis",
      "reign_start": 1815,
      "reign_end": 1839,
      "notes": "Presided over growing unrest between sheep and cow herds. Weak monarch who attempted limited reforms."
    },
    {
      "name": "King Loo XIV",
      "birth": 1810,
      "death": 1843,
      "cause_of_death": "Assassinated by graziers’ rebels",
      "reign_start": 1839,
      "reign_end": 1843,
      "notes": "The last ruling monarch of Nitopia. His assassination in Needles triggered the 1843 revolution and the birth of the Republic."
    },
    {
      "name": "King Loo XV",
      "birth": 1835,
      "death": 1890,
      "cause_of_death": "Pneumonia",
      "reign_start": 1843,
      "reign_end": 1890,
      "notes": "First ceremonial monarch of the Loo line after the monarchy lost power. Kept dynastic traditions alive."
    },
    {
      "name": "King Loo XVI",
      "birth": 1865,
      "death": 1935,
      "cause_of_death": "Stroke",
      "reign_start": 1890,
      "reign_end": 1935,
      "notes": "Ceremonial monarch during Flann Woolbarrel’s constitution and early Republic era."
    },
    {
      "name": "King Loo XVII",
      "birth": 1900,
      "death": 1987,
      "cause_of_death": "Heart failure",
      "reign_start": 1935,
      "reign_end": 1987,
      "notes": "A symbolic monarch during Nitopia’s turbulent 20th century. Abdicated ceremonial duties shortly before his death."
    },
    {
      "name": "King Loo XVIII",
      "birth": 1920,
      "death": 2007,
      "cause_of_death": "Natural causes",
      "reign_start": 1987,
      "reign_end": 1987,
      "notes": "Briefly recognised in 1987 as ceremonial monarch but abdicated the same year. Lived privately until 2007."
    },
    {
      "name": "King Loo XIX",
      "birth": 1950,
      "death": null,
      "cause_of_death": null,
      "reign_start": 1987,
      "reign_end": 2018,
      "notes": "Ceremonial monarch for three decades. Abdicated in 2018 but remains alive today. Attended Bertha the Sheep’s inauguration in 2012."
    },
    {
      "name": "King Loo XX",
      "birth": 1980,
      "death": null,
      "cause_of_death": null,
      "reign_start": 2018,
      "reign_end": null,
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
