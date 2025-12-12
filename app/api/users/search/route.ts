import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import prisma from '@/lib/db';
import { Membership } from '@/utils/types';

type RawUser = {
  id: string;
  name: string | null;
  bio: string | null;
  profileImages: string[] | null;
  membership?: Membership | null;
  ratingStars?: number | null;
  ratingLink?: string | null;
};

type SearchResult = {
  id: string;
  name: string;
  bio: string;
  image: string | null;
  membership?: Membership | null;
  ratingStars?: number | null;
  ratingLink?: string | null;
};

const MAX_RESULTS = 20;
const MAX_QUERY_LENGTH = 80;

const sanitizeQuery = (value: string) => value.trim().replace(/\s+/g, ' ');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get('q') ?? '';
  const trimmed = sanitizeQuery(rawQuery).slice(0, MAX_QUERY_LENGTH);

  if (!trimmed) {
    return NextResponse.json(
      { users: [] satisfies SearchResult[] },
      { status: 200 }
    );
  }

  const likePattern = `%${trimmed}%`;

  const mapUsers = (rows: RawUser[]): SearchResult[] =>
    rows
      .map((row) => ({
        id: row.id,
        name: (row.name ?? '').trim(),
        bio: row.bio ?? '',
        image: row.profileImages?.[0] ?? null,
        membership: row.membership ?? null,
        ratingStars: row.ratingStars ?? null,
        ratingLink: row.ratingLink ?? null,
      }))
      .filter((user) => user.id && user.name);

  try {
    const rows = await prisma.$queryRaw<RawUser[]>(Prisma.sql`
      SELECT "id", "name", "bio", "profileImages", "membership", "ratingStars", "ratingLink"
      FROM "User"
      WHERE (
        COALESCE("name", '') ILIKE ${likePattern}
        OR COALESCE("bio", '') ILIKE ${likePattern}
        OR EXISTS (
          SELECT 1
          FROM jsonb_array_elements(COALESCE("fieldOfExpertise", '[]'::jsonb)) AS elem
          WHERE (
            COALESCE(elem->>'label', '') ILIKE ${likePattern}
            OR COALESCE(elem->>'description', '') ILIKE ${likePattern}
          )
        )
      )
      ORDER BY "name" NULLS LAST
      LIMIT ${Prisma.raw(String(MAX_RESULTS))};
    `);

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
