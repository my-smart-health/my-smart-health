import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  type ListObjectsV2CommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

export type S3BucketVisibility = 'public' | 'private';

let cachedClient: S3Client | null = null;

const getS3Config = (visibility: S3BucketVisibility = 'public') => {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION;
  const bucket =
    visibility === 'private'
      ? process.env.S3_BUCKET_PRIVATE
      : process.env.S3_BUCKET_PUBLIC;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing S3 configuration. Please set S3_ENDPOINT, S3_REGION, S3_BUCKET_PUBLIC, S3_BUCKET_PRIVATE, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY.',
    );
  }

  return {
    endpoint: endpoint.replace(/\/+$/, ''),
    region,
    bucket,
    accessKeyId,
    secretAccessKey,
  };
};

const getS3Client = () => {
  if (cachedClient) {
    return cachedClient;
  }

  const config = getS3Config();
  cachedClient = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return cachedClient;
};

const normalizeKey = (key: string) =>
  key.replace(/^\/+/, '').replace(/\\/g, '/');

const encodePathSegments = (value: string) =>
  value
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

const addRandomSuffixToKey = (key: string) => {
  const normalizedKey = normalizeKey(key);
  const lastSlashIndex = normalizedKey.lastIndexOf('/');
  const directory =
    lastSlashIndex >= 0 ? normalizedKey.slice(0, lastSlashIndex) : '';
  const filename =
    lastSlashIndex >= 0
      ? normalizedKey.slice(lastSlashIndex + 1)
      : normalizedKey;

  const extensionIndex = filename.lastIndexOf('.');
  const hasExtension = extensionIndex > 0;
  const baseName = hasExtension ? filename.slice(0, extensionIndex) : filename;
  const extension = hasExtension ? filename.slice(extensionIndex) : '';

  const suffix = randomUUID().replace(/-/g, '').slice(0, 12);
  const updatedFilename = `${baseName}-${suffix}${extension}`;

  return directory ? `${directory}/${updatedFilename}` : updatedFilename;
};

export const buildS3ObjectUrl = (
  key: string,
  visibility: S3BucketVisibility = 'public',
) => {
  const { endpoint, bucket } = getS3Config(visibility);
  const normalizedKey = normalizeKey(key);
  return `${endpoint}/${bucket}/${encodePathSegments(normalizedKey)}`;
};

export const uploadRequestToS3 = async ({
  request,
  key,
  addRandomSuffix = false,
  visibility = 'public',
}: {
  request: Request;
  key: string;
  addRandomSuffix?: boolean;
  visibility?: S3BucketVisibility;
}) => {
  const s3Client = getS3Client();
  const { bucket } = getS3Config(visibility);
  const normalizedKey = normalizeKey(key);
  const finalKey = addRandomSuffix
    ? addRandomSuffixToKey(normalizedKey)
    : normalizedKey;

  const body = Buffer.from(await request.arrayBuffer());
  const contentType = request.headers.get('content-type') ?? undefined;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: finalKey,
      Body: body,
      ContentType: contentType,
    }),
  );

  const objectUrl = buildS3ObjectUrl(finalKey, visibility);

  return {
    url: objectUrl,
    downloadUrl: objectUrl,
    pathname: finalKey,
  };
};

export const extractS3KeyFromUrlOrPath = (value: string) => {
  const publicBucket = process.env.S3_BUCKET_PUBLIC;
  const privateBucket = process.env.S3_BUCKET_PRIVATE;

  const sanitizePath = (rawPath: string) => {
    const withoutLeadingSlash = rawPath.replace(/^\/+/, '');
    if (publicBucket && withoutLeadingSlash.startsWith(`${publicBucket}/`)) {
      return withoutLeadingSlash.slice(publicBucket.length + 1);
    }
    if (privateBucket && withoutLeadingSlash.startsWith(`${privateBucket}/`)) {
      return withoutLeadingSlash.slice(privateBucket.length + 1);
    }
    return withoutLeadingSlash;
  };

  try {
    const parsedUrl = new URL(value);
    return normalizeKey(sanitizePath(parsedUrl.pathname));
  } catch {
    return normalizeKey(sanitizePath(value));
  }
};

export const resolveS3BucketVisibilityFromUrlOrPath = (
  value: string,
): S3BucketVisibility | null => {
  const publicBucket = process.env.S3_BUCKET_PUBLIC;
  const privateBucket = process.env.S3_BUCKET_PRIVATE;

  const getPath = () => {
    try {
      return new URL(value).pathname;
    } catch {
      return value;
    }
  };

  const withoutLeadingSlash = getPath().replace(/^\/+/, '');

  if (publicBucket && withoutLeadingSlash.startsWith(`${publicBucket}/`)) {
    return 'public';
  }

  if (privateBucket && withoutLeadingSlash.startsWith(`${privateBucket}/`)) {
    return 'private';
  }

  return null;
};

export const deleteS3ObjectByKey = async (
  key: string,
  visibility: S3BucketVisibility = 'public',
) => {
  const s3Client = getS3Client();
  const { bucket } = getS3Config(visibility);
  const normalizedKey = normalizeKey(key);
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: normalizedKey,
    }),
  );
};

export const listS3KeysByPrefix = async (
  prefix: string,
  visibility: S3BucketVisibility = 'public',
) => {
  const s3Client = getS3Client();
  const { bucket } = getS3Config(visibility);
  const normalizedPrefix = normalizeKey(prefix);
  const keys: string[] = [];

  let continuationToken: string | undefined = undefined;

  do {
    const response: ListObjectsV2CommandOutput = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: normalizedPrefix,
        ContinuationToken: continuationToken,
      }),
    );

    for (const object of response.Contents ?? []) {
      if (object.Key) {
        keys.push(object.Key);
      }
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return keys;
};

export const getS3SignedObjectUrl = async (
  key: string,
  {
    visibility = 'private',
    expiresInSeconds = 300,
    responseContentDisposition,
  }: {
    visibility?: S3BucketVisibility;
    expiresInSeconds?: number;
    responseContentDisposition?: string;
  } = {},
) => {
  const s3Client = getS3Client();
  const { bucket } = getS3Config(visibility);
  const normalizedKey = normalizeKey(key);

  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: normalizedKey,
      ResponseContentDisposition: responseContentDisposition,
    }),
    {
      expiresIn: expiresInSeconds,
    },
  );
};
