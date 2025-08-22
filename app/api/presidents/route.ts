import OpenAI from 'openai';
import { President } from '../../../data/presidents';

export async function POST() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Return only a JSON object with a property \\"presidents\\" which is an array of 5 imaginary presidents of the country Aerobea. Each president must have name, party, birth year, death year or null, and events (array of objects with year, text, and optional type where type is 1 for presidency begins and 2 for presidency ends).`;

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt
  });

  const text = response.output_text || '{"presidents":[]}';
  const data = JSON.parse(text) as { presidents: President[] };
  return Response.json(data.presidents);
}
