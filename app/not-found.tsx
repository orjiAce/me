import Link from "next/link";
import { Section } from "@/components/layout/Section";

/** 404 — §10.9. No illustration, no joke. */
export default function NotFound() {
  return (
    <Section className="min-h-[60svh]">
      <h1 className="font-display text-h1 font-semibold">
        That page doesn&rsquo;t exist.
      </h1>
      <p className="measure mt-6 text-lead">
        The link may be old, or the address mistyped.
      </p>
      <ul className="mt-10 flex flex-wrap gap-8">
        <li>
          <Link href="/" className="text-ink underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/work" className="text-ink underline">
            Work
          </Link>
        </li>
        <li>
          <Link href="/contact" className="text-ink underline">
            Contact
          </Link>
        </li>
      </ul>
    </Section>
  );
}
