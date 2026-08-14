/**
 * TS mirror of the motion tokens in styles/globals.css (§5.5), for use as
 * `motion/react` values. Durations are seconds; easings are cubic-bezier
 * tuples. If a value changes here it must change in the @theme block too.
 */
export const duration = {
  fast: 0.16,
  base: 0.32,
  slow: 0.62,
} as const;

export const easeOut = [0.16, 1, 0.3, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const stagger = 0.06;
