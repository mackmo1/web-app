import { Prisma } from '../generated/prisma';

export interface PropertyQueryParams {
  listing?: string | null;
  city?: string | null;
  type?: string | null;
  search?: string | null;
}

function buildSearchCondition(
  rawSearch?: string | null,
): Prisma.propertyWhereInput | undefined {
  if (!rawSearch) return undefined;

  const trimmed = rawSearch.trim();
  if (!trimmed) return undefined;

  const tokens = trimmed.split(/[\s,;]+/).filter(Boolean);
  if (tokens.length === 0) return undefined;

  const textFields: (keyof Prisma.propertyWhereInput)[] = [
    'city',
    'address',
    'project',
    'pin_code',
  ];

  // Single token: simple OR across fields
  if (tokens.length === 1) {
    const q = tokens[0];
    const orClauses: Prisma.propertyWhereInput[] = [];

    for (const field of textFields) {
      orClauses.push({
        [field]: {
          contains: q,
          mode: 'insensitive',
        },
      } as Prisma.propertyWhereInput);
    }

    return { OR: orClauses };
  }

  // Multiple tokens: each token must match at least one field (AND of ORs)
  const andClauses: Prisma.propertyWhereInput[] = tokens.map((token) => {
    const orClauses: Prisma.propertyWhereInput[] = [];

    for (const field of textFields) {
      orClauses.push({
        [field]: {
          contains: token,
          mode: 'insensitive',
        },
      } as Prisma.propertyWhereInput);
    }

    return { OR: orClauses };
  });

  return { AND: andClauses };
}

// Build where clause for property listing/search
export function buildPropertyWhereClause(
  params: PropertyQueryParams,
): Prisma.propertyWhereInput {
  const baseWhere: Prisma.propertyWhereInput = {};

  if (params.listing) {
    baseWhere.listing = params.listing;
  }

  if (params.city) {
    baseWhere.city = {
      contains: params.city,
      mode: 'insensitive',
    };
  }

  if (params.type) {
    baseWhere.type = params.type;
  }

  const searchCondition = buildSearchCondition(params.search);

  if (!searchCondition) {
    return baseWhere;
  }

  const hasBaseConditions = Object.keys(baseWhere).length > 0;

  if (!hasBaseConditions) {
    return searchCondition;
  }

  // Combine base filters and search condition via AND
  return {
    AND: [baseWhere, searchCondition],
  };
}

