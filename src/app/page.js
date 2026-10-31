// TEMPORARY test page for step 4.1.
// It checks that colors, fonts and data files load correctly.
// It will be replaced by the real sections from step 4.2 onward.

import { profile, stats } from "@/data/profile";
import { experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";
import { certifications } from "@/data/certifications";
import { education } from "@/data/education";
import { playlist } from "@/data/playlist";

const swatches = [
  ["ground", "bg-ground"],
  ["surface", "bg-surface"],
  ["line", "bg-line"],
  ["muted", "bg-muted"],
  ["label", "bg-label"],
  ["accent", "bg-accent"],
  ["accent-light", "bg-accent-light"],
  ["success", "bg-success"],
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-8 py-20">
      <p className="font-mono text-xs tracking-[0.14em] text-label">
        STEP 4.1 / FOUNDATION TEST
      </p>

      <div className="flex flex-col gap-3">
        <p className="font-display text-2xl font-medium text-accent">Hi, I&apos;m</p>
        <h1 className="font-display text-6xl font-bold tracking-tight text-heading">
          {profile.name}
        </h1>
        <p className="font-display text-xl font-semibold text-accent-light">
          {profile.slogan}
        </p>
        <p className="max-w-xl text-lg leading-relaxed text-muted">{profile.intro}</p>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {swatches.map(([name, cls]) => (
          <div key={name} className="flex flex-col gap-2">
            <div className={`h-16 rounded-lg border border-line-strong ${cls}`} />
            <span className="font-mono text-xs text-subtle">{name}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-surface/80 p-6 font-mono text-sm text-body">
        <p>Data check:</p>
        <p>{stats.length} stats · {experience.length} jobs · {skillGroups.length} skill groups</p>
        <p>{certifications.length} certifications · {playlist.songs.length} songs</p>
        <p>Education: {education.school}, GPA {education.gpa}</p>
      </div>
    </main>
  );
}