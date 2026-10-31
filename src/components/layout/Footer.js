import { navLinks, profile } from "@/data/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-10 md:px-8">
        <div className="flex flex-col gap-1.5">
          <a href="#home" className="font-display text-xl font-bold text-fg">
            PMI<span className="text-accent">.</span>
          </a>
          <p className="text-sm text-subtle">
            © {year} {profile.name}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6">
            {navLinks
              .filter((link) => link.href !== "#home")
              .map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="block py-3 text-sm text-muted transition-colors hover:text-fg">
                    {link.label}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        <p className="font-mono text-xs tracking-[0.08em] text-faint">
          BUILT WITH NEXT.JS · HOSTED ON FIREBASE
        </p>
      </div>
    </footer>
  );
}