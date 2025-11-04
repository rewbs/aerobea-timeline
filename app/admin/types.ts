import { Country } from '@prisma/client/edge';

export interface AdminCountry {
  id: number;
  code: string;
  name: string;
  start: string;
  end: string | null;
  createdAt: string;
  updatedAt: string;
  presidents: unknown;
  monarchs: unknown;
}

export const serializeAdminCountry = (country: Country): AdminCountry => ({
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
