export function SlideCounter({ current, total }: { current: number; total: number }) {
  return <span className="slide-counter" dir="ltr"><strong className="slide-counter-current">{String(current).padStart(2, "0")}</strong><span className="slide-counter-total"> / {String(total).padStart(2, "0")}</span></span>;
}
