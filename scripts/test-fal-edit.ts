
import { fal } from "@fal-ai/client";
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function testEdit() {
    console.log('Testing FAL editing...');
    // Use a known public image for testing
    const imageUrl = "https://7pzsx9kmz2p4sp9b.public.blob.vercel-storage.com/baahram%20edward%20lincoln%20the%20elder.png";

    try {
        const result = await fal.subscribe('fal-ai/nano-banana-pro/edit', {
            input: {
                prompt: "make it black and white",
                image_urls: [imageUrl],
                num_images: 1,
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === 'IN_PROGRESS') {
                    update.logs.map((log) => log.message).forEach(console.log);
                }
            },
        });
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error: any) {
        console.error('Error:', error);
        if (error.body) {
            console.error('Error Body:', JSON.stringify(error.body, null, 2));
        }
    }
}

testEdit();
