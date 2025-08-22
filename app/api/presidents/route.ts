import OpenAI from 'openai';
import {
  President,
  PRESIDENCY_BEGINS,
  PRESIDENCY_ENDS
} from '../../../data/presidents';

export async function POST() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Give me 5 imaginary names for presidents of the country Aerobea. ` +
    `Return only a JSON array of strings.`;

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt
  });

  const text = response.output_text || '[]';
  let names: unknown;
  try {
    names = JSON.parse(text);
  } catch {
    names = [];
  }

  const currentYear = new Date().getFullYear();
  const parties = ['Whig', 'Conservative', 'Liberal', 'Labour', 'Independent'];

  const presidents: President[] = (Array.isArray(names) ? names : [])
    .slice(0, 5)
    .map((name: any) => {
      const birth =
        1800 + Math.floor(Math.random() * (currentYear - 1880)); // up to currentYear - 80
      const election = birth + 35 + Math.floor(Math.random() * 30);
      const exit = election + 1 + Math.floor(Math.random() * 8);
      let death: number | null = exit + Math.floor(Math.random() * 40);
      if (death > currentYear) death = null;
      return {
        name: String(name),
        party: parties[Math.floor(Math.random() * parties.length)],
        birth,
        death,
        events: [
          { year: election, type: PRESIDENCY_BEGINS, text: 'Elected' },
          { year: exit, type: PRESIDENCY_ENDS, text: 'Left office' }
        ]
      };
    });

  return Response.json(presidents);
}

