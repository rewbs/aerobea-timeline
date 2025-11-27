
import { fal } from "@fal-ai/client";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { prompt, imageUrl } = await request.json();

    if (!prompt || !imageUrl) {
        return NextResponse.json(
            { error: 'Prompt and imageUrl are required' },
            { status: 400 }
        );
    }

    try {
        const result = await fal.subscribe('fal-ai/nano-banana-pro/edit', {
            input: {
                prompt,
                image_urls: [imageUrl],
                num_images: 2,
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
            { error: error.message || 'Failed to edit image' },
            { status: 500 }
        );
    }
}
