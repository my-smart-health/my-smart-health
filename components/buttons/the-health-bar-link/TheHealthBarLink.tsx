import Link from "next/link";

export default function TheHealthBarLink() {
  return (
    <Link
      draggable={false}
      href="/the-health-bar"
      className="flex justify-center items-center w-full mx-auto max-w-[90%]"
      title="The Health Bar"
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-full border border-primary rounded p-6 mt-6 text-center hover:shadow-lg transition-shadow">
          <svg
            viewBox="0 0 1000 200"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="the Health Shop"
            className="w-full h-auto"
          >
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="122"
              fontFamily="'Playfair Display', Georgia, 'Times New Roman', serif"
              fontWeight="700"
              fill="#20b7b0"
            >
              the Health Shop
            </text>
          </svg>
        </div>
      </div>
    </Link>
  );
}
