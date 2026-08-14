"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

const NAV = [
  { label: "Work", href: "/work" },
  { label: "Zowis", href: "/zowis" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
] as const;

/**
 * Sticky header — §10.1. Paper background; hairline bottom border appears
 * only after 40px of scroll. Mobile: full-screen overlay menu (Radix Dialog
 * provides focus trap, Escape-to-close, scroll lock and focus return).
 * The 40ms staggered link entrance is deferred to the motion pass (M8).
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-paper",
        "border-b transition-colors duration-[var(--dur-fast)]",
        scrolled ? "border-hairline" : "border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-baseline gap-1.5 text-ink no-underline"
          aria-label="Ace Orji — home"
        >
          <span className="font-display text-[1.375rem] font-bold leading-none tracking-[-0.02em]">
            ACE
          </span>
          <span className="mono-label text-slate">ORJI</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-graphite no-underline transition-colors duration-[var(--dur-fast)] hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden min-h-11 items-center rounded-pill bg-ink px-5 text-sm font-medium text-paper no-underline transition-colors duration-[var(--dur-fast)] hover:bg-signal md:inline-flex"
          >
            Get in touch
          </Link>

          {/* Mobile menu */}
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex size-11 items-center justify-center rounded-sm text-ink md:hidden"
              >
                <Menu size={22} aria-hidden="true" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-0 z-[60] flex h-dvh flex-col bg-paper"
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <div className="flex h-16 items-center justify-between px-[var(--gutter-sm)]">
                  <span className="font-display text-[1.375rem] font-bold leading-none tracking-[-0.02em] text-ink">
                    ACE
                  </span>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="inline-flex size-11 items-center justify-center rounded-sm text-ink"
                    >
                      <X size={22} aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>
                <nav
                  aria-label="Primary"
                  className="flex flex-1 flex-col justify-center gap-2 px-[var(--gutter-sm)]"
                >
                  {[...NAV, { label: "Contact", href: "/contact" } as const].map(
                    (item) => (
                      <Dialog.Close asChild key={item.href}>
                        <Link
                          href={item.href}
                          className="font-display text-h2 font-semibold text-ink no-underline"
                        >
                          {item.label}
                        </Link>
                      </Dialog.Close>
                    ),
                  )}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </Container>
    </header>
  );
}
