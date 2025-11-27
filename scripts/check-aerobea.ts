
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    const country = await prisma.country.findFirst({
        where: { code: 'aerobea' },
    });

    if (country) {
        console.log('Country:', country.name);
        const presidents = country.presidents as any[];
        console.log(`Total presidents: ${presidents.length}`);
        const missingImages = presidents.filter(p => !p.imageUrl);
        console.log(`Presidents missing images: ${missingImages.length}`);
        if (missingImages.length > 0) {
            console.log('Sample missing:', missingImages.slice(0, 5).map(p => p.name));
        }
        const hasImages = presidents.filter(p => p.imageUrl);
        if (hasImages.length > 0) {
            console.log('Sample with images:', hasImages.slice(0, 1).map(p => ({ name: p.name, url: p.imageUrl })));
        }
    } else {
        console.log('Country Aerobea not found');
    }
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
