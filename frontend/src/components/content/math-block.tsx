"use client";

type Props = {
  latex: string;
  display?: boolean;
};

export function MathBlock({ latex, display = false }: Props) {
  return (
    <span
      className={display ? "block overflow-x-auto py-2 text-center" : ""}
      data-latex={latex}
    >
      {latex}
    </span>
  );
}
