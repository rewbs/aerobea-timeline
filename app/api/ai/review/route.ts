import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { presidents, monarchs } = body;

    if (!presidents && !monarchs) {
        return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
    You are a historian reviewing a timeline for a fictional country. 
    Analyze the following data for logical inconsistencies, historical impossibilities (within the context of a fictional country), and narrative continuity errors.
    
    Focus on:
    1. Nonsensical ages (e.g. elected at age 5, died at age 200).
    2. Contradictory events (e.g. "Died in office" but has events years later).
    3. Implausible timelines (e.g. a 100-year reign).
    4. Narrative gaps or oddities.

    Return a JSON object with a "issues" property, which is an array of strings describing the issues found. 
    If no issues are found, return an empty array.
    
    Data:
    ${JSON.stringify({ presidents, monarchs }, null, 2)}
  `;

    try {
        const response = await client.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from AI');
        }

        const result = JSON.parse(content);
        return NextResponse.json(result);
    } catch (error) {
        console.error('AI Review Error:', error);
        return NextResponse.json(
            { error: 'Failed to review timeline' },
            { status: 500 }
        );
    }
}
