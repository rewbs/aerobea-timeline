import OpenAI from 'openai';
import { President } from '../../../data/presidents';

export async function POST() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Generate a JSON object with a property \\"presidents\\" which is an array of 5 imaginary presidents of the country Aerobea. Each president must have name, party, birth year, death year or null, and events (array of objects with year, text, and optional type where type is 1 for presidency begins and 2 for presidency ends).`;

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'presidents',
        schema: {
          type: 'object',
          properties: {
            presidents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  party: { type: 'string' },
                  birth: { type: 'number' },
                  death: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  events: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        year: { type: 'number' },
                        text: { type: 'string' },
                        type: { anyOf: [{ type: 'number', enum: [1,2] }, { type: 'null' }] }
                      },
                      required: ['year', 'text']
                    }
                  }
                },
                required: ['name', 'party', 'birth', 'death', 'events']
              }
            }
          },
          required: ['presidents']
        }
      }
    }
  });

  const data = JSON.parse(response.output[0].content[0].text) as { presidents: President[] };
  return Response.json(data.presidents);
}
