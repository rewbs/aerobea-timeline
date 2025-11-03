import { prisma } from '../../lib/prisma';
import AdminPageClient, { AdminCountry } from './AdminPageClient';

const serializeCountry = (country: {
  id: number;
  code: string;
  name: string;
  start: Date;
  end: Date | null;
  createdAt: Date;
  updatedAt: Date;
  presidents: unknown;
  monarchs: unknown;
}): AdminCountry => ({
  id: country.id,
  code: country.code,
  name: country.name,
  start: country.start.toISOString(),
  end: country.end ? country.end.toISOString() : null,
  createdAt: country.createdAt.toISOString(),
  updatedAt: country.updatedAt.toISOString(),
  presidents: country.presidents,
  monarchs: country.monarchs,
});

export default async function AdminPage() {
  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' },
  });

  const serialized = countries.map(serializeCountry);

  return <AdminPageClient countries={serialized} />;
}
