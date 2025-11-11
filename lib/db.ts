import { PrismaClient, Prisma } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const defaultTtl = Number(
  process.env.PRISMA_CACHE_TTL ??
    (process.env.NODE_ENV === 'production' ? '60' : '0')
);
const defaultSwr = Number(
  process.env.PRISMA_CACHE_SWR ??
    (defaultTtl > 0 ? Math.max(Math.floor(defaultTtl / 2), 1) : 0)
);

const defaultCacheStrategy =
  defaultTtl > 0 ? { ttl: defaultTtl, swr: defaultSwr } : null;

const withDefaultCache = defaultCacheStrategy
  ? Prisma.defineExtension({
      name: 'with-default-cache',
      query: {
        $allModels: {
          findUnique({ args, query }) {
            if (defaultCacheStrategy) {
              const nextArgs = args as typeof args & {
                cacheStrategy?: { ttl?: number; swr?: number };
              };
              if (!nextArgs.cacheStrategy)
                nextArgs.cacheStrategy = defaultCacheStrategy;
            }
            return query(args);
          },
          findFirst({ args, query }) {
            if (defaultCacheStrategy) {
              const nextArgs = args as typeof args & {
                cacheStrategy?: { ttl?: number; swr?: number };
              };
              if (!nextArgs.cacheStrategy)
                nextArgs.cacheStrategy = defaultCacheStrategy;
            }
            return query(args);
          },
          findMany({ args, query }) {
            if (defaultCacheStrategy) {
              const nextArgs = args as typeof args & {
                cacheStrategy?: { ttl?: number; swr?: number };
              };
              if (!nextArgs.cacheStrategy)
                nextArgs.cacheStrategy = defaultCacheStrategy;
            }
            return query(args);
          },
          findUniqueOrThrow({ args, query }) {
            if (defaultCacheStrategy) {
              const nextArgs = args as typeof args & {
                cacheStrategy?: { ttl?: number; swr?: number };
              };
              if (!nextArgs.cacheStrategy)
                nextArgs.cacheStrategy = defaultCacheStrategy;
            }
            return query(args);
          },
          findFirstOrThrow({ args, query }) {
            if (defaultCacheStrategy) {
              const nextArgs = args as typeof args & {
                cacheStrategy?: { ttl?: number; swr?: number };
              };
              if (!nextArgs.cacheStrategy)
                nextArgs.cacheStrategy = defaultCacheStrategy;
            }
            return query(args);
          },
        },
      },
    })
  : undefined;

const prismaClientSingleton = () => {
  const baseClient = new PrismaClient().$extends(withAccelerate());
  return withDefaultCache ? baseClient.$extends(withDefaultCache) : baseClient;
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export default prisma;
