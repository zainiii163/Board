"use client";

import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

type Props = {
  latex: string;
  display?: boolean;
};

export function MathBlock({ latex, display = false }: Props) {
  if (display) {
    return <BlockMath math={latex} />;
  }
  return <InlineMath math={latex} />;
}
