import { profile, socials } from "@/data/profile";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";
import IdCard from "@/components/ui/IdCard";
import { ArrowRightIcon, DownloadIcon, socialIcons } from "@/components/ui/icons";

export default function Hero() {
  // Put the last name on its own line: "Panji Maulana" / "Ibrahim"
  const nameParts = profile.name.split(" ");
  const lastName = nameParts.pop();
  const firstLine = nameParts.join(" ");

  return (
    <section id="home" className="relative scroll-mt-24 overflow-hidden">
      {/* Soft blue glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-52 h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.22),rgba(37,99,235,0)_65%)]"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-5 pb-24 pt-32 md:flex-row md:px-8 md:pb-32 md:pt-40">
        {/* Left column: text */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
          <SectionLabel index={1} name="Home" />

          <div className="flex flex-col gap-2">
            <p className="font-display text-[22px] font-medium text-accent md:text-[28px]">Hi, I&apos;m</p>
            <h1 className="font-display text-[44px] font-bold leading-[1.02] tracking-tight text-heading md:text-[76px]">
              {firstLine}
              <br />
              {lastName}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            <span className="rounded-lg border border-line-strong bg-line/60 px-3.5 py-2 font-mono text-xs tracking-[0.08em] text-fg md:text-sm">
              {profile.role.toUpperCase()}
            </span>
            <span className="font-display text-lg font-semibold text-accent-light md:text-xl">
              {profile.slogan}
            </span>
          </div>

          <p className="max-w-[520px] text-base leading-relaxed text-muted md:text-[17px]">{profile.intro}</p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={profile.cvPath} download>
              Download CV <DownloadIcon />
            </Button>
            <Button href="#experience" variant="secondary">
              View Experience <ArrowRightIcon />
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <span className="font-mono text-xs tracking-[0.14em] text-faint">FIND ME</span>
            <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
            <ul className="flex gap-2">
              {socials.map((social) => {
                const Icon = socialIcons[social.id];
                const external = social.href.startsWith("http");
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
                    >
                      <Icon />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right column: ID card */}
        <div className="flex w-full justify-center md:-mt-24 md:w-auto md:basis-[360px]">
          <IdCard />
        </div>
      </div>
    </section>
  );
}