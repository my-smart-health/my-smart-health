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
        <div className="w-full max-w-full border border-primary rounded-2xl p-6 mt-6 text-center hover:shadow-lg transition-shadow">
          <svg
            viewBox="0 0 800 150"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="unser Health Shop für Düsseldorf"
            className="w-full h-auto"
          >
            <defs>
              <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap');
                  .health-shop-text {
                    font-family: 'Merriweather', 'Georgia', serif;
                    font-weight: 700;
                    fill: #1ca9a3;
                  }
                `}
              </style>
            </defs>
            <text
              x="50%"
              y="42"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="52"
              className="health-shop-text"
              letterSpacing="-0.5"
            >
              unser Health Shop
            </text>
            <text
              x="50%"
              y="105"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="52"
              className="health-shop-text"
              letterSpacing="-0.5"
            >
              für Düsseldorf
            </text>
          </svg>
        </div>
      </div>
    </Link>
  );
}
