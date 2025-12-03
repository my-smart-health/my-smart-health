import Link from "next/link";

export default function NewsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <h2 className="text-2xl font-bold text-gray-800">Post Not Found</h2>
      <p className="text-gray-600">
        The news post you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/news"
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Back to All News
      </Link>
    </div>
  );
}
