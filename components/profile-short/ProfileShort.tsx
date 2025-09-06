import Image from "next/image";
import Link from "next/link";

export default function ProfileShort({ id, name, bio, image }: { id: string; name: string; bio: string; image: string }) {
  return (
    <>
      <div className="flex flex-col p-3 gap-1 border border-dashed rounded-lg bg-white/80 shadow-md hover:shadow-xl transition-shadow">
        <h3 className="font-bold text-lg">{name}</h3>
        <div className="flex h-full">
          <Image src={image} alt={name} width={96} height={96} className=" w-full h-full aspect-square rounded-lg" />
        </div>
        <p className="text-gray-600 line-clamp-3">{bio}</p>
      </div>
      <span className="flex justify-end">
        <Link href={`/profile/${id}`} className="btn btn-sm btn-primary self-end mt-2">
          View Profile
        </Link>
      </span>
    </>
  );
}