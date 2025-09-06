import Image from "next/image";

export default function ProfileShort({ name, bio, image }: { name: string; bio: string; image: string }) {
  return (
    <div className="flex justify-between p-2 gap-1 border">
      <div className="flex flex-col flex-1 justify-center gap-2 ">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-gray-600 line-clamp-3">{bio}</p>
      </div>
      <div className="flex p-2">
        <Image src={image} alt={name} width={96} height={96} className="w-24 h-24 rounded-lg" />
      </div>
    </div>
  );
}