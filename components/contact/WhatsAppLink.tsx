import { MessageCircle } from "lucide-react";
import { profile, isProvided } from "@/content/profile";
import { cn } from "@/lib/cn";

/**
 * WhatsApp direct channel — amendment v5 §3.
 *
 * A link in the direct-channels rail, never a floating bubble or a fixed
 * widget. Ghost button per §5.6 (hairline border, 160ms hover, ≥44px
 * target). A Lucide glyph rather than the WhatsApp mark, and no green
 * brand colour — the site's palette does not admit one.
 *
 * Renders nothing when no number is configured.
 */
export function WhatsAppLink({ className }: { className?: string }) {
  if (!profile.whatsapp || !isProvided(profile.whatsapp)) return null;

  const href = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(
    "Hi Ace, I found you via orji.dev.",
  )}`;

  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      aria-label="Message me on WhatsApp"
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-pill border border-hairline px-5",
        "text-sm text-ink no-underline transition-colors duration-[var(--dur-fast)]",
        "hover:border-slate",
        className,
      )}
    >
      <MessageCircle aria-hidden="true" size={16} />
      WhatsApp
    </a>
  );
}
