
import { fal } from "@fal-ai/client";
import dotenv from 'dotenv';


dotenv.config({ path: '.env' });

console.log('FAL_KEY present:', !!process.env.FAL_KEY);
if (process.env.FAL_KEY) {
    console.log('FAL_KEY length:', process.env.FAL_KEY.length);
}

async function testGenerate() {
    console.log('Testing FAL generation...');
    try {
        const result = await fal.subscribe('fal-ai/nano-banana-pro', {
            input: {
                prompt: "A portrait of a cat president",
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
    } catch (error) {
        console.error('Error:', error);
    }
}

testGenerate();
