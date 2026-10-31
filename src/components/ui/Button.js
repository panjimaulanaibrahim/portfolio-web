// Link styled as a button. variant: "primary" (solid blue) or "secondary" (outlined).

const variants = {
  primary: "bg-accent text-white hover:bg-[#1d4fd8]",
  secondary: "border border-line-strong text-fg hover:border-accent-light",
};

export default function Button({ href, variant = "primary", className = "", children, ...props }) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[10px] px-6 py-3.5 text-[15px] font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}