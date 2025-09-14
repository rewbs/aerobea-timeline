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
    birth: d(1674),
    death: d(1735),
    events: [
      { date: d(1701), text: "Elected as first President of Aerobea" },
      { date: d(1702), type: PRESIDENCY_BEGINS, text: "Sworn into office" },
      { date: d(1722), type: PRESIDENCY_ENDS, text: "Resigned from office" },
      { date: d(1735), type: DEATH, text: "Died of  blood cancer" }

    ]
  },
  {
    name: "Robert Crumbleton",
    party: "Whig",
    birth: d(1698),
    death: d(1765),
    events: [
      { date: d(1722), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1727), type: PRESIDENCY_ENDS, text: "Lost re-election" },
      { date: d(1765), type: DEATH, text: "Died of cerebral haemorrhage" }
    ]
  },
  {
    name: "Ferito Beoe",
    party: "Conservative",
    birth: d(1672),
    death: d(1731),
    events: [
      { date: d(1727), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1731), type: PRESIDENCY_ENDS, text: "assassinated" }
    ]
  },
  {
    name: "joh gumn nocks",
    party: "liberal democratic",
    birth: d(1693),
    death: d(1760),
    events: [
      { date: d(1731), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1745), type: PRESIDENCY_ENDS, text: "stepped down" },
      { date: d(1760), type: DEATH, text: "Died of diabetes complications" }
    ]
  },  
  {
    name: "Valu Jezza",
    party: "Labour",
    birth: d(1708),
    death: d(1779),
    events: [
      { date: d(1745), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1761), type: PRESIDENCY_ENDS, text: "Resigned" },
      { date: d(1779), type: DEATH, text: "Died of typhoid fever" }
    ]
  },
  {
    name: "Commander Nullglyph",
    party: "Whig",
    birth: d(1717),
    death: d(1797),
    events: [
      { date: d(1761), type: PRESIDENCY_BEGINS, text: "Assumed office" },
      { date: d(1777), type: PRESIDENCY_ENDS, text: "Kicked out" },
      { date: d(1777), type: PRESIDENCY_BEGINS, text: "Seized power back" },
      { date: d(1779), type: PRESIDENCY_ENDS, text: "Resigned in favour of Conservative Party" },
      { date: d(1785), type: PRESIDENCY_BEGINS, text: "Re-Elected" },
      { date: d(1787), type: PRESIDENCY_ENDS, text: "Retired" },
      { date: d(1797), type: DEATH, text: "Died of heart failure" }
    ]
  },
  {
    name: "emory di marison",
    party: "radical",
    birth: d(1720),
    death: d(1778),
    events: [
      { date: d(1777), type: PRESIDENCY_BEGINS, text: "Seized power" },
      { date: d(1777), type: PRESIDENCY_ENDS, text: "Kicked out" },
      { date: d(1778), type: DEATH, text: "burnt at the steak" }
    ]
  },


  {
    name: "benjamin jones",
    party: "conservative",
    birth: d(1730),
    death: d(1806),
    events: [
      { date: d(1779), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1785), type: PRESIDENCY_ENDS, text: "Stepped down" },
      { date: d(1794), type: PRESIDENCY_BEGINS, text: "Re-elected" },
      { date: d(1796), type: PRESIDENCY_ENDS, text: "Loses re-elections" },
      { date: d(1806), type: DEATH, text: "Died of pneumonia" }  
    ]
  },
  {
    name: "Jammes Jaglianviac",
    party: "Conservative",
    birth: d(1717),
    death: d(1796),
    events: [
      { date: d(1787), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1794), type: PRESIDENCY_ENDS, text: "Resigned due to age" },
      { date: d(1796), type: DEATH, text: "Died of blood clot" }
    ]
  },
  {
    name: "Stanley Roberts",
    party: "Conservative",
    birth: d(1752),
    death: d(1827),
    events: [
      { date: d(1796), type: PRESIDENCY_BEGINS, text: "Appointed Acting President" },
      { date: d(1808), type: PRESIDENCY_ENDS, text: "Kicked out" },
      { date: d(1809), type: PRESIDENCY_BEGINS, text: "Seized power back" },
      { date: d(1812), type: PRESIDENCY_ENDS, text: "Stepped down" },      
      { date: d(1827), type: DEATH, text: "Died of tuberculosis" }
    ]
  },
  {
    name: "lucrene dapth",
    party: "radical",
    birth: d(1770),
    death: d(1811),
    events: [
      { date: d(1808), type: PRESIDENCY_BEGINS, text: "Seized power" },
      { date: d(1809), type: PRESIDENCY_ENDS, text: "Kicked out" },
      { date: d(1811), type: DEATH, text: "beheaded" }
    ]
  },

  {
    name: "Jack Prawn",
    party: "Conservative", 
    birth: d(1773),
    death: d(1818),
    events: [
      { date: d(1812), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1818), type: PRESIDENCY_ENDS, text: "Poisoned" },
      { date: d(1818), type: DEATH, text: "Died of poisoned pipe that stanley roberts forgot to clean" }
    ]
  },  

  {
    name: "Barkley Thunderflap",
    party: "GSC",
    birth: d(1766),
    death: d(1830),
    events: [
      { date: d(1818), type: PRESIDENCY_BEGINS, text: "Appointed Acting President (GSC-aligned dog)" },
      { date: d(1821), type: PRESIDENCY_ENDS, text: "Resigned" },
      { date: d(1830), type: DEATH, text: "Died of hydration issues" },
    ]
  },
  {
    name: "Feathery Quill",
    party: "feather first",
    birth: d(1791),
    death: d(1821),
    events: [
      { date: d(1820), type: PRESIDENCY_BEGINS, text: "served 6 symbolic days" },
      { date: d(1821), type: PRESIDENCY_ENDS, text: "died crashing into a blimp while trying to fly", }
    ]
  },
  {
    name: "Oreo Joshon Boeoer",
    party: "socialist",
    birth: d(1780),
    death: d(1870),
    events: [
      { date: d(1821), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1840), type: PRESIDENCY_ENDS, text: "Retired" },
      { date: d(1870), type: DEATH, text: "Died of cerebrovascular disease" }
    ]
  },

  {
    name: "tergo fluffbeard",
    party: "GSC",
    birth: d(1790),
    death: d(1878),
    events: [
      { date: d(1840), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1842), type: PRESIDENCY_ENDS, text: "lost re election" },
      { date: d(1878), type: DEATH, text: "halatosis" }
    ]
  },

  
  {
    name: "Myreech Oiaboy",
    party: "whig",
    birth: d(1824),
    death: d(1917),
    events: [
      { date: d(1842), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1853), type: PRESIDENCY_ENDS, text: "Stepped down" },
      { date: d(1917), type: DEATH, text: "died of stroke" }
    ]
  },
  {
    name: "Tennisonopi Avots",
    party: "conservative",
    birth: d(1798),
    death: d(1863),
    events: [
      { date: d(1853), type: PRESIDENCY_BEGINS, text: "Elected (by retroactive declaration)" },
      { date: d(1863), type: PRESIDENCY_ENDS, text: "died of stroke" }
    ]
  },
  {
    name: "Spindle Gowlash",
    party: "radical",
    birth: d(1839),
    death: d(1910),
    events: [
      { date: d(1863), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1867), type: PRESIDENCY_ENDS, text: "resigned" },
      { date: d(1910), type: DEATH, text: "died of flu" }
    ]
  },

{
    name: "flint vapourmark",
    party: "radical",
    birth: d(1815),
    death: d(1872),
    events: [
      { date: d(1867), type: PRESIDENCY_BEGINS, text: "" },
      { date: d(1869), type: PRESIDENCY_ENDS, text: "lost re election" },
      { date: d(1872), type: DEATH, text: "gangreene" }
    ]
  },

  {
    name: "davi rovfe",
    party: "conservative",
    birth: d(1840),
    death: d(1926),
    events: [
      { date: d(1869), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1889), type: PRESIDENCY_ENDS, text: "Resigned due to illness" },
      { date: d(1926), type: DEATH, text: "died of scurvy" }
    ]
  },

  {
    name: "ben joinse",
    party: "whig",
    birth: d(1859),
    death: d(1948),
    events: [
      { date: d(1889), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1897), type: PRESIDENCY_ENDS, text: "lost re election" },
      { date: d(1948), type: DEATH, text: "died of dropsy" }
    ]
  },
  
  {
    name: "myrecce beeryhorn",
    party: "radical",
    birth: d(1857),
    death: d(1915),
    events: [
      { date: d(1897), type: PRESIDENCY_BEGINS, text: "elected" },
      { date: d(1899), type: PRESIDENCY_ENDS, text: "lost re election"},
      { date: d(1915), type: DEATH, text: "tooth infection" }
    ]
  },


  {
    name: "lila file",
    party: "independent",
    birth: d(1867),
    death: d(1957),
    events: [
      { date: d(1899), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1910), type: PRESIDENCY_ENDS, text: "Retired" },
      { date: d(1957), type: DEATH, text: "died of carrotaminia" }
    ]
  },
  {
    name: "Anamalo Synth",
    party: "labour",
    birth: d(1871),
    death: d(1959),
    events: [
      { date: d(1910), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1920), type: PRESIDENCY_ENDS, text: "Resigned" },
      { date: d(1959), type: DEATH, text: "died of stroke" }
    ]
  },
  {
    name: "Rob Reddik",
    party: "conservative",
    birth: d(1863),
    death: d(1930),
    events: [
      { date: d(1920), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1929), type: PRESIDENCY_ENDS, text: "Lost re-election" },
      { date: d(1930), type: DEATH, text: "died of kidney failure" }
    ]
  },    
  {
    name: "Avae Romrowabala",
    party: 'whig',
    birth: d(1887),
    death: d(1970),
    events: [
      { date: d(1929), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1947), type: PRESIDENCY_ENDS, text: "Kicked out" },
      { date: d(1948), type: PRESIDENCY_BEGINS, text: "Resumed office" },
      { date: d(1954), type: PRESIDENCY_ENDS, text: "Retired" },
      { date: d(1970), type: DEATH, text: "died of stomach cancer" }
    ]
  },
  {
    name: "Edwin Peake",
    birth: d(1904),
    party: "conservative",
    death: d(1992),
    events: [
      { date: d(1947), type: PRESIDENCY_BEGINS, text: "Seized power" },
      { date: d(1948), type: PRESIDENCY_ENDS, text: "Overthrown" },
      { date: d(1992), type: DEATH, text: "died of parkinson's disease" }
    ]
  },  
  {
    name: "Alec Oven",
    party: "DONEX",
    birth: d(1924),
    death: d(1980),
    events: [
      { date: d(1954), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1957), type: PRESIDENCY_ENDS, text: "Term ended" },
      { date: d(1980), type: DEATH, text: "died of  throat cancer and stabbed by servant" }
    ]
  },
 {
    name: "featerry joilpb",
    party: "labour",
    birth: d(1910),
    death: d(2000),
    events: [
      { date: d(1957), type: PRESIDENCY_BEGINS, text: "elected" },
      { date: d(1961), type: PRESIDENCY_ENDS, text: "resigned" },
      { date: d(2000), type: DEATH, text: "died of TB" }
    ]
  },
  {
    name: "Avia Gow",
    birth: d(1933),
    party: "liberal democratic",
    death: null,
    events: [
      { date: d(1961), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1965), type: PRESIDENCY_ENDS, text: "Term ended" },
    ]
  },  
  {
    name: "Ajaxio Collad",
    party:"snackalist",
    birth: d(1915),
    death: d(2007),
    events: [
      { date: d(1965), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1967), type: PRESIDENCY_ENDS, text: "Lost re-election" },
      { date: d(2007), type: DEATH, text: "died of heart attack" }
    ]
  },
  {
    name: "shorn oatly",
    party: "labour",
    birth: d(1920),
    death: d(2014),
    events: [
      { date: d(1967), type: PRESIDENCY_BEGINS, text: "elected" },
      { date: d(1970), type: PRESIDENCY_ENDS, text: "lost re election" },
      { date: d(2014), type: DEATH, text: "died of heart failure" }
    ]
  },  
  {
    name: "Ajaysoionvasao Foallowa",
    birth: d(1931),
    party:"labour",
    death: null,
    events: [
      { date: d(1970), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1981), type: PRESIDENCY_ENDS, text: "Term ended" },
    ]
  },
  {
    name: "Herbert Lovvbert",
    birth: d(1951),
    party:"labour",
    death: null,
    events: [
      { date: d(1981), type:PRESIDENCY_BEGINS, text: "Elected 1981 but for a few days only" },
      { date: d(1981), type:PRESIDENCY_ENDS, text: "Elected 1981 but for a few days only" },
      { date: d(1988), type:PRESIDENCY_BEGINS, text: "Re-elected" },
      { date: d(2023), type:PRESIDENCY_ENDS, text: "Retired" }
    ]
  },
  {
    name: "Effesi Collad",
    birth: d(1950),
    party:"snackalist",
    death: null,
    events: [
      { date: d(1981), type: PRESIDENCY_BEGINS, text: "Elected" },
      { date: d(1988), type: PRESIDENCY_ENDS, text: "Lost election" },
    ]
  },  
  {
    name: "Baahram Linco",
    party: "whig",
    birth: d(1979),
    death: null,
    events: [
      { date: d(2023), type: PRESIDENCY_BEGINS, text: "Elected" }
    ]
  }
];

export const MONARCHS: Monarch[] = [
  {
    name: "high crust",
    birth: d(1635),
    death: d(1683),
    start_reign: d(1656),
    end_reign: d(1683),
    death_cause: "starved to death",
  },
  {
    name: "chumble vainbatter",
    birth: d(1636),
    death: d(1701),
    start_reign: d(1683),
    end_reign: d(1701),
    death_cause: "quatering",
  },  
  {
    name: "benadict I",
    birth: d(1696),
    death: d(1759),
    start_reign: d(1701),
    end_reign: d(1759),
    death_cause: "respetory infection",
  },
  {
    name: "constantine",
    birth: d(1720),
    death: d(1793),
    start_reign: d(1759),
    end_reign: d(1793),
    death_cause: "stroke",
  },
  {
    name: "henry I",
    birth: d(1745),
    death: d(1796),
    start_reign: d(1793),
    end_reign: d(1796),
    death_cause: "shot 3 times by army",
  },
  {
    name: "henry II",
    birth: d(1763),
    death: d(1827),
    start_reign: d(1796),
    end_reign: d(1827),
    death_cause: "pancreatic cancer",
  },
  {
    name: "isabella I",
    birth: d(1801),
    death: d(1899),
    start_reign: d(1827),
    end_reign: d(1899),
    death_cause: "toncil failure",
  },
  {
    name: "henry III",
    birth: d(1832),
    death: d(1907),
    start_reign: d(1899),
    end_reign: d(1907),
    death_cause: "lucemia",
  },

    {
    name: "leopold I",
    birth: d(1858),
    death: d(1937),
    start_reign: d(1907),
    end_reign: d(1937),
    death_cause: "heart attack",
  },   


    {
    name: "leopold II",
    birth: d(1900),
    death: d(1981),
    start_reign: d(1837),
    end_reign: d(1981),
    death_cause: "heart failure",
  },   


    {
    name: "isabella II",
    birth: d(1927),
    death: d(2024),
    start_reign: d(1981),
    end_reign: d(2024),
    death_cause: "heart deisese",
  },   
  
  {
    name: "leopold II",
    birth: d(1960),
    death: null,
    start_reign: d(2024),
    end_reign: null,
    death_cause: null
  }

]
