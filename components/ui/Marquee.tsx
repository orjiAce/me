/**
 * Horizontal name marquee — §10.1.4. Names in the display face, not
 * logos. Pure CSS: a duplicated track on a 40s linear transform loop,
 * paused on hover. Under reduced motion the duplicate hides and the list
 * renders as a static wrapped row (§11.6). Screen readers get a plain
 * list; the moving tracks are decoration.
 */
export function Marquee({ items }: { items: string[] }) {
  const Row = ({ hidden }: { hidden?: boolean }) => (
    <div className={hidden ? "marquee-half marquee-dup" : "marquee-half"}>
      {items.map((item) => (
        <span
          key={item}
          className="font-display text-h3 font-semibold text-slate"
        >
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div aria-label="Clients and products">
      <p className="sr-only">{items.join(", ")}</p>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}
