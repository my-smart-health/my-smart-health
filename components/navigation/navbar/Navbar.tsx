import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  return (
    <>
      <nav
        draggable={false}
        className="flex flex-col mx-auto w-full max-w-[90%]"
      >
        <div className="flex flex-row gap-1 items-center justify-evenly">
          <Link
            draggable={false}
            href="/"
            className="flex items-center"
          >
            <Image
              priority
              loading="eager"
              draggable={false}
              src="/navbar.jpg"
              alt="My Smart Health"
              width={350}
              height={112}
              className="w-96 h-auto my-3 mx-auto"
            />
            <span className="ml-2 text-xl font-bold uppercase sr-only">My Smart Health</span>
          </Link>
        </div>
      </nav>
      <ProfileMenu />
    </>
  );
}