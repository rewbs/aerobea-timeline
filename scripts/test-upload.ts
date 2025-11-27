
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config(); // Load .env
dotenv.config({ path: '.env.local', override: true }); // Load .env.local

async function testUpload() {
    console.log('BLOB_READ_WRITE_TOKEN present:', !!process.env.BLOB_READ_WRITE_TOKEN);
    if (process.env.BLOB_READ_WRITE_TOKEN) {
        console.log('Token length:', process.env.BLOB_READ_WRITE_TOKEN.length);
    } else {
        console.error('Token is MISSING');
        return;
    }

    const filename = 'baahram edward lincoln the elder.png';
    const filepath = path.join(process.cwd(), 'public', filename);

    if (!fs.existsSync(filepath)) {
        console.error(`File not found: ${filepath}`);
        return;
    }

    console.log(`Attempting to upload ${filename}...`);
    try {
        const fileBuffer = fs.readFileSync(filepath);
        const blob = await put(filename, fileBuffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        console.log(`Success! Uploaded to ${blob.url}`);
    } catch (error) {
        console.error('Upload failed!');
        console.error(error);
    }
}

testUpload();
