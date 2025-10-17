import Image from "next/image";
import Link from "next/link";

export default function TheHealthBarLink() {
  return (
    <>

      <Link
        draggable={false}
        href="/the-health-bar"
        className="flex justify-center items-center w-full mx-auto max-w-[90%]"
        title="The Health Bar"
      >
        <div className="w-full flex justify-center">
          <div className="w-full max-w-full border border-primary rounded p-6 mt-6 text-center">
            <svg viewBox="0 0 1000 200" width="100%" height="auto" preserveAspectRatio="xMidYMid meet" role="img" aria-label="the Health Bar">
              <defs>
                <style>{".t{fill:#20b7b0;font-family:'Playfair Display',Georgia,'Times New Roman',serif;font-weight:700;}"}</style>
              </defs>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="t" fontSize="133">the Health Bar</text>
            </svg>
          </div>
        </div>
      </Link>
    </>
  );
}
