import type { MDXComponents } from "mdx/types";

/**
 * Required by @next/mdx in the App Router. Case-study bodies render inside
 * a `.prose`-scoped wrapper (styles/globals.css), so no per-element
 * overrides are needed here.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return components;
}
