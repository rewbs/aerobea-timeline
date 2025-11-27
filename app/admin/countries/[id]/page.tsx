import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/prisma';
import AdminCountryEditorClient from '../AdminCountryEditorClient';
import { serializeAdminCountry } from '../../types';

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function AdminCountryEditPage({ params }: PageParams) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isFinite(id)) {
    notFound();
  }

  const country = await prisma.country.findUnique({
    where: { id },
  });

  if (!country) {
    notFound();
  }

  return (
    <AdminCountryEditorClient
      mode="edit"
      initialCountry={serializeAdminCountry(country)}
    />
  );
}
