import { profile, socials } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/ui/ContactForm";
import { ArrowUpRightIcon, DownloadIcon } from "@/components/ui/icons";
import Reveal from "@/components/effects/Reveal";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 pb-24 pt-20 md:px-8">
        <SectionHeading index={8} label="Contact" title="Let's Build Something Reliable" />

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left: direct contact links */}
          <Reveal className="flex min-w-0 flex-col gap-3 lg:flex-1">
            <p className="mb-2 text-base leading-relaxed text-muted md:text-[17px]">{profile.contactIntro}</p>

            <ul className="flex flex-col gap-3">
              {socials.map((social) => {
                const external = social.href.startsWith("http");
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-line bg-surface/80 px-[18px] py-4 transition-colors hover:border-line-strong"
                    >
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="font-mono text-[11px] tracking-[0.12em] text-faint">
                          {social.label.toUpperCase()}
                        </span>
                        <span className="truncate text-[15px] text-fg">{social.handle}</span>
                      </span>
                      <ArrowUpRightIcon width={16} height={16} className="shrink-0 text-accent-light" />
                    </a>
                  </li>
                );
              })}
            </ul>

            <Button href={profile.cvPath} download className="mt-2">
              Download CV (PDF) <DownloadIcon />
            </Button>
          </Reveal>

          {/* Right: message form */}
          <Reveal delay={150} className="min-w-0 lg:flex-[1.2]">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
