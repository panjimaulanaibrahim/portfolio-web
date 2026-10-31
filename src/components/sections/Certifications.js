import Image from "next/image";
import { certifications } from "@/data/certifications";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/effects/Reveal";

// Badge text and color per certificate type
const typeStyles = {
  certified: { label: "CERTIFIED", className: "border-[#1f5a45] text-success" },
  training: { label: "TRAINING", className: "border-line-strong text-muted" },
  bootcamp: { label: "BOOTCAMP", className: "border-line-strong text-muted" },
};

export default function Certifications() {
  return (
    <section id="certifications" className="scroll-mt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-20 md:px-8">
        <SectionHeading index={5} label="Certifications" title="Certifications & Training" />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert, i) => {
            const type = typeStyles[cert.type] ?? typeStyles.training;
            const meta = [cert.date, cert.duration].filter(Boolean).join(" · ").toUpperCase();
            return (
              <Reveal
                as="li"
                delay={i * 110}
                key={cert.name}
                className="flex flex-col overflow-hidden rounded-[14px] border border-line bg-surface/80"
              >
                {/* Clicking the image opens the full certificate in a new tab */}
                <a
                  href={cert.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View certificate: ${cert.name}`}
                  className="relative block h-44 border-b border-line"
                >
                  <Image
                    src={cert.image}
                    alt={`${cert.name} certificate`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-opacity hover:opacity-85"
                  />
                </a>
                <div className="flex flex-1 flex-col gap-2.5 p-5">
                  <span
                    className={`self-start rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-[0.12em] ${type.className}`}
                  >
                    {type.label}
                  </span>
                  <h3 className="font-display text-[17px] font-semibold leading-snug text-heading">{cert.name}</h3>
                  <p className="text-[13px] text-muted">{cert.issuer}</p>
                  <p className="mt-auto pt-1 font-mono text-xs text-faint">{meta}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
