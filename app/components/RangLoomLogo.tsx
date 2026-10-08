import React from "react";

interface LogoProps {
  variant?: "stacked" | "horizontal" | "emblem" | "reversed-stacked" | "reversed-horizontal";
  className?: string;
  size?: number;
  showSubtitle?: boolean;
  showEmblem?: boolean;
}

/**
 * The Bloom & Weave Emblem — Rang & Loom
 * Handcrafted vector representation of the official brand monogram:
 * - Stylized serif 'R' with woven thread leg
 * - Emerald Green stem and loop (#0F5132)
 * - Terracotta sweeping leg (#C86D51)
 * - Mustard Gold botanical leaf accents (#D4AF37)
 */
export function RangLoomEmblem({
  size = 56,
  reversed = false,
  className = "",
}: {
  size?: number;
  reversed?: boolean;
  className?: string;
}) {
  const emerald = reversed ? "#F5EDE2" : "#0F5132";
  const terracotta = reversed ? "#E0876E" : "#C86D51";
  const gold = reversed ? "#F3D268" : "#D4AF37";
  const shadow = reversed ? "rgba(0,0,0,0.25)" : "rgba(15,81,50,0.12)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Rang & Loom Emblem"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <defs>
        <filter id={`emblem-shadow-${reversed ? "rev" : "reg"}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor={shadow} />
        </filter>
        <linearGradient id={`gold-leaf-${reversed ? "rev" : "reg"}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={reversed ? "#FFF1B8" : "#E2C35D"} />
          <stop offset="100%" stopColor={gold} />
        </linearGradient>
        <linearGradient id={`terracotta-ribbon-${reversed ? "rev" : "reg"}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={terracotta} />
          <stop offset="100%" stopColor={reversed ? "#CB7359" : "#B65A3F"} />
        </linearGradient>
      </defs>

      <g filter={`url(#emblem-shadow-${reversed ? "rev" : "reg"})`}>
        {/* Left vertical stem with classic serif bracket */}
        <path
          d="M24 23.5 C24 22 26 21 30 21 L39 21 C39 24 37 25 35 25.5 L35 77 C37.5 77.5 40 78.5 40 81 L25 81 C25 78.5 27.5 77.5 30 77 L30 25.5 C28 25 25 24 24 23.5 Z"
          fill={emerald}
        />

        {/* Upper loop of 'R' (Emerald Green) */}
        <path
          d="M33 22 C43 22 56 23 57.5 33.5 C59 44 49 51 36 51 L32 51 L32 44.5 L36 44.5 C43 44.5 49.5 40.5 48.5 33.5 C47.5 27.5 40 27 34 27 L33 22 Z"
          fill={emerald}
        />

        {/* Sweeping calligraphic leg of 'R' - Woven Thread (Terracotta) */}
        <path
          d="M39 47.5 C44 47.5 50 49 53 53.5 C57.5 60.5 61 71.5 70 78 C74.5 81.2 81 81.5 84 79 C79 83 70 82 63.5 76 C56 69 51.5 58 48 53.5 C45.5 50.5 42 49 38 48.5 L39 47.5 Z"
          fill={`url(#terracotta-ribbon-${reversed ? "rev" : "reg"})`}
        />

        {/* Botanical Leaf 1: Mustard Gold blooming leaf */}
        <path
          d="M58 29 C65 24 74 25.5 80 29.5 C77 37 69 40 60 36.5 C59 34 58.5 31.5 58 29 Z"
          fill={`url(#gold-leaf-${reversed ? "rev" : "reg"})`}
        />

        {/* Botanical Leaf 2: Accent leaf in Terracotta */}
        <path
          d="M62 38 C68 37 75 40 77 45.5 C72 47.5 65 46 61.5 42 C61.5 40.5 61.8 39.2 62 38 Z"
          fill={terracotta}
        />

        {/* Leaf bud in Gold */}
        <circle cx="56.5" cy="22" r="2.2" fill={gold} />
      </g>
    </svg>
  );
}

/**
 * Botanical Leaf Utility Element (From Section 06)
 */
export function BrandLeafPair({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 48 C16 34 22 18 36 12 C36 28 30 42 20 48 Z"
        fill="#C86D51"
      />
      <path
        d="M26 42 C30 32 38 22 50 20 C46 32 40 40 26 42 Z"
        fill="#D4AF37"
      />
    </svg>
  );
}

/**
 * Full Rang & Loom Logo Component
 * Renders the clean, elegant typographical wordmark with brand serif typography
 * and "HOME TEXTILES & SOFT FURNISHINGS" subtitle.
 */
export default function RangLoomLogo({
  variant = "stacked",
  className = "",
  size = 52,
  showSubtitle = true,
  showEmblem = false,
}: LogoProps) {
  const isReversed = variant.startsWith("reversed");

  if (variant === "emblem") {
    return <RangLoomEmblem size={size} reversed={isReversed} className={className} />;
  }

  const textColor = isReversed ? "#FFFDF8" : "#1A231D";
  const subtextColor = isReversed ? "#D4AF37" : "#565C50";
  const ampersandColor = isReversed ? "#E5C865" : "#C86D51";

  return (
    <div
      className={`brand-logo ${className}`}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        textDecoration: "none",
      }}
    >
      {showEmblem && (
        <div style={{ marginBottom: `${Math.round(size * 0.12)}px` }}>
          <RangLoomEmblem size={size} reversed={isReversed} />
        </div>
      )}
      <div
        style={{
          fontFamily: "var(--font-serif), Georgia, serif",
          fontSize: `${Math.round(size * 0.58)}px`,
          fontWeight: 500,
          letterSpacing: "0.18em",
          lineHeight: 1,
          color: textColor,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        RANG{" "}
        <em
          style={{
            fontStyle: "italic",
            fontFamily: "var(--font-serif), Georgia, serif",
            color: ampersandColor,
            fontWeight: 400,
            fontSize: "1.08em",
            margin: "0 1px",
          }}
        >
          &
        </em>{" "}
        LOOM
      </div>
      {showSubtitle && (
        <div
          style={{
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: `${Math.max(6.5, Math.round(size * 0.15))}px`,
            fontWeight: 500,
            letterSpacing: "0.28em",
            lineHeight: 1,
            color: subtextColor,
            textTransform: "uppercase",
            marginTop: `${Math.max(4, Math.round(size * 0.14))}px`,
            whiteSpace: "nowrap",
          }}
        >
          HOME TEXTILES &amp; SOFT FURNISHINGS
        </div>
      )}
    </div>
  );
}
