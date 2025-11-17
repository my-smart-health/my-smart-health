import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import prisma from '@/lib/db';

type RawUser = {
  id: string;
  name: string | null;
  bio: string | null;
  profileImages: string[] | null;
};

type SearchResult = {
  id: string;
  name: string;
  bio: string;
  image: string | null;
};

const MAX_RESULTS = 20;
const MAX_QUERY_LENGTH = 80;

const sanitizeQuery = (value: string) => value.trim().replace(/\s+/g, ' ');

type SearchMode = 'name' | 'bio' | 'field';

const resolveMode = (raw: string | null): SearchMode => {
  if (raw === 'bio' || raw === 'field') return raw;
  return 'name';
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get('q') ?? '';
  const mode = resolveMode(searchParams.get('type'));
  const trimmed = sanitizeQuery(rawQuery).slice(0, MAX_QUERY_LENGTH);

  if (!trimmed) {
    return NextResponse.json(
      { users: [] satisfies SearchResult[] },
      { status: 200 }
    );
  }

  const likePattern = `%${trimmed}%`;

  const baseSelect = {
    id: true,
    name: true,
    bio: true,
    profileImages: true,
  } satisfies Prisma.UserSelect;

  const mapUsers = (rows: RawUser[]): SearchResult[] =>
    rows
      .map((row) => ({
        id: row.id,
        name: (row.name ?? '').trim(),
        bio: row.bio ?? '',
        image: row.profileImages?.[0] ?? null,
      }))
      .filter((user) => user.id && user.name);

  try {
    let rows: RawUser[] = [];

    if (mode === 'field') {
      rows = await prisma.$queryRaw<RawUser[]>(Prisma.sql`
        SELECT "id", "name", "bio", "profileImages"
        FROM "User"
        WHERE
          EXISTS (
            SELECT 1
            FROM jsonb_array_elements(COALESCE("fieldOfExpertise", '[]'::jsonb)) AS elem
            WHERE
              (elem->>'label') ILIKE ${likePattern}
              OR (elem->>'description') ILIKE ${likePattern}
          )
        ORDER BY "name" NULLS LAST
        LIMIT ${Prisma.raw(String(MAX_RESULTS))};
      `);
    } else {
      const whereClause =
        mode === 'bio'
          ? { bio: { contains: trimmed, mode: 'insensitive' as const } }
          : { name: { contains: trimmed, mode: 'insensitive' as const } };

      rows = (await prisma.user.findMany({
        where: whereClause,
        select: baseSelect,
        orderBy: { name: 'asc' },
        take: MAX_RESULTS,
      })) as RawUser[];
    }

    const users = mapUsers(rows);

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('/api/users/search error', error);
    }
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}
