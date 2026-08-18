import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants: Record<string, string> = {
  primary: "bg-accent text-white hover:bg-accent/90",
  secondary: "border border-border bg-card hover:bg-background",
  ghost: "hover:bg-background",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
