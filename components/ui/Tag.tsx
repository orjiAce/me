import type { Track } from "@/content/types";
import { cn } from "@/lib/cn";

const TRACK_STYLE: Record<Track, string> = {
  engineering: "border-signal text-signal",
  founder: "border-plum text-plum",
  "open-source": "border-signal text-signal",
};

const TRACK_LABEL: Record<Track, string> = {
  engineering: "Engineering",
  founder: "Founder",
  "open-source": "Open source",
};

/** Track tag — §6: the track accent tints border and text, nothing else. */
export function Tag({ track }: { track: Track }) {
  return (
    <span
      className={cn(
        "mono-label inline-flex items-center rounded-pill border px-3 py-1",
        TRACK_STYLE[track],
      )}
    >
      {TRACK_LABEL[track]}
    </span>
  );
}
