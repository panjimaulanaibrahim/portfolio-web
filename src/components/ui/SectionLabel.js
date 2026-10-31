// Small mono label above every section heading, e.g. "SEC.03 / EXPERIENCE".

export default function SectionLabel({ index, name }) {
  return (
    <p className="font-mono text-xs tracking-[0.14em] text-label">
      SEC.{String(index).padStart(2, "0")} / {name.toUpperCase()}
    </p>
  );
}