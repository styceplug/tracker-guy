import type { CSSProperties } from "react";

/** Stagger delay for scroll-reveal elements: style={d(index)} */
export const d = (i: number, step = 90): CSSProperties => ({ "--d": `${i * step}ms` }) as CSSProperties;
