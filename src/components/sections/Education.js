import Image from "next/image";
import { achievement, education, organizations, publication } from "@/data/education";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import Reveal from "@/components/effects/Reveal";

const cardClass = "flex flex-col overflow-hidden rounded-[14px] border border-line bg-surface/80";
const smallLabel = "font-mono text-[11px] tracking-[0.14em] text-faint";

export default function Education() {
  return (
    <section id="education" className="scroll-mt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-20 md:px-8">
        <SectionHeading index={6} label="Education" title="Education & Achievements" />

        {/* Row 1: degree and publication */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Reveal as="article" className={cardClass}>
            <div className="relative h-56">
              <Image
                src={education.image}
                alt={education.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-[60%_30%]"
              />
            </div>
            <div className="flex flex-col gap-3 p-6">
              <p className={smallLabel}>EDUCATION · {education.years}</p>
              <h3 className="font-display text-2xl font-bold text-heading">{education.school}</h3>
              <p className="text-[15px] text-muted">{education.degree}</p>
              <p className="flex items-baseline gap-2 pt-1">
                <span className="font-display text-4xl font-bold text-accent-light">{education.gpa}</span>
                <span className="text-sm text-subtle">/ {education.gpaScale} GPA</span>
              </p>
            </div>
          </Reveal>

          <Reveal as="article" delay={120} className={cardClass}>
            <div className="relative h-56">
              <Image
                src={publication.image}
                alt={publication.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-3 p-6">
              <p className={smallLabel}>RESEARCH &amp; PUBLICATION · {publication.role.toUpperCase()}</p>
              <h3 className="font-display text-xl font-semibold leading-snug text-heading">{publication.title}</h3>
              <p className="text-sm text-muted">
                {publication.venue} · {publication.event}
              </p>
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 self-start font-mono text-[13px]"
              >
                DOI {publication.doi}
                <ArrowUpRightIcon width={14} height={14} />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Row 2: organizations */}
        <div className="flex flex-col gap-4">
          <p className={smallLabel}>ORGANIZATIONS</p>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org, i) => (
              <Reveal as="li" delay={i * 120} key={org.role} className={cardClass}>
                <div className="relative h-48">
                  <Image
                    src={org.image}
                    alt={org.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1.5 p-5">
                  <span className="font-mono text-xs text-accent-light">{org.years}</span>
                  <h3 className="font-display text-[17px] font-semibold leading-snug text-heading">{org.role}</h3>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Row 3: achievement, shown wide */}
        <Reveal as="article" className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/80 lg:flex-row">
          <div className="relative h-64 sm:h-80 lg:h-auto lg:min-h-[360px] lg:flex-[1.4]">
            <Image
              src={achievement.image}
              alt={achievement.alt}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-3 p-6 md:p-8 lg:flex-1">
            <p className={smallLabel}>ACHIEVEMENT · {achievement.event}</p>
            <h3 className="font-display text-xl font-semibold leading-snug text-heading md:text-2xl">
              {achievement.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">{achievement.detail}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
