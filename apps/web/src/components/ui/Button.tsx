import Link from "next/link";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand text-surface hover:bg-brand-soft border border-transparent",
  secondary:
    "bg-transparent text-brand border border-brand/30 hover:border-accent hover:text-brand-soft",
  ghost: "bg-transparent text-brand hover:text-accent border border-transparent",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm tracking-wide transition ${variants[variant]} disabled:opacity-60 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
