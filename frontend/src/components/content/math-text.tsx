"use client";

import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export function MathText({ text }: { text: string }) {
  // Split the text by $ signs. 
  // e.g. "Express $0.75$ as" -> ["Express ", "0.75", " as"]
  // Even indices are text, odd indices are math.
  const parts = text.split('$');
  
  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return <InlineMath key={index} math={part} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
