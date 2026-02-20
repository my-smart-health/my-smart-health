import GoBack from "@/components/buttons/go-back/GoBack";

export default function MemberHeader({ name }: { name: string | null }) {
  return (
    <div className="flex justify-between items-center w-full gap-2">
      <h2 className="font-bold self-end text-primary text-xl break-words">{name || "Member"}</h2>
      <GoBack />
    </div>
  );
}
