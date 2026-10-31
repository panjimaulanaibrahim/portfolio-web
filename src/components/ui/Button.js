// Link styled as a button. variant: "primary" (solid blue) or "secondary" (outlined).
// Without an href it renders as a disabled button (for example "CV coming soon").

const variants = {
  primary: "bg-accent text-white hover:bg-[#1d4fd8]",
  secondary: "border border-line-strong text-fg hover:border-accent-light",
};

export default function Button({ href, variant = "primary", className = "", children, ...props }) {
  const base = "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[10px] px-6 py-3.5 text-[15px] font-semibold";
  if (!href) {
    return (
      <span aria-disabled="true" className={`${base} cursor-not-allowed border border-dashed border-line-strong text-faint ${className}`}>
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      className={`${base} transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}