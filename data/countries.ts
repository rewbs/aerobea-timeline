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
      "birth": d(1801,1,1),
      "death": d(1875,1,1),
      "events": [
        { "date": d(1843,1,1), "type": PRESIDENCY_BEGINS, "text": "First president of the Nitopian Republic" },
        { "date": d(1851,1,1), "type": PRESIDENCY_ENDS, "text": "Retired from office" },
        { "date": d(1875,1,1), "type": DEATH, "text": "Died aged 74" }
      ]
    },
    {
      "name": "Tannon Moofield",
      "party": "ZXMO Party",
      "birth": d(1813,1,1),
      "death": d(1896,1,1),
      "events": [
        { "date": d(1851,1,1), "type": PRESIDENCY_BEGINS, "text": "Succeeded Woolcrest" },
        { "date": d(1859,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": d(1896,1,1), "type": DEATH, "text": "Died aged 83" }
      ]
    },
    {
      "name": "Grissel Fleecehorn",
      "party": "Ghanaio Party",
      "birth": d(1817,1,1),
      "death": d(1894,1,1),
      "events": [
        { "date": d(1859,1,1), "type": PRESIDENCY_BEGINS, "text": "Elected; promoted wool hygiene reforms" },
        { "date": d(1867,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": d(1894,1,1), "type": DEATH, "text": "Died aged 77" }
      ]
    },
    {
      "name": "Morric Haystrand",
      "party": "ZXMO Party",
      "birth": d(1824,1,1),
      "death": d(1901,1,1),
      "events": [
        { "date": d(1867,1,1), "type": PRESIDENCY_BEGINS, "text": "Elected; balanced fog levies" },
        { "date": d(1875,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": d(1901,1,1), "type": DEATH, "text": "Died aged 76" }
      ]
    },
    {
      "name": "Farlan Shearback",
      "party": "Ghanaio Party",
      "birth": d(1824,1,1),
      "death": d(1899,1,1),
      "events": [
        { "date": d(1875,1,1), "type": PRESIDENCY_BEGINS, "text": "Expanded Needles as capital" },
        { "date": d(1883,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": d(1899,1,1), "type": DEATH, "text": "Died aged 75" }
      ]
    },
    {
      "name": "Jorvic Moo",
      "party": "ZXMO Party",
      "birth": d(1832,1,1),
      "death": d(1904,1,1),
      "events": [
        { "date": d(1883,1,1), "type": PRESIDENCY_BEGINS, "text": "Elected; strengthened financial order" },
        { "date": d(1891,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": d(1904,1,1), "type": DEATH, "text": "Died aged 72" }
      ]
    },
    {
      "name": "Derrin Woolmantle",
      "party": "Ghanaio Party",
      "birth": d(1837,1,1),
      "death": d(1903,1,1),
      "events": [
        { "date": d(1891,1,1), "type": PRESIDENCY_BEGINS, "text": "Attempted fog-tax reforms" },
        { "date": d(1899,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": d(1903,1,1), "type": DEATH, "text": "Died aged 66" }
      ]
    },
    {
      "name": "Halvar Moo - Mooson Peak",
      "party": "ZXMO Party",
      "birth": d(1842,1,1),
      "death": d(1924,1,1),
      "events": [
        { "date": d(1899,1,1), "type": PRESIDENCY_BEGINS, "text": "Elected; first Nitopian president photographed" },
        { "date": d(1909,1,1), "type": PRESIDENCY_ENDS, "text": "Last First Republic president" },
        { "date": d(1924,1,1), "type": DEATH, "text": "Died aged 82" }
      ]
    },

    {
      "name": "Flann Woolbarrel",
      "party": "Fleece Party",
      "birth": d(1879,5,10),
      "death": d(1930,1,1),
      "events": [
        { "date": d(1909,1,1), "type": PRESIDENCY_BEGINS, "text": "Father of the Nitopian Constitution" },
        { "date": d(1917,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": d(1930,1,1), "type": DEATH, "text": "Died aged 50 of pneumonia" }
      ]
    },
    {
      "name": "Crispin Lintmane",
      "party": "Organisational Conservative Party",
      "birth": d(1882,9,9),
      "death": d(1940,12,27),
      "events": [
        { "date": d(1917,1,1), "type": PRESIDENCY_BEGINS, "text": "Founded Silent Rotation Council" },
        { "date": d(1925,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": d(1940,1,1), "type": DEATH, "text": "Died aged 58 of respiratory illness" }
      ]
    },
    {
      "name": "Mabel Fluffback",
      "party": "Fleece Party",
      "birth": d(1890,1,28),
      "death": d(1958,10,29),
      "events": [
        { "date": d(1925,1,1), "type": PRESIDENCY_BEGINS, "text": "First female president; Clean Fleece Program" },
        { "date": d(1934,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": d(1958,1,1), "type": DEATH, "text": "Died aged 68" }
      ]
    },
    {
      "name": "Lossa Milco",
      "party": "Cow Party",
      "birth": d(1895,5,23),
      "death": d(1978,6,2),
      "events": [
        { "date": d(1934,1,1), "type": PRESIDENCY_BEGINS, "text": "Brokered Fog-Trough Accords with Aerobea" },
        { "date": d(1947,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": d(1978,1,1), "type": DEATH, "text": "Died aged 83" }
      ]
    },
    {
      "name": "Kero Mason",
      "party": "Organisational Conservative Party",
      "birth": d(1901,1,1),
      "death": d(1986,1,1),
      "events": [
        { "date": d(1947,1,1), "type": PRESIDENCY_BEGINS, "text": "Centralised fog permits" },
        { "date": d(1955,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": d(1986,1,1), "type": DEATH, "text": "Died aged 85" }
      ]
    },
    {
      "name": "Coiler Jacxs",
      "party": "Republican Fogpipe Party",
      "birth": d(1911,3 14),
      "death": d(2006,1,1),
      "events": [
        { "date": d(1955,1,1), "type": PRESIDENCY_BEGINS, "text": "Elected; ritual Fogpipe era" },
        { "date": d(1957,1,1), "type": PRESIDENCY_ENDS, "text": "Removed; party banned after Scroll Clog Incident" },
        { "date": d(2006,1,1), "type": DEATH, "text": "Died aged 95" }
      ]
    },
    {
      "name": "Moo 17",
      "party": "Cow Party",
      "birth": d(1923,1,1),
      "death": d(1981,1,1),
      "events": [
        { "date": d(1957,1,1), "type": PRESIDENCY_BEGINS, "text": "Introduced 'Four Fences' bans" },
        { "date": d(1963,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" },
        { "date": d(1976,1,1), "type": PRESIDENCY_BEGINS, "text": "Returned to office" },
        { "date": d(1981,1,1), "type": PRESIDENCY_ENDS, "text": "Died in office (air crash)" },
        { "date": d(1981,1,1), "type": DEATH, "text": "Died aged 57 in plane crash" }
      ]
    },
    {
      "name": "Ulf Moolf",
      "party": "Goat Party",
      "birth": d(1929,1,1),
      "death": null,
      "events": [
        { "date": d(1963,1,1), "type": PRESIDENCY_BEGINS, "text": "Elected; rural reforms" },
        { "date": d(1975,1,1), "type": PRESIDENCY_ENDS, "text": "Retired from office" }
      ]
    },
    {
      "name": "James Jones Loo Moo",
      "party": "Organisational Conservative Party",
      "birth": d(1921,1,1),
      "death": d(2004,1,1),
      "events": [
        { "date": d(1975,1,1), "type": PRESIDENCY_BEGINS, "text": "Caretaker during instability" },
        { "date": d(1976,1,1), "type": PRESIDENCY_ENDS, "text": "Stepped down" },
        { "date": d(2004,1,1), "type": DEATH, "text": "Died aged 83" }
      ]
    },
    {
      "name": "Helmut Moo",
      "party": "Cow Party",
      "birth": d(1930,1,1),
      "death": d(1999,1,1),
      "events": [
        { "date": d(1981,1,1), "type": PRESIDENCY_BEGINS, "text": "Acting president after Moo 17’s death" },
        { "date": d(1981,1,1), "type": PRESIDENCY_ENDS, "text": "Caretaker term ended" },
        { "date": d(1999,1,1), "type": DEATH, "text": "Died aged 68" }
      ]
    },
    {
      "name": "Molly Moo",
      "party": "Cow Party",
      "birth": d(1935,1,1),
      "death": null,
      "events": [
        { "date": d(1981,1,1), "type": PRESIDENCY_BEGINS, "text": "Elected; long stabilising presidency" },
        { "date": d(1996,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Edward Mooson Peak",
      "party": "United Party",
      "birth": d(1941,1,1),
      "death": null,
      "events": [
        { "date": d(1996,1,1), "type": PRESIDENCY_BEGINS, "text": "Introduced universal scroll welfare" },
        { "date": d(2004,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Moo 18 - John Moo",
      "party": "Cow Party",
      "birth": d(1958,1,1),
      "death": null,
      "events": [
        { "date": d(2004,1,1), "type": PRESIDENCY_BEGINS, "text": "Elected; Milk-Scroll Initiative" },
        { "date": d(2012,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Bertha Baahman Woolsen",
      "party": "Fleece Party",
      "birth": d(1960,1,1),
      "death": d(2014,1,1),
      "events": [
        { "date": d(2012,1,1), "type": PRESIDENCY_BEGINS, "text": "Elected; champion of inclusivity" },
        { "date": d(2014,1,1), "type": PRESIDENCY_ENDS, "text": "Assassinated by scroll-trap" },
        { "date": d(2014,1,1), "type": DEATH, "text": "Died aged 53" }
      ]
    },
    {
      "name": "Herbert Mooson Peak",
      "party": "United Party",
      "birth": d(1964,1,1),
      "death": null,
      "events": [
        { "date": d(2014,1,1), "type": PRESIDENCY_BEGINS, "text": "Acting president after Bertha’s assassination" },
        { "date": d(2014,1,1), "type": PRESIDENCY_ENDS, "text": "Caretaker term ended" }
      ]
    },
    {
      "name": "Ally the Alpaca",
      "party": "Alpaca Justice Party",
      "birth": d(1987,1,1),
      "death": null,
      "events": [
        { "date": d(2014,1,1), "type": PRESIDENCY_BEGINS, "text": "First alpaca president" },
        { "date": d(2015,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Moploxoo Mala",
      "party": "United Party",
      "birth": d(1965,1,1),
      "death": null,
      "events": [
        { "date": d(2015,1,1), "type": PRESIDENCY_BEGINS, "text": "Fog literacy and pasture-scroll equity" },
        { "date": d(2019,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" }
      ]
    },
    {
      "name": "Losca Molpoa",
      "party": "Goat Party",
      "birth": d(1977,1,1),
      "death": null,
      "events": [
        { "date": d(2019,1,1), "type": PRESIDENCY_BEGINS, "text": "Legalised scroll skipping" },
        { "date": d(2023,1,1), "type": PRESIDENCY_ENDS, "text": "Term ended" }
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
