import { fal } from "@fal-ai/client";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { prompt, model } = await request.json();

    if (!prompt) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const modelId = model || 'fal-ai/flux-2-pro';

    try {
        const result = await fal.subscribe(modelId, {
            input: {
                prompt,
                num_images: 4,
                image_size: {
                    width: 600,
                    height: 400,
                },
            },
            logs: true,
            onQueueUpdate: (update: any) => {
                if (update.status === 'IN_PROGRESS') {
                    update.logs.map((log: any) => log.message).forEach(console.log);
                }
            },
        });

        return NextResponse.json(result.data);
    } catch (error: any) {
        console.error('FAL API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate flag' },
            { status: 500 }
        );
    }
}
