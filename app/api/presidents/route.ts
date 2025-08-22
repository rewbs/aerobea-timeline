import OpenAI from 'openai';
import {
  President,
  PRESIDENCY_BEGINS,
  PRESIDENCY_ENDS
} from '../../../data/presidents';
import { presidentialExitReasons } from '../../../data/exitReasons';

export async function POST() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Give me 25 imaginary names for presidents of an imaginary country. For inspiration, here are some example names, the names you generate should be in a similar style:
  Baraham Edward Lincoln the Elder
  Robert Crumbleton
  Ferito Beoe
  joh gumn nocks
  Valu Jezza
  Commander Nullglyph
  Jack Prawn
  The names should be unique and not too similar to each other. The names should be suitable for a president, so avoid overly silly or comedic names. The names should be diverse in style and sound, reflecting a range of cultural influences. The names should not include any real historical figures or well-known fictional characters. The names should be suitable for a fictional timeline spanning from 1674 to 2025, with the last president being elected in 2025.

  Return only the names with a different name on each line.`;

  const response = await client.chat.completions.create({
    model: 'gpt-5-nano',
    messages: [{ role: 'user', content: prompt }],
  });

  const names = response.choices[0]?.message?.content?.split('\n').filter(name => name.trim()) || [];

  // Ensure we have exactly 25 names
  if (names.length < 25) {
    throw new Error(`Only got ${names.length} names, need 25`);
  }

  const parties = ['Whig', 'Conservative', 'Liberal', 'Labour', 'Independent'];
  const endYear = 2025;
  const startYear = 1825; // 200 years of history
  const totalYears = endYear - startYear; // 200 years
  
  // Calculate average term length to fit 25 presidents in 200 years
  const averageTermLength = Math.floor(totalYears / 25); // 8 years average


  const presidents: President[] = [];
  let currentYear = startYear;

  for (let i = 0; i < 25 && currentYear < endYear; i++) {
    const name = names[i].trim();
    if (!name) continue;

    // Calculate term length with some variation (4-12 years, average 8)
    let termLength = averageTermLength + Math.floor(Math.random() * 5) - 2; // 6-10 years
    
    // For the last president, make sure we end exactly in 2025
    if (i === 24 || currentYear + termLength > endYear) {
      termLength = endYear - currentYear;
    }

    // Ensure minimum 1 year term
    if (termLength < 1) termLength = 1;

    const electionYear = currentYear;
    const exitYear = currentYear + termLength;

    // Generate realistic birth year (president should be 35-70 when taking office)
    const ageAtElection = 35 + Math.floor(Math.random() * 35); // 35-70 years old
    const birthYear = electionYear - ageAtElection;

    // Choose exit reason - weight shorter terms toward more dramatic exits
    let exitReason: { death?: boolean; reason: string } = { death: false, reason: 'Completed term' };
    if (i === 24) {
      // Current president
      exitReason = { death: false, reason: 'Current president' };
    } else if (termLength <= 2) {
      // Short terms more likely to be dramatic
      const dramaticReasons = presidentialExitReasons.filter(r =>
        r.death || r.reason.includes('Died') || r.reason.includes('Assassinated') || r.reason.includes('Impeached') ||
        r.reason.includes('Resigned') || r.reason.includes('coup') || r.reason.includes('protests')
      );
      exitReason = dramaticReasons[Math.floor(Math.random() * dramaticReasons.length)];
    } else if (termLength >= 7) {
      // Long terms more likely to be natural endings
      const naturalReasons = presidentialExitReasons.filter(r =>
        !r.death && (r.reason.includes('Completed') || r.reason.includes('stepped down') || r.reason.includes('not to seek'))
      );
      exitReason = naturalReasons[Math.floor(Math.random() * naturalReasons.length)];
    } else {
      // Medium terms can be anything
      exitReason = presidentialExitReasons[Math.floor(Math.random() * presidentialExitReasons.length)];
    }

    // Generate death year (if applicable)
    let deathYear: number | null = null;
    
    if (exitReason.death) {
      // Died in office
      deathYear = exitYear;
    } else {
      // May have died later
      const laterDeath = exitYear + Math.floor(Math.random() * 30); // 0-30 years after leaving office
      if (laterDeath <= 2025 && Math.random() > 0.3) { // 70% chance of dying by 2025
        deathYear = laterDeath;
      }
      if ((deathYear??2025) - birthYear > 105) {
        // If they lived too long, set death year to null
        deathYear = Math.max(exitYear, 105 * (1-Math.random()*0.2));
      }
    }

    presidents.push({
      name,
      party: parties[Math.floor(Math.random() * parties.length)],
      birth: birthYear,
      death: deathYear,
      events: [
        { year: electionYear, type: PRESIDENCY_BEGINS, text: 'Elected' },
        { year: exitYear, type: PRESIDENCY_ENDS, text: exitReason.reason }
      ]
    });

    currentYear = exitYear;
  }

  // Verify the timeline
  console.log(`Generated ${presidents.length} presidents`);
  console.log(`Timeline: ${presidents[0]?.events[0]?.year} - ${presidents[presidents.length - 1]?.events[1]?.year}`);
  
  // Check for gaps or overlaps
  for (let i = 1; i < presidents.length; i++) {
    const prevEnd = presidents[i - 1].events[1].year;
    const currentStart = presidents[i].events[0].year;
    if (prevEnd !== currentStart) {
      console.warn(`Gap/overlap detected: President ${i - 1} ends ${prevEnd}, President ${i} starts ${currentStart}`);
    }
  }

  return Response.json(presidents);
}
