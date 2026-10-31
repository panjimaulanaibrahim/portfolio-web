import { skillGroups } from "@/data/skills";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/effects/Reveal";

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-20 md:px-8">
        <SectionHeading index={4} label="Skills" title="Technical Skills" />

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal
              as="li"
              delay={i * 100}
              key={group.name}
              className="flex flex-col gap-4 rounded-[14px] border border-line bg-surface/80 p-6"
            >
              <h3 className="font-display text-xl font-semibold text-heading">{group.name}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="rounded-lg border border-line bg-chip px-3 py-2 text-sm text-body">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
