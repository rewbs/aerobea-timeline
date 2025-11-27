
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Create a map of lowercase filename -> actual filename
const fileMap = new Map<string, string>();
if (fs.existsSync(PUBLIC_DIR)) {
    fs.readdirSync(PUBLIC_DIR).forEach(file => {
        fileMap.set(file.toLowerCase(), file);
    });
}

async function findLocalImage(name: string): Promise<string | null> {
    const cleanName = name.trim().toLowerCase();
    const extensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

    for (const ext of extensions) {
        const candidate = `${cleanName}.${ext}`;
        if (fileMap.has(candidate)) {
            return fileMap.get(candidate)!;
        }
    }
    return null;
}

// Simple concurrency limiter
async function mapConcurrent<T, R>(
    items: T[],
    concurrency: number,
    fn: (item: T) => Promise<R>
): Promise<R[]> {
    const results: R[] = [];
    const executing: Promise<void>[] = [];

    for (const item of items) {
        const p = fn(item).then(res => {
            results.push(res);
        });
        executing.push(p);

        if (executing.length >= concurrency) {
            await Promise.race(executing);
            // Remove completed promises
            // Note: This is a simplified version. For strict order or error handling, it might need more.
            // But for this migration script, it's sufficient.
            // Actually, Promise.race just tells us ONE finished. We need to remove it.
            // A better way for simple limiting:
        }
    }
    await Promise.all(executing);
    return results;
}

// Better concurrency implementation
const limit = (concurrency: number) => {
    let active = 0;
    const queue: (() => void)[] = [];

    const run = async <T>(fn: () => Promise<T>): Promise<T> => {
        if (active >= concurrency) {
            await new Promise<void>(resolve => queue.push(resolve));
        }
        active++;
        try {
            return await fn();
        } finally {
            active--;
            if (queue.length > 0) {
                queue.shift()!();
            }
        }
    };
    return run;
};

async function migrate() {
    console.log('Starting image migration (Concurrent + Overwrite)...');

    const countries = await prisma.country.findMany();
    console.log(`Found ${countries.length} countries.`);

    const runLimit = limit(10); // 10 concurrent uploads

    for (const country of countries) {
        console.log(`Processing country: ${country.name} (${country.code})`);
        let updated = false;

        const presidents = country.presidents as any[];
        const monarchs = country.monarchs as any[];

        const uploadTasks: Promise<void>[] = [];

        // Process Presidents
        for (const president of presidents) {
            if (!president.imageUrl) {
                uploadTasks.push(runLimit(async () => {
                    const filename = await findLocalImage(president.name);
                    if (filename) {
                        try {
                            const filepath = path.join(PUBLIC_DIR, filename);
                            const fileBuffer = fs.readFileSync(filepath);
                            console.log(`    Uploading ${filename}...`);
                            const blob = await put(filename, fileBuffer, {
                                access: 'public',
                                token: process.env.BLOB_READ_WRITE_TOKEN,
                                addRandomSuffix: false,
                                allowOverwrite: true,
                            });
                            president.imageUrl = blob.url;
                            updated = true;
                            console.log(`    Uploaded ${filename} to ${blob.url}`);
                        } catch (error) {
                            console.error(`    Failed to upload ${filename}:`, error);
                        }
                    }
                }));
            }
        }

        // Process Monarchs
        for (const monarch of monarchs) {
            if (!monarch.imageUrl) {
                uploadTasks.push(runLimit(async () => {
                    const filename = await findLocalImage(monarch.name);
                    if (filename) {
                        try {
                            const filepath = path.join(PUBLIC_DIR, filename);
                            const fileBuffer = fs.readFileSync(filepath);
                            console.log(`    Uploading ${filename}...`);
                            const blob = await put(filename, fileBuffer, {
                                access: 'public',
                                token: process.env.BLOB_READ_WRITE_TOKEN,
                                addRandomSuffix: false,
                                allowOverwrite: true,
                            });
                            monarch.imageUrl = blob.url;
                            updated = true;
                            console.log(`    Uploaded ${filename} to ${blob.url}`);
                        } catch (error) {
                            console.error(`    Failed to upload ${filename}:`, error);
                        }
                    }
                }));
            }
        }

        await Promise.all(uploadTasks);

        if (updated) {
            await prisma.country.update({
                where: { id: country.id },
                data: {
                    presidents,
                    monarchs,
                },
            });
            console.log(`  Updated country ${country.name}`);
        } else {
            console.log(`  No changes for ${country.name}`);
        }
    }

    console.log('Migration complete.');
}

migrate()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
