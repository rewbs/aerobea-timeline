import { prisma } from '../../lib/prisma';
import AdminPageClient from './AdminPageClient';
import { serializeAdminCountry } from './types';

export default async function AdminPage() {
  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' },
  });

  const serialized = countries.map(serializeAdminCountry);

  return <AdminPageClient countries={serialized} />;
}
