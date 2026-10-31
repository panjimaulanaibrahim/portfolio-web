import SectionLabel from "@/components/ui/SectionLabel";
import { playlist } from "@/data/playlist";
import Reveal from "@/components/effects/Reveal";

export default function PlaylistSection() {
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlist.spotifyId}?utm_source=generator&theme=0`;

  return (
    <section id="playlist" aria-labelledby="playlist-title" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <Reveal className="flex flex-col gap-10 rounded-[22px] border border-line bg-[linear-gradient(135deg,#0d1630_0%,#080c18_70%)] p-6 md:p-12 lg:flex-row lg:items-center lg:gap-12">
          {/* Left: headline and text */}
          <div className="flex min-w-0 flex-col gap-5 lg:flex-[1.25]">
            <SectionLabel index={7} name="Playlist" />
            <h2
              id="playlist-title"
              className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-heading md:text-5xl lg:text-[44px] xl:text-[50px]"
            >
              {playlist.headline[0]}
              <br />
              <span className="text-[#3b82f6]">{playlist.headline[1]}</span>
            </h2>
            <p className="max-w-[420px] text-base leading-relaxed text-muted md:text-[17px]">
              {playlist.description}
            </p>
          </div>

          {/* Right: official Spotify embed, loaded only when the visitor scrolls near it */}
          <div className="min-w-0 lg:flex-1">
            <iframe
              title="Spotify playlist by Panji Maulana Ibrahim"
              src={embedUrl}
              width="100%"
              height="352"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="block w-full rounded-[14px] border-0 shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
