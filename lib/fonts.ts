import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";

/**
 * Display face — §5.2. Variable weights 500–800 used, optical-size axis on.
 * next/font self-hosts at build time: zero runtime third-party requests.
 * Geist Sans / Geist Mono ship from the `geist` package (see app/layout.tsx).
 */
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  axes: ["opsz"],
});

/**
 * SEGO — the wordmark face, owner-supplied and self-hosted from
 * styles/font. Used for the header wordmark only, never for body copy:
 * it has one weight and no italic, so it cannot carry running text.
 */
export const sego = localFont({
  src: [{ path: "../styles/font/SEGO.otf", weight: "400", style: "normal" }],
  display: "swap",
  variable: "--font-sego",
});
