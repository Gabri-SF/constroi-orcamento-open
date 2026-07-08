import { BRAND } from "@/config/company";

interface Props {
  /** "onLight" for the app header / document header. "onDark" for the navy document footer. */
  variant?: "onLight" | "onDark";
  markSize?: number;
  nameSize?: number;
  tagSize?: number;
}

// Shared logo mark used in the app header and the printed document's header
// and footer. Replace the <svg> mark below with your own logo (an <img> tag
// works too), and set BRAND.shortName / BRAND.tagline in src/config/company.ts.
export const Logo = ({ variant = "onLight", markSize = 42, nameSize = 20, tagSize = 7 }: Props) => {
  const onDark = variant === "onDark";
  const outer = onDark ? "#fff" : "#102A43";
  const inner = onDark ? "#54A0EA" : "#2B7FD6";
  const nameColor = onDark ? "#fff" : "#102A43";
  const tagColor = onDark ? "#9DB4CC" : "#5B6B7B";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg width={markSize} height={markSize * 0.71} viewBox="0 0 100 70" fill="none">
        <path d="M6 56 L50 16 L94 56" stroke={outer} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 56 L50 36 L72 56" stroke={inner} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <div style={{ fontSize: nameSize, fontWeight: 800, letterSpacing: "0.04em", color: nameColor, lineHeight: 1 }}>
          {BRAND.shortName}
        </div>
        <div style={{ fontSize: tagSize, fontWeight: 600, letterSpacing: "0.22em", color: tagColor, marginTop: 3 }}>
          {BRAND.tagline}
        </div>
      </div>
    </div>
  );
};
