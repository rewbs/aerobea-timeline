const d = (y: number, m = 1, day = 1) => new Date(Date.UTC(y, m - 1, day));
export const START = d(1672, 1, 1);
export const END = d(2025, 12, 31);
export const PRESIDENCY_BEGINS = 1;
export const PRESIDENCY_ENDS = 2;
export const DEATH = 3;

export type EventType = typeof PRESIDENCY_BEGINS | typeof PRESIDENCY_ENDS | typeof DEATH;

export interface TimelineEvent {
  date: Date;
  type?: EventType;
  text: string;
}

export interface President {
  name: string;
  party: string;
  birth: Date;
  death: Date | null;
  events: TimelineEvent[];
}

export function isPresident(date: Date, president: President): boolean {
  const begins = president.events.filter(e => e.type === PRESIDENCY_BEGINS);
  const ends = president.events.filter(e => e.type === PRESIDENCY_ENDS);
  begins.sort((a, b) => a.date.getTime() - b.date.getTime());
  ends.sort((a, b) => a.date.getTime() - b.date.getTime());
  const cur = date.getTime();
  for (let i = 0; i < begins.length; i++) {
    const start = begins[i].date.getTime();
    const end = (ends[i]?.date.getTime() ?? Infinity) - 1;
    if (cur >= start && cur <= end) return true;
  }
  return false;
}

export interface Monarch {
  name: string;
  birth: Date;
  death: Date | null;
  start_reign: Date;
  end_reign: Date | null;
  death_cause: string | null;
}

export function getMonarch(
  date: Date,
  monarchs: Monarch[]
): Monarch | undefined {
  return monarchs.find(
    m => date >= m.start_reign && (m.end_reign === null || date <= m.end_reign)
  );
}


export const PRESIDENTS : President[] = [
  {
    name: "Baahram Edward Lincoln the Elder",
    party: "Whig",
    birth: d(1674, 24, 3),
    death: d(1735, 28, 2),
    events: [
      { date: d(1701, 6, 25), text: "Elected as first President of Aerobea" },
      { date: d(1702, 6, 4), type: PRESIDENCY_BEGINS, text: "Sworn into office" },
      { date: d(1722, 10, 26), type: PRESIDENCY_ENDS, text: "Resigned from office" },
      { date: d(1735, 3, 12), type: DEATH, text: "Died of  blood cancer" }

    ]
  },
  {
    name: "Robert Crumbleton",
    party: "Whig",
    birth: d(1698, 5, 18),
    death: d(1765, 10, 6),
    events: [
      { date: d(1722, 8, 7), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1727, 3, 13), type: PRESIDENCY_ENDS, text: "Lost re-election" },
      { date: d(1765, 5, 24), type: DEATH, text: "Died of cerebral haemorrhage" }
    ]
  },
  {
    name: "Ferito Beoe",
    party: "Conservative",
    birth: d(1672, 12, 28),
    death: d(1731, 11, 30),
    events: [
      { date: d(1727, 8, 6), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1731, 7, 2), type: PRESIDENCY_ENDS, text: "assassinated" }
    ]
  },
  {
    name: "joh gumn nocks",
    party: "liberal democratic",
    birth: d(1693, 2, 2),
    death: d(1760, 3, 28),
    events: [
      { date: d(1731, 5, 23), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1745, 10, 24), type: PRESIDENCY_ENDS, text: "stepped down" },
      { date: d(1760, 9, 2), type: DEATH, text: "Died of diabetes complications" }
    ]
  },  
  {
    name: "Valu Jezza",
    party: "Labour",
    birth: d(1708, 5, 3),
    death: d(1779, 3, 12),
    events: [
      { date: d(1745, 10, 28), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1761, 5, 28), type: PRESIDENCY_ENDS, text: "Resigned" },
      { date: d(1779, 12, 23), type: DEATH, text: "Died of typhoid fever" }
    ]
  },
  {
    name: "Commander Nullglyph",
    party: "Whig",
    birth: d(1717, 6, 30),
    death: d(1797, 4, 29),
    events: [
      { date: d(1761, 10, 26), type: PRESIDENCY_BEGINS, text: "Assumed office" },
      { date: d(1777, 11, 18), type: PRESIDENCY_ENDS, text: "Kicked out" },
      { date: d(1777, 9, 4), type: PRESIDENCY_BEGINS, text: "Seized power back" },
      { date: d(1779, 10, 9), type: PRESIDENCY_ENDS, text: "Resigned in favour of Conservative Party" },
      { date: d(1785, 8, 9), type: PRESIDENCY_BEGINS, text: "Re-Elected" },
      { date: d(1787, 3, 23), type: PRESIDENCY_ENDS, text: "Retired" },
      { date: d(1797, 5, 1), type: DEATH, text: "Died of heart failure" }
    ]
  },
  {
    name: "emory di marison",
    party: "radical",
    birth: d(1720, 6, 5),
    death: d(1778, 6, 3),
    events: [
      { date: d(1777, 4, 9), type: PRESIDENCY_BEGINS, text: "Seized power" },
      { date: d(1777, 2, 23), type: PRESIDENCY_ENDS, text: "Kicked out" },
      { date: d(1778, 2, 2), type: DEATH, text: "burnt at the steak" }
    ]
  },


  {
    name: "benjamin jones",
    party: "conservative",
    birth: d(1730, 12, 12),
    death: d(1806, 11, 10),
    events: [
      { date: d(1779, 8, 11), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1785, 2, 8), type: PRESIDENCY_ENDS, text: "Stepped down" },
      { date: d(1794, 8, 5), type: PRESIDENCY_BEGINS, text: "Re-elected" },
      { date: d(1796, 12, 7), type: PRESIDENCY_ENDS, text: "Loses re-elections" },
      { date: d(1806, 7, 19), type: DEATH, text: "Died of pneumonia" }  
    ]
  },
  {
    name: "Jammes Jaglianviac",
    party: "Conservative",
    birth: d(1717, 5, 22),
    death: d(1796, 7, 27),
    events: [
      { date: d(1787, 11, 2), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1794, 2, 12), type: PRESIDENCY_ENDS, text: "Resigned due to age" },
      { date: d(1796, 4, 18), type: DEATH, text: "Died of blood clot" }
    ]
  },
  {
    name: "Stanley Roberts",
    party: "Conservative",
    birth: d(1752, 1, 6),
    death: d(1827, 3, 13),
    events: [
      { date: d(1796, 10, 11), type: PRESIDENCY_BEGINS, text: "Appointed Acting President" },
      { date: d(1808, 5, 28), type: PRESIDENCY_ENDS, text: "Kicked out" },
      { date: d(1809, 6, 5), type: PRESIDENCY_BEGINS, text: "Seized power back" },
      { date: d(1812, 5, 10), type: PRESIDENCY_ENDS, text: "Stepped down" },      
      { date: d(1827, 12, 6), type: DEATH, text: "Died of tuberculosis" }
    ]
  },
  {
    name: "lucrene dapth",
    party: "radical",
    birth: d(1770, 12, 1),
    death: d(1811, 10, 1),
    events: [
      { date: d(1808, 5, 6), type: PRESIDENCY_BEGINS, text: "Seized power" },
      { date: d(1809, 3, 5), type: PRESIDENCY_ENDS, text: "Kicked out" },
      { date: d(1811, 9, 1), type: DEATH, text: "beheaded" }
    ]
  },

  {
    name: "Jack Prawn",
    party: "Conservative", 
    birth: d(1773, 12, 26),
    death: d(1818, 2, 1),
    events: [
      { date: d(1812, 11, 14), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1818, 7, 24), type: PRESIDENCY_ENDS, text: "Poisoned" },
      { date: d(1818, 2, 1), type: DEATH, text: "Died of poisoned pipe that stanley roberts forgot to clean" }
    ]
  },  

  {
    name: "Barkley Thunderflap",
    party: "GSC",
    birth: d(1766, 6, 17),
    death: d(1830, 12, 9),
    events: [
      { date: d(1818, 2, 13), type: PRESIDENCY_BEGINS, text: "Appointed Acting President (GSC-aligned dog)" },
      { date: d(1821, 7, 21), type: PRESIDENCY_ENDS, text: "Resigned" },
      { date: d(1830, 10, 20), type: DEATH, text: "Died of hydration issues" },
    ]
  },
  {
    name: "Feathery Quill",
    party: "feather first",
    birth: d(1791, 3, 26),
    death: d(1821, 5, 23),
    events: [
      { date: d(1820, 6, 11), type: PRESIDENCY_BEGINS, text: "served 6 symbolic days" },
      { date: d(1821, 1, 25), type: PRESIDENCY_ENDS, text: "died crashing into a blimp while trying to fly", }
    ]
  },
  {
    name: "Oreo Joshon Boeoer",
    party: "socialist",
    birth: d(1780, 10, 21),
    death: d(1870, 8, 10),
    events: [
      { date: d(1821, 9, 6), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1840, 3, 3), type: PRESIDENCY_ENDS, text: "Retired" },
      { date: d(1870, 3, 7), type: DEATH, text: "Died of cerebrovascular disease" }
    ]
  },

  {
    name: "tergo fluffbeard",
    party: "GSC",
    birth: d(1790, 3, 26),
    death: d(1878, 8, 6),
    events: [
      { date: d(1840, 1, 6), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1842, 5, 11), type: PRESIDENCY_ENDS, text: "lost re election" },
      { date: d(1878, 9, 12), type: DEATH, text: "halatosis" }
    ]
  },

  
  {
    name: "Myreech Oiaboy",
    party: "whig",
    birth: d(1824, 10, 27),
    death: d(1917, 12, 6),
    events: [
      { date: d(1842, 1, 2), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1853, 1, 14), type: PRESIDENCY_ENDS, text: "Stepped down" },
      { date: d(1917, 8, 24), type: DEATH, text: "died of stroke" }
    ]
  },
  {
    name: "Tennisonopi Avots",
    party: "conservative",
    birth: d(1798, 1, 4),
    death: d(1863, 12, 18),
    events: [
      { date: d(1853, 9, 26), type: PRESIDENCY_BEGINS, text: "Elected (by retroactive declaration)" },
      { date: d(1863, 10, 21), type: PRESIDENCY_ENDS, text: "died of stroke" }
    ]
  },
  {
    name: "Spindle Gowlash",
    party: "radical",
    birth: d(1839, 3, 17),
    death: d(1910, 3, 3),
    events: [
      { date: d(1863, 1, 24), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1867, 4, 17), type: PRESIDENCY_ENDS, text: "resigned" },
      { date: d(1910, 5, 16), type: DEATH, text: "died of flu" }
    ]
  },

{
    name: "flint vapourmark",
    party: "radical",
    birth: d(1815, 2, 18),
    death: d(1872, 3, 18),
    events: [
      { date: d(1867, 2, 24), type: PRESIDENCY_BEGINS, text: "" },
      { date: d(1869, 5, 14), type: PRESIDENCY_ENDS, text: "lost re election" },
      { date: d(1872, 12, 24), type: DEATH, text: "gangreene" }
    ]
  },

  {
    name: "davi rovfe",
    party: "conservative",
    birth: d(1840, 3, 15),
    death: d(1926, 8, 24),
    events: [
      { date: d(1869, 8, 24), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1889, 11, 13), type: PRESIDENCY_ENDS, text: "Resigned due to illness" },
      { date: d(1926, 11, 5), type: DEATH, text: "died of scurvy" }
    ]
  },

  {
    name: "ben joinse",
    party: "whig",
    birth: d(1859, 3, 22),
    death: d(1948, 9, 14),
    events: [
      { date: d(1889, 2, 12), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1897, 1, 10), type: PRESIDENCY_ENDS, text: "lost re election" },
      { date: d(1948, 7, 14), type: DEATH, text: "died of dropsy" }
    ]
  },
  
  {
    name: "myrecce beeryhorn",
    party: "radical",
    birth: d(1857, 1, 2),
    death: d(1915, 2, 23),
    events: [
      { date: d(1897, 5, 18), type: PRESIDENCY_BEGINS, text: "elected" },
      { date: d(1899, 8, 8), type: PRESIDENCY_ENDS, text: "lost re election"},
      { date: d(1915, 3, 10), type: DEATH, text: "tooth infection" }
    ]
  },


  {
    name: "lila file",
    party: "independent",
    birth: d(1867, 4, 25),
    death: d(1957, 6, 17),
    events: [
      { date: d(1899, 3, 11), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1910, 10, 4), type: PRESIDENCY_ENDS, text: "Retired" },
      { date: d(1957, 8, 11), type: DEATH, text: "died of carrotaminia" }
    ]
  },
  {
    name: "Anamalo Synth",
    party: "labour",
    birth: d(1871, 4, 2),
    death: d(1959, 10, 13),
    events: [
      { date: d(1910, 9, 28), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1920, 3, 3), type: PRESIDENCY_ENDS, text: "Resigned" },
      { date: d(1959, 2, 17), type: DEATH, text: "died of stroke" }
    ]
  },
  {
    name: "Rob Reddik",
    party: "conservative",
    birth: d(1863, 7, 6),
    death: d(1930, 9, 16),
    events: [
      { date: d(1920, 6, 25), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1929, 5, 7), type: PRESIDENCY_ENDS, text: "Lost re-election" },
      { date: d(1930, 10, 15), type: DEATH, text: "died of kidney failure" }
    ]
  },    
  {
    name: "Avae Romrowabala",
    party: 'whig',
    birth: d(1887, 11, 27),
    death: d(1970, 11, 3),
    events: [
      { date: d(1929, 7, 18), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1947, 11, 7), type: PRESIDENCY_ENDS, text: "Kicked out" },
      { date: d(1948, 7, 11), type: PRESIDENCY_BEGINS, text: "Resumed office" },
      { date: d(1954, 5, 20), type: PRESIDENCY_ENDS, text: "Retired" },
      { date: d(1970, 2, 8), type: DEATH, text: "died of stomach cancer" }
    ]
  },
  {
    name: "Edwin Peake",
    birth: d(1904, 11, 12),
    party: "conservative",
    death: d(1992, 8, 10),
    events: [
      { date: d(1947, 3, 15), type: PRESIDENCY_BEGINS, text: "Seized power" },
      { date: d(1948, 3, 17), type: PRESIDENCY_ENDS, text: "Overthrown" },
      { date: d(1992, 6, 9), type: DEATH, text: "died of parkinson's disease" }
    ]
  },  
  {
    name: "Alec Oven",
    party: "DONEX",
    birth: d(1924, 3, 5),
    death: d(1980, 3, 24),
    events: [
      { date: d(1954, 7, 26), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1957, 11, 25), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1980, 12, 22), type: DEATH, text: "died of  throat cancer and stabbed by servant" }
    ]
  },
 {
    name: "featerry joilpb",
    party: "labour",
    birth: d(1910, 9, 13),
    death: d(2000, 8, 26),
    events: [
      { date: d(1957, 4, 8), type: PRESIDENCY_BEGINS, text: "elected" },
      { date: d(1961, 2, 27), type: PRESIDENCY_ENDS, text: "resigned" },
      { date: d(2000, 6, 4), type: DEATH, text: "died of TB" }
    ]
  },
  {
    name: "Avia Gow",
    birth: d(1933, 11, 26),
    party: "liberal democratic",
    death: null,
    events: [
      { date: d(1961, 10, 16), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1965, 10, 5), type: PRESIDENCY_ENDS, text: "Term ended" },
    ]
  },  
  {
    name: "Ajaxio Collad",
    party:"snackalist",
    birth: d(1915, 7, 23),
    death: d(2007, 8, 5),
    events: [
      { date: d(1965, 1, 7), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1967, 9, 27), type: PRESIDENCY_ENDS, text: "Lost re-election" },
      { date: d(2007, 10, 23), type: DEATH, text: "died of heart attack" }
    ]
  },
  {
    name: "shorn oatly",
    party: "labour",
    birth: d(1920, 4, 12),
    death: d(2014, 12, 21),
    events: [
      { date: d(1967, 1, 16), type: PRESIDENCY_BEGINS, text: "elected" },
      { date: d(1970, 6, 23), type: PRESIDENCY_ENDS, text: "lost re election" },
      { date: d(2014, 11, 5), type: DEATH, text: "died of heart failure" }
    ]
  },  
  {
    name: "Ajaysoionvasao Foallowa",
    birth: d(1931, 6, 10),
    party:"labour",
    death: null,
    events: [
      { date: d(1970, 2, 19), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1981, 6, 4), type: PRESIDENCY_ENDS, text: "Term ended" },
    ]
  },
  {
    name: "Herbert Lovvbert",
    birth: d(1951, 11, 15),
    party:"labour",
    death: null,
    events: [
      { date: d(1981, 1, 2), type:PRESIDENCY_BEGINS, text: "Elected 1981 but for a few days only" },
      { date: d(1981, 6, 1), type:PRESIDENCY_ENDS, text: "Elected 1981 but for a few days only" },
      { date: d(1988, 7, 1), type:PRESIDENCY_BEGINS, text: "Re-elected" },
      { date: d(2023, 3, 15), type:PRESIDENCY_ENDS, text: "Retired" }
    ]
  },
  {
    name: "Effesi Collad",
    birth: d(1950, 4, 6),
    party:"snackalist",
    death: null,
    events: [
      { date: d(1981, 3, 10), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1988, 10, 8), type: PRESIDENCY_ENDS, text: "Lost election" },
    ]
  },  
  {
    name: "Baahram Linco",
    party: "whig",
    birth: d(1979, 9, 24),
    death: null,
    events: [
      { date: d(2023, 10, 24), type: PRESIDENCY_BEGINS, text: "Elected" }
    ]
  }
];

export const MONARCHS: Monarch[] = [
  {
    name: "high crust",
    birth: d(1635, 11, 21),
    death: d(1683, 5, 27),
    start_reign: d(1656, 12, 1),
    end_reign: d(1683, 3, 2),
    death_cause: "starved to death",
  },
  {
    name: "chumble vainbatter",
    birth: d(1636, 11, 3),
    death: d(1701, 11, 15),
    start_reign: d(1683, 1, 24),
    end_reign: d(1701, 10, 5),
    death_cause: "quatering",
  },  
  {
    name: "benadict I",
    birth: d(1696, 7, 5),
    death: d(1759, 12, 28),
    start_reign: d(1701, 4, 7),
    end_reign: d(1759, 4, 13),
    death_cause: "respetory infection",
  },
  {
    name: "constantine",
    birth: d(1720, 12, 7),
    death: d(1793, 9, 12),
    start_reign: d(1759, 8, 25),
    end_reign: d(1793, 2, 8),
    death_cause: "stroke",
  },
  {
    name: "henry I",
    birth: d(1745, 1, 10),
    death: d(1796, 12, 13),
    start_reign: d(1793, 5, 16),
    end_reign: d(1796, 5, 12),
    death_cause: "shot 3 times by army",
  },
  {
    name: "henry II",
    birth: d(1763, 2, 5),
    death: d(1827, 10, 27),
    start_reign: d(1796, 11, 23),
    end_reign: d(1827, 8, 17),
    death_cause: "pancreatic cancer",
  },
  {
    name: "isabella I",
    birth: d(1801, 8, 3),
    death: d(1899, 8, 27),
    start_reign: d(1827, 1, 11),
    end_reign: d(1899, 2, 24),
    death_cause: "toncil failure",
  },
  {
    name: "henry III",
    birth: d(1832, 8, 5),
    death: d(1907, 9, 15),
    start_reign: d(1899, 2, 16),
    end_reign: d(1907, 9, 1),
    death_cause: "lucemia",
  },

    {
    name: "leopold I",
    birth: d(1858, 6, 23),
    death: d(1937, 9, 14),
    start_reign: d(1907, 9, 27),
    end_reign: d(1937, 4, 9),
    death_cause: "heart attack",
  },   


    {
    name: "leopold II",
    birth: d(1900, 9, 24),
    death: d(1981, 3, 13),
    start_reign: d(1837, 12, 2),
    end_reign: d(1981, 2, 8),
    death_cause: "heart failure",
  },   


    {
    name: "isabella II",
    birth: d(1927, 4, 25),
    death: d(2024, 6, 4),
    start_reign: d(1981, 3, 13),
    end_reign: d(2024, 11, 2),
    death_cause: "heart deisese",
  },   
  
  {
    name: "leopold II",
    birth: d(1960, 5, 3),
    death: null,
    start_reign: d(2024, 9, 9),
    end_reign: null,
    death_cause: null
  }

]
