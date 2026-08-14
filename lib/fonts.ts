import { Bricolage_Grotesque } from "next/font/google";

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
