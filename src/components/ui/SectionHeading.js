// Label + large heading at the top of each section.
// The heading fades up and its letters scramble into place the first time it scrolls into view.

import SectionLabel from "./SectionLabel";
import Reveal from "@/components/effects/Reveal";
import ScrambleText from "@/components/effects/ScrambleText";

export default function SectionHeading({ index, label, title }) {
  return (
    <Reveal className="flex flex-col gap-3">
      <SectionLabel index={index} name={label} />
      <ScrambleText
        as="h2"
        text={title}
        className="font-display text-4xl font-bold tracking-tight text-heading md:text-[56px] md:leading-[1.1]"
      />
    </Reveal>
  );
}
