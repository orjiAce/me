import Link from "next/link";
import { profile, isProvided } from "@/content/profile";
import { Container } from "./Container";

const FOOTER_NAV = [
  { label: "Work", href: "/work" },
  { label: "Zowis", href: "/zowis" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Large-type footer — §10.8. Full-bleed mist → fog wash (§5.1 redirect
 * item 6, degrades to flat mist), oversized display navigation with an
 * underline sweep, then contact/meta rows and the bottom bar.
 */
export function Footer() {
  return (
    <footer className="wash-footer">
      <Container className="py-[var(--section-y-sm)] md:py-[var(--section-y-md)]">
        <nav aria-label="Footer">
          <ul className="flex flex-col gap-1">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="sweep-link font-display text-h1 font-semibold text-ink no-underline"
                >
                  <span aria-hidden="true" className="text-slate">
                    /
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1">
            {isProvided(profile.email) && (
              <a
                href={`mailto:${profile.email}`}
                className="text-lead text-ink no-underline hover:underline"
              >
                {profile.email}
              </a>
            )}
            <p className="mono-label text-slate">
              {profile.location} · {profile.timezone}
            </p>
          </div>

          {profile.socials.length > 0 && (
            <ul className="flex flex-wrap gap-6">
              {profile.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-sm text-graphite no-underline transition-colors duration-[var(--dur-fast)] hover:text-ink"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-hairline pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate">
            © 2026 {profile.name} · {profile.company}
          </p>
          <p className="mono-label text-slate">Built with Next.js</p>
        </div>
      </Container>
    </footer>
  );
}
