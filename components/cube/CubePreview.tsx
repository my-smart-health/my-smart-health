'use client';

import Image from 'next/image';
import Link from 'next/link';

type CubePost = {
  id: string;
  title: string;
  photos: string[];
};

export default function CubePreview({ posts }: { posts: CubePost[] }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="border border-primary rounded-xl p-4 text-center text-sm text-gray-500">
        The cube is empty. Add news to see the preview.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {posts.map((p) => (
        <Link key={p.id} href={`/news/${p.id}`} className="block group">
          <div className="w-full aspect-video overflow-hidden rounded-xl border border-primary bg-white">
            {p.photos && p.photos[0] ? (
              <Image
                src={p.photos[0]}
                alt={p.title}
                width={640}
                height={360}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          <div className="mt-1 line-clamp-2 text-sm font-medium">{p.title}</div>
        </Link>
      ))}
    </div>
  );
}
