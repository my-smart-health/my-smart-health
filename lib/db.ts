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

type CacheStrategy = { ttl: number; swr: number };
type ArgsWithCache = { cacheStrategy?: CacheStrategy };

const withDefaultCache = defaultCacheStrategy
  ? Prisma.defineExtension({
      name: 'with-default-cache',
      query: {
        $allModels: {
          async findUnique({
            args,
            query,
          }: {
            args: Record<string, unknown>;
            query: (args: Record<string, unknown>) => Promise<unknown>;
          }) {
            const argsWithCache = args as typeof args & ArgsWithCache;
            if (!argsWithCache.cacheStrategy) {
              argsWithCache.cacheStrategy = defaultCacheStrategy;
            }
            return query(args);
          },
          async findFirst({
            args,
            query,
          }: {
            args: Record<string, unknown>;
            query: (args: Record<string, unknown>) => Promise<unknown>;
          }) {
            const argsWithCache = args as typeof args & ArgsWithCache;
            if (!argsWithCache.cacheStrategy) {
              argsWithCache.cacheStrategy = defaultCacheStrategy;
            }
            return query(args);
          },
          async findMany({
            args,
            query,
          }: {
            args: Record<string, unknown>;
            query: (args: Record<string, unknown>) => Promise<unknown>;
          }) {
            const argsWithCache = args as typeof args & ArgsWithCache;
            if (!argsWithCache.cacheStrategy) {
              argsWithCache.cacheStrategy = defaultCacheStrategy;
            }
            return query(args);
          },
          async findUniqueOrThrow({
            args,
            query,
          }: {
            args: Record<string, unknown>;
            query: (args: Record<string, unknown>) => Promise<unknown>;
          }) {
            const argsWithCache = args as typeof args & ArgsWithCache;
            if (!argsWithCache.cacheStrategy) {
              argsWithCache.cacheStrategy = defaultCacheStrategy;
            }
            return query(args);
          },
          async findFirstOrThrow({
            args,
            query,
          }: {
            args: Record<string, unknown>;
            query: (args: Record<string, unknown>) => Promise<unknown>;
          }) {
            const argsWithCache = args as typeof args & ArgsWithCache;
            if (!argsWithCache.cacheStrategy) {
              argsWithCache.cacheStrategy = defaultCacheStrategy;
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
