
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    const country = await prisma.country.findFirst({
        where: { code: 'catland' },
    });

    if (country) {
        console.log('Country:', country.name);
        const sushi = (country.presidents as any[]).find((p: any) => p.name === 'Sushi');
        console.log('Sushi:', sushi);
    } else {
        console.log('Country not found');
    }
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
