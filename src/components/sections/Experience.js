import Image from "next/image";
import { experience } from "@/data/experience";
import SectionHeading from "@/components/ui/SectionHeading";
import { CameraIcon } from "@/components/ui/icons";
import Reveal from "@/components/effects/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-20 md:px-8">
        <SectionHeading index={3} label="Experience" title="Work Experience" />

        <ol className="ml-2 flex flex-col border-l border-line-strong">
          {experience.map((job, i) => (
            <Reveal
              as="li"
              delay={i * 120}
              key={job.company}
              className="relative flex flex-col gap-3 pb-8 pl-7 last:pb-0 md:flex-row md:items-center md:gap-8 md:pl-10"
            >
              {/* Timeline dot */}
              <span
                aria-hidden="true"
                className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-[#3b82f6] bg-ground md:top-1/2 md:-translate-y-1/2"
              />

              <span className="font-mono text-sm text-accent-light md:w-[150px] md:shrink-0">{job.years}</span>

              <article className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-line bg-surface/80 sm:flex-row">
                {/* Photo, or a placeholder when there is none yet */}
                <div className="relative h-44 w-full shrink-0 sm:h-auto sm:min-h-[150px] sm:w-60">
                  {job.image ? (
                    <Image
                      src={job.image}
                      alt={job.alt}
                      fill
                      sizes="(min-width: 640px) 240px, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-b border-dashed border-line-strong bg-panel font-mono text-[11px] tracking-[0.12em] text-faint sm:border-b-0 sm:border-r">
                      <CameraIcon width={22} height={22} />
                      PHOTO COMING SOON
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-wrap items-center justify-between gap-4 p-5 md:p-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-xl font-semibold text-heading md:text-[22px]">{job.role}</h3>
                    <p className="text-[15px] text-muted">{job.company}</p>
                  </div>
                  {job.current && (
                    <span className="rounded-full border border-[#1f5a45] px-2.5 py-1.5 font-mono text-[11px] tracking-[0.12em] text-success">
                      CURRENT
                    </span>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
