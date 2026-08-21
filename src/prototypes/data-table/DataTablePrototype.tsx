import { useLayoutEffect, useRef, useState } from "react";
import { AnchoredRules } from "./AnchoredRules";
import { CommandFilter } from "./CommandFilter";
import { ProgressiveFilter } from "./ProgressiveFilter";

const variants = [
  { name: "Ancorado", component: AnchoredRules },
  { name: "Progressivo", component: ProgressiveFilter },
  { name: "Comando", component: CommandFilter },
];

function initialVariant() {
  const value = Number(new URLSearchParams(window.location.search).get("v") ?? "1") - 1;
  return Number.isInteger(value) && value >= 0 && value < variants.length ? value : 0;
}

export function DataTablePrototype() {
  const [current, setCurrent] = useState(initialVariant);
  const pickerRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const Variant = variants[current].component;

  function moveHighlight() {
    const item = itemRefs.current[current];
    if (!item || !highlightRef.current) return;
    highlightRef.current.style.width = `${item.offsetWidth}px`;
    highlightRef.current.style.transform = `translateX(${item.offsetLeft}px)`;
  }

  function selectVariant(index: number) {
    if (index < 0 || index >= variants.length) return;
    setCurrent(index);
    const url = new URL(window.location.href);
    url.searchParams.set("v", String(index + 1));
    window.history.replaceState(null, "", url);
  }

  useLayoutEffect(() => {
    moveHighlight();
    const readyFrame = requestAnimationFrame(() => requestAnimationFrame(() => pickerRef.current?.setAttribute("data-ready", "")));
    const onResize = () => moveHighlight();
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const number = Number.parseInt(event.key, 10);
      if (number >= 1 && number <= variants.length) selectVariant(number - 1);
      else if (event.key === "ArrowRight") selectVariant((current + 1) % variants.length);
      else if (event.key === "ArrowLeft") selectVariant((current - 1 + variants.length) % variants.length);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(readyFrame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [current]);

  return (
    <>
      <div id="stage"><Variant key={current} /></div>
      <nav className="proto-picker" aria-label="Prototype variants" ref={pickerRef}>
        <span className="proto-picker-highlight" aria-hidden="true" ref={highlightRef}></span>
        {variants.map((variant, index) => (
          <button
            className="proto-picker-item"
            data-active={current === index || undefined}
            aria-current={current === index ? "true" : undefined}
            key={variant.name}
            onClick={() => selectVariant(index)}
            ref={(element) => { itemRefs.current[index] = element; }}
          >
            {variant.name}
          </button>
        ))}
      </nav>
    </>
  );
}
