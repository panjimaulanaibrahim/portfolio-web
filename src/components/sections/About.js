import Image from "next/image";
import { profile, stats } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/effects/Reveal";

export default function About() {
  return (
    <section id="about" className="scroll-mt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-20 md:px-8">
        <SectionHeading index={2} label="About" title="About Me" />

        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
          {/* Left: photo */}
          <Reveal className="relative min-h-[320px] overflow-hidden rounded-2xl border border-line lg:min-h-[420px] lg:flex-1">
            <Image
              src="/images/about/about.jpg"
              alt="Panji with the Oceanos Evo boat prototype in front of the UNS head office"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[center_40%]"
            />
          </Reveal>

          {/* Right: paragraph and stats */}
          <Reveal delay={150} className="flex min-w-0 flex-col justify-center gap-7 lg:flex-[1.4]">
            <p className="text-lg leading-[1.7] text-body md:text-xl">{profile.about}</p>

            <ul className="grid grid-cols-3 gap-3 md:gap-4">
              {stats.map((stat, i) => (
                <Reveal
                  as="li"
                  delay={250 + i * 100}
                  key={stat.label}
                  className="flex flex-col gap-1.5 rounded-[14px] border border-line bg-surface/80 p-4 md:gap-2 md:p-6"
                >
                  <span className="font-display text-3xl font-bold text-heading md:text-[40px]">
                    {stat.value}
                  </span>
                  <span className="text-xs leading-snug text-muted md:text-sm">{stat.label}</span>
                </Reveal>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
