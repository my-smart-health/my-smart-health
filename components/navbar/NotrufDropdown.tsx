import Image from "next/image";

export default function NotrufButton() {

  return (
    <div className="navbar-end">
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-square w-full">
          <Image
            priority
            draggable={false}
            src="/icon1.png"
            alt="Notruf"
            width={60}
            height={60}
            className={`w-[60px] h-[60px] aspect-square hover:scale-110 transition-transform ease-in-out shadow-lg shadow-[#2a2a2ad9]`} />
        </div>
        <ul
          tabIndex={0}
          className="menu menu-md dropdown-center dropdown-content bg-base-100 rounded-box z-1 mt-4 w-52 p-2 shadow border-3 border-primary">
          <li>
            <a
              href="tel:112"
              className={`hover:underline cursor-pointer border-b-2 px-5 py-2 border-primary`}
            >
              Notruf<br />112
            </a>
          </li>
          <li><a
            href="tel:116117"
            className={`hover:underline cursor-pointer border-b-2 px-5 py-2 border-primary`}
          >
            Bereitschaftsarzt<br />116117
          </a></li>
          <li><a
            href="tel:19222"
            className="hover:underline cursor-pointer px-5 py-2"
          >
            Krankentransport<br />19222
          </a></li>
        </ul>
      </div>
    </div>
  );
}