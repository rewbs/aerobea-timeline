export const START = 1672;
export const END = 2025;
export const PRESIDENCY_BEGINS = 1;
export const PRESIDENCY_ENDS = 2;
export const DEATH = 3;

export type EventType = typeof PRESIDENCY_BEGINS | typeof PRESIDENCY_ENDS | typeof DEATH;

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


export const PRESIDENTS : President[] = [
  {
    name: "Baahram Edward Lincoln the Elder",
    party: "Whig",
    birth: 1674,
    death: 1735,
    events: [
      { year: 1701, text: "Elected as first President of Aerobea" },
      { year: 1702, type: PRESIDENCY_BEGINS, text: "Sworn into office" },
      { year: 1722, type: PRESIDENCY_ENDS, text: "Resigned from office" },
      { year: 1735, type: DEATH, text: "Died of  rare cancer" }

    ]
  },
  {
    name: "Robert Crumbleton",
    party: "Whig",
    birth: 1698,
    death: 1765,
    events: [
      { year: 1722, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1727, type: PRESIDENCY_ENDS, text: "Lost re-election" },
      { year:1765, type: DEATH, text: "Died of cerebral haemorrhage" }
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
    party: "liberal democratic",
    birth: 1693,
    death: 1760,
    events: [
      { year: 1731, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1745, type: PRESIDENCY_ENDS, text: "stepped down" },
      { year: 1760, type: DEATH, text: "Died of diabetes complications" }
    ]
  },  
  {
    name: "Valu Jezza",
    party: "Labour",
    birth: 1708,
    death: 1779,
    events: [
      { year: 1745, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1761, type: PRESIDENCY_ENDS, text: "Resigned" },
      { year: 1779, type: DEATH, text: "Died of typhoid fever" }
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
      { year: 1787, type: PRESIDENCY_ENDS, text: "Retired" },
      { year: 1797, type: DEATH, text: "Died of heart failure" }
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
      { year: 1806, type: DEATH, text: "Died of pneumonia" }  
    ]
  },
  {
    name: "Jammes Jaglianviac",
    party: "Conservative",
    birth: 1717,
    death: 1798,
    events: [
      { year: 1787, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1794, type: PRESIDENCY_ENDS, text: "Resigned due to age" },
      { year: 1798, type: DEATH, text: "Died of natural causes" }
    ]
  },
  {
    name: "Stanley Roberts",
    party: "Conservative",
    birth: 1752,
    death: 1827,
    events: [
      { year: 1796, type: PRESIDENCY_BEGINS, text: "Appointed Acting President" },
      { year: 1812, type: PRESIDENCY_ENDS, text: "Stepped down" },
      { year: 1827, type: DEATH, text: "Died of tuberculosis" }
    ]
  },
  {
    name: "Jack Prawn",
    party: "Conservative", 
    birth: 1773,
    death: 1818,
    events: [
      { year: 1812, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1818, type: PRESIDENCY_ENDS, text: "Poisoned" },
      { year: 1818, type: DEATH, text: "Died of poisoning" }
    ]
  },  

  {
    name: "Barkley Thunderflap",
    party: "GSC",
    birth: 1766,
    death: 1830,
    events: [
      { year: 1818, type: PRESIDENCY_BEGINS, text: "Appointed Acting President (GSC-aligned dog)" },
      { year: 1821, type: PRESIDENCY_ENDS, text: "Resigned" },
      { year: 1830, type: DEATH, text: "Died of hydration issues" },
    ]
  },
  {
    name: "Feathery Quill",
    party: "feather first",
    birth: 1791,
    death: 1821,
    events: [
      { year: 1821, type: PRESIDENCY_BEGINS, text: "served 6 symbolic days" },
      { year: 1821, type: PRESIDENCY_ENDS, text: "died crashing into a blimp while trying to fly", }
    ]
  },
  {
    name: "Oreo Joshon Boeoer",
    party: "socialist",
    birth: 1780,
    death: 1870,
    events: [
      { year: 1821, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1840, type: PRESIDENCY_ENDS, text: "Retired" },
      { year: 1870, type: DEATH, text: "Died of old age" }
    ]
  },
  {
    name: "Myreech Oiaboy",
    party: "whig",
    birth: 1824,
    death: 1917,
    events: [
      { year: 1840, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1853, type: PRESIDENCY_ENDS, text: "Stepped down" },
      { year: 1917, type: DEATH, text: "Died of old age" }
    ]
  },
  {
    name: "Tennisonopi Avots",
    party: "conservative",
    birth: 1798,
    death: 1863,
    events: [
      { year: 1853, type: PRESIDENCY_BEGINS, text: "Elected (by retroactive declaration)" },
      { year: 1863, type: PRESIDENCY_ENDS, text: "died of stroke" }
    ]
  },
  {
    name: "Spindle Gowlash",
    party: "radical",
    birth: 1839,
    death: 1910,
    events: [
      { year: 1863, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1869, type: PRESIDENCY_ENDS, text: "overthrown" },
      { year: 1910, type: DEATH, text: "died of flu" }
    ]
  },
  {
    name: "davi rovfe",
    party: "conservative",
    birth: 1840,
    death: 1906,
    events: [
      { year: 1869, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1889, type: PRESIDENCY_ENDS, text: "Resigned due to illness" },
      { year: 1906, type: DEATH, text: "died of scurvy" }
    ]
  },

  {
    name: "ben joinse",
    party: "whig",
    birth: 1859,
    death: 1948,
    events: [
      { year: 1889, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1899, type: PRESIDENCY_ENDS, text: "lost re election" },
      { year: 1948, type: DEATH, text: "died of dropsy" }
    ]
  },
  {
    name: "lila file",
    party: "independent",
    birth: 1867,
    death: 1957,
    events: [
      { year: 1899, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1910, type: PRESIDENCY_ENDS, text: "Retired" },
      { year: 1957, type: DEATH, text: "died of old age" }
    ]
  },
  {
    name: "Anamalo Synth",
    party: "labour",
    birth: 1871,
    death: 1959,
    events: [
      { year: 1910, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1920, type: PRESIDENCY_ENDS, text: "Resigned" },
      { year: 1959, type: DEATH, text: "died of stroke" }
    ]
  },
  {
    name: "Rob Reddik",
    party: "conservative",
    birth: 1863,
    death: 1930,
    events: [
      { year: 1920, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1929, type: PRESIDENCY_ENDS, text: "Lost re-election" },
      { year: 1930, type: DEATH, text: "died of kidney failure" }
    ]
  },    
  {
    name: "Avae Romrowabala",
    party: 'whig',
    birth: 1887,
    death: 1970,
    events: [
      { year: 1929, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1947, type: PRESIDENCY_ENDS, text: "Kicked out" },
      { year: 1948, type: PRESIDENCY_BEGINS, text: "Resumed office" },
      { year: 1954, type: PRESIDENCY_ENDS, text: "Retired" },
      { year: 1970, type: DEATH, text: "died of stomach cancer" }
    ]
  },
  {
    name: "Edwin Peak",
    birth: 1904,
    party: "conservative",
    death: 1992,
    events: [
      { year: 1947, type: PRESIDENCY_BEGINS, text: "Seized power" },
      { year: 1948, type: PRESIDENCY_ENDS, text: "Overthrown" },
      { year: 1992, type: DEATH, text: "died of old age" }
    ]
  },  
  {
    name: "Alec Oven",
    party: "DONEX",
    birth: 1924,
    death: 1980,
    events: [
      { year: 1954, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1957, type: PRESIDENCY_ENDS, text: "Term ended" },
      { year: 1980, type: DEATH, text: "died of  throat cancer" }
    ]
  },
  {
    name: "Avia Gow",
    birth: 1933,
    party: "liberal democratic",
    death: null,
    events: [
      { year: 1957, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1965, type: PRESIDENCY_ENDS, text: "Term ended" },
    ]
  },
  {
    name: "Ajaxio Collad",
    party:"snackalist",
    birth: 1915,
    death: 1989,
    events: [
      { year: 1965, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1967, type: PRESIDENCY_ENDS, text: "Lost re-election" },
      { year: 1989, type: DEATH, text: "died of heart attack" }
    ]
  },
  {
    name: "Ajaysoionvasao Foallowa",
    birth: 1931,
    party:"labour",
    death: null,
    events: [
      { year: 1967, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1981, type: PRESIDENCY_ENDS, text: "Term ended" },
    ]
  },
  {
    name: "Herbert Lovvbert",
    birth: 1951,
    party:"labour",
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
    birth: 1950,
    party:"snackalist",
    death: null,
    events: [
      { year: 1981, type: PRESIDENCY_BEGINS, text: "Elected" },
      { year: 1988, type: PRESIDENCY_ENDS, text: "Lost election" },
    ]
  },  
  {
    name: "Baahram Linco",
    party: "whig",
    birth: 1979,
    death: null,
    events: [
      { year: 2023, type: PRESIDENCY_BEGINS, text: "Elected" }
    ]
  }
];