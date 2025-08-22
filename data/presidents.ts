export const START = 1672;
export const END = 2025;
export const PRESIDENCY_BEGINS = 1;
export const PRESIDENCY_ENDS = 2;

export type EventType = typeof PRESIDENCY_BEGINS | typeof PRESIDENCY_ENDS;

export interface TimelineEvent {
  year: number;
  type?: EventType;
  text: string;
}

export interface President {
  name: string;
  party: string;
  birth: number;
  death: number | null;
  events: TimelineEvent[];
}

export const PRESIDENTS: President[] = [
  {
    name: "Baahram Edward Lincoln the Elder",
    party: "Whig",
    birth: 1674,
    death: 1735,
    events: [
      { year: 1701, text: "Elected as first President of Aerobea" },
      { year: 1702, type: PRESIDENCY_BEGINS, text: "Sworn into office" },
      { year: 1722, type: PRESIDENCY_ENDS, text: "Resigned from office" }
    ]
  },
  {
    name: "Robert Crumbleton",
    party: "Whig",
    birth: 1698,
    death: 1765,
    events: [
      { year: 1722, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1727, type: PRESIDENCY_ENDS, text: "Lost re-election" }
    ]
  },
  {
    name: "Ferito Beoe",
    party: "Conservative",
    birth: 1672,
    death: 1731,
    events: [
      { year: 1727, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1731, type: PRESIDENCY_ENDS, text: "assassinated" }
    ]
  },
  {
    name: "joh gumn nocks",
    party: "skyborne font",
    birth: 1693,
    death: 1760,
    events: [
      { year: 1731, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1745, type: PRESIDENCY_ENDS, text: "stepped down" }
    ]
  },
  {
    name: "Valu Jezza",
    party: "Labour",
    birth: 1708,
    death: 1779,
    events: [
      { year: 1745, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1761, type: PRESIDENCY_ENDS, text: "Resigned" }
    ]
  },
  {
    name: "Commander Nullglyph",
    party: "Whig",
    birth: 1717,
    death: 1797,
    events: [
      { year: 1761, type: PRESIDENCY_BEGINS, text: "Assumed office" },
      { year: 1779, type: PRESIDENCY_ENDS, text: "Resigned in favour of Conservative Party" },
      { year:1785, type: PRESIDENCY_BEGINS, text: "Re-Elected" },
      { year: 1787, type: PRESIDENCY_ENDS, text: "Retired" }
    ]
  },
  {
    name: "benjamin jones",
    party: "conservative",
    birth: 1730,
    death: 1806,
    events: [
      { year: 1779, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1785, type: PRESIDENCY_ENDS, text: "Stepped down" },
      { year: 1794, type: PRESIDENCY_BEGINS, text: "Re-elected" },
      { year: 1796, type: PRESIDENCY_ENDS, text: "Loses re-elections" },
    ]
  },
  {
    name: "Jammes Jaglianviac",
    party: "Conservative",
    birth: 1717,
    death: 1798,
    events: [
      { year: 1785, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1794, type: PRESIDENCY_ENDS, text: "Resigned due to age" }
    ]
  },
  {
    name: "Stanley Roberts",
    party: "Conservative",
    birth: 1752,
    death: 1827,
    events: [
      { year: 1796, type: PRESIDENCY_BEGINS, text: "Appointed Acting President" },
      { year: 1812, type: PRESIDENCY_ENDS, text: "Stepped down" }
    ]
  },
  {
    name: "'Jack Prawn",
    party: "Conservative",
    birth: 1773,
    death: 1818,
    events: [
      { year: 1812, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1818, type: PRESIDENCY_ENDS, text: "Poisoned" },
    ]
  },
  {
    name: "Barkley Thunderflap",
    party: "GSC",
    birth: 1766,
    death: 1830,
    events: [
      { year: 1818, type: PRESIDENCY_BEGINS, text: "Appointed Acting President (GSC-aligned dog)" },
      { year: 1821, type: PRESIDENCY_ENDS, text: "Resigned" }
    ]
  },
  {
    name: "Argent Landriano",
    party: "GSC",
    birth: 1782,
    death: 1850,
    events: [
      { year: 1821, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1833, type: PRESIDENCY_ENDS, text: "Lost re-election" },
      { year: 1834, type: PRESIDENCY_BEGINS, text: "Re-elected" },
      { year: 1840, type: PRESIDENCY_ENDS, text: "Lost re-election" }
    ]
  },
  {
    name: "Samuel Dinken",
    party: "GSC",
    birth: 1804,
    death: 1882,
    events: [
      { year: 1840, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1857, type: PRESIDENCY_ENDS, text: "Resigned" }
    ]
  },
  {
    name: "Hasfn Deidon",
    party: "Donex",
    birth: 1824,
    death: 1892,
    events: [
      { year: 1857, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1868, type: PRESIDENCY_ENDS, text: "Lost re-election" }
    ]
  },
  {
    name: "Anavi Giton",
    party: "Donex",
    birth: 1839,
    death: 1907,
    events: [
      { year: 1868, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1870, type: PRESIDENCY_ENDS, text: "Lost re-election" }
    ]
  },
  {
    name: "Adolf O'Skribe",
    party: "Labour",
    birth: 1825,
    death: 1902,
    events: [
      { year: 1870, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1871, type: PRESIDENCY_ENDS, text: "Assassinated" }
    ]
  },
  {
    name: "Jaayck Slecklson",
    party: "GSC",
    birth: 1836,
    death: 1912,
    events: [
      { year: 1871, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1875, type: PRESIDENCY_ENDS, text: "Impeached" }
    ]
  },
  {
    name: "Hed Crover",
    party: "Conservative",
    birth: 1845,
    death: 1917,
    events: [
      { year: 1875, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1879, type: PRESIDENCY_ENDS, text: "Resigned" }
    ]
  },
  {
    name: "Mark Sonfee",
    party: "Conservative",
    birth: 1850,
    death: 1923,
    events: [
      { year: 1879, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1885, type: PRESIDENCY_ENDS, text: "Lost re-election" }
    ]
  },
  {
    name: "Brigham Josdaq",
    party: "Conservative",
    birth: 1856,
    death: 1928,
    events: [
      { year: 1885, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1899, type: PRESIDENCY_ENDS, text: "Term ended" }
    ]
  },
  {
    name: "Parthenia Neen",
    party: "Conservative",
    birth: 1867,
    death: 1957,
    events: [
      { year: 1899, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1910, type: PRESIDENCY_ENDS, text: "Retired" }
    ]
  },
  {
    name: "Anamalo Synth",
    party: "labour",
    birth: 1871,
    death: 1959,
    events: [
      { year: 1910, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1920, type: PRESIDENCY_ENDS, text: "retired" }
    ]
  },
  {
    name: "Rob Reddik",
    party: "conservative",
    birth: 1867,
    death: 1930,
    events: [
      { year: 1920, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1929, type: PRESIDENCY_ENDS, text: "Lost re-election" },
    ]
  },
  {
    name: "Avae Romrowabala",
    party: "labour",
    birth: 1887,
    death: 1970,
    events: [
      { year: 1929, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1947, type: PRESIDENCY_ENDS, text: "Kicked out" },
      { year: 1948, type: PRESIDENCY_BEGINS, text: "Resumed office" },
      { year: 1954, type: PRESIDENCY_ENDS, text: "Retired" }
    ]
  },
  {
    name: "Edwin Peak",
    party: "conservative",
    birth: 1904,
    death: 1992,
    events: [
      { year: 1947, type: PRESIDENCY_BEGINS, text: "Seized power" },
      { year: 1948, type: PRESIDENCY_ENDS, text: "Overthrown" },
    ]
  },
  {
    name: "Alec Oven",
    party: "DONEX",
    birth: 1924,
    death: 1980,
    events: [
      { year: 1954, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1957, type: PRESIDENCY_ENDS, text: "Term ended" }
    ]
  },
  {
    name: "Avia Gow",
    party: "skyborne font",
    birth: 1933,
    death: null,
    events: [
      { year: 1957, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1965, type: PRESIDENCY_ENDS, text: "Term ended" }
    ]
  },
  {
    name: "Ajaxio Collad",
    party:"snackalist",
    birth: 1915,
    death: 1989,
    events: [
      { year: 1965, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1967, type: PRESIDENCY_ENDS, text: "Lost re-election" }
    ]
  },
  {
    name: "Ajaysoionvasao Foallowa",
    party:"labour",
    birth: 1931,
    death: null,
    events: [
      { year: 1967, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1981, type: PRESIDENCY_ENDS, text: "Term ended" }
    ]
  },
  {
    name: "Herbert Lovvbert",
    party:"labour",
    birth: 1927,
    death: null,
    events: [
      { year: 1981, type:PRESIDENCY_BEGINS, text: "Elected 1981 but for a few days only" },
      { year: 1981, type:PRESIDENCY_ENDS, text: "Elected 1981 but for a few days only" },
      { year: 1988, type:PRESIDENCY_BEGINS, text: "Re-elected" },
      { year: 2023, type:PRESIDENCY_ENDS, text: "Retired" }
    ]
  },
  {
    name: "Effesi Collad",
    party:"snackalist",
    birth: 1950,
    death: null,
    events: [
      { year: 1981, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1988, type: PRESIDENCY_ENDS, text: "Lost election" }
    ]
  },
  {
    name: "Baahram Linco",
    party: "labour",
    birth: 1979,
    death: null,
    events: [
      { year: 2023, type: PRESIDENCY_BEGINS, text: "Elected" }
    ]
  }
];
export function isPresident(year: number, president: President): boolean {
  const begins = president.events.filter(e => e.type === PRESIDENCY_BEGINS);
  const ends = president.events.filter(e => e.type === PRESIDENCY_ENDS);
  begins.sort((a, b) => a.year - b.year);
  ends.sort((a, b) => a.year - b.year);
  for (let i = 0; i < begins.length; i++) {
    const start = begins[i].year;
    const end = (ends[i]?.year ?? Infinity) - 1;
    if (year >= start && year <= end) return true;
  }
  return false;
}

