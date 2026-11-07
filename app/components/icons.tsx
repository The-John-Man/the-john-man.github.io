export function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      className="arrow-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={back ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}
export function ProjectArt({ kind }: { kind: string }) {
  return (
    <svg
      className={"illustration art-" + kind}
      viewBox="0 0 640 400"
      role="img"
      aria-label={`${kind} concept illustration, not a project screenshot`}
    >
      <rect width="640" height="400" fill="#e9e8df" />
      {Array.from({ length: 15 }, (_, i) => (
        <path
          key={i}
          d={`M0 ${i * 30}H640 M${i * 45} 0V400`}
          stroke="#d4d6cc"
          strokeWidth=".7"
        />
      ))}
      {kind === "wiretrace" ? (
        <>
          <rect
            x="80"
            y="80"
            width="480"
            height="240"
            rx="14"
            fill="#f7f5ef"
            stroke="#c2c6bf"
          />
          {Array.from({ length: 120 }, (_, i) => (
            <circle
              key={i}
              cx={110 + (i % 24) * 18}
              cy={110 + Math.floor(i / 24) * 40}
              r="3"
              fill="#929a96"
            />
          ))}
          <path
            d="M128 110H236V270H434V150"
            fill="none"
            stroke="#2448cf"
            strokeWidth="7"
          />
          <path
            d="M164 150V230H380"
            fill="none"
            stroke="#a5aca5"
            strokeWidth="5"
          />
          <rect x="266" y="159" width="116" height="62" rx="5" fill="#20252c" />
          <text
            x="289"
            y="196"
            fill="#ddd"
            fontFamily="monospace"
            fontSize="17"
          >
            SIGNAL
          </text>
        </>
      ) : kind === "facetracekr" ? (
        <>
          <path
            d="M190 92h-35v35m295-35h35v35M190 310h-35v-35m295 35h35v-35"
            fill="none"
            stroke="#2448cf"
            strokeWidth="3"
          />
          <ellipse
            cx="320"
            cy="192"
            rx="90"
            ry="118"
            fill="none"
            stroke="#84928c"
            strokeWidth="2"
          />
          <path
            d="M250 170l28-15 24 14m35 0 25-14 28 15M320 175l-13 48 26 2m-47 32q34 25 68-4"
            fill="none"
            stroke="#2448cf"
            strokeWidth="3"
          />
          {[
            [250, 170],
            [278, 155],
            [302, 169],
            [337, 169],
            [362, 155],
            [390, 170],
            [307, 223],
            [286, 257],
            [354, 253],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="5" fill="#2448cf" />
          ))}
          <path d="M465 224v59l18-16 21 1Z" fill="#17191c" />
        </>
      ) : kind === "humline" ? (
        <>
          {Array.from({ length: 43 }, (_, i) => (
            <path
              key={i}
              d={`M${70 + i * 12} ${120 - Math.sin(i * 0.6) * Math.sin(i * 0.14) * 58}v${Math.sin(i * 0.6) * Math.sin(i * 0.14) * 116}`}
              stroke="#2448cf"
              strokeWidth="5"
            />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <rect
              key={i}
              x={80 + i * 61}
              y={230 + (i % 3) * 20}
              width="49"
              height="13"
              rx="3"
              fill={i % 2 ? "#889ba6" : "#2448cf"}
            />
          ))}
          <path d="M60 200h520" stroke="#b0b8af" />
        </>
      ) : (
        <>
          <path
            d="M130 315V90h380v225M130 110h380M160 315V140m320 175V140"
            fill="none"
            stroke="#7d8888"
            strokeWidth="12"
          />
          <rect x="275" y="78" width="90" height="55" fill="#2448cf" />
          <path
            d="M320 133v108m-27 20v-22h54v22"
            fill="none"
            stroke="#2448cf"
            strokeWidth="7"
          />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={185 - i * 12}
              y={275 + i * 11}
              width={60 + i * 24}
              height="10"
              rx="3"
              fill="#a6afa6"
            />
          ))}
          <path d="M100 325h440" stroke="#17191c" strokeWidth="4" />
        </>
      )}
      <text
        x="28"
        y="376"
        fill="#626c69"
        fontFamily="monospace"
        fontSize="11"
        letterSpacing="2"
      >
        CONCEPT STUDY / {kind.toUpperCase()}
      </text>
    </svg>
  );
}
