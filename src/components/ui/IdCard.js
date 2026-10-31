// Flat ID card on a lanyard. In step 4.7 a 3D, draggable version replaces it on large screens.

import Image from "next/image";
import { profile } from "@/data/profile";

export default function IdCard() {
  return (
    <div className="flex flex-col items-center">
      {/* Strap */}
      <div
        aria-hidden="true"
        className="flex h-[90px] w-[26px] items-center justify-center overflow-hidden border-x border-[#2e4374] bg-[#1a2a4f] md:h-[170px] md:w-[34px]"
      >
        <span className="whitespace-nowrap font-mono text-[10px] tracking-[0.3em] text-accent-light [writing-mode:vertical-rl]">
          THINK BIG · ACT BOLD · THINK BIG
        </span>
      </div>

      {/* Clip */}
      <div
        aria-hidden="true"
        className="h-4 w-10 rounded-[5px] border border-[#b6c0d3] bg-[#8a96ad] md:h-[22px] md:w-[52px] md:rounded-md"
      />

      {/* Card */}
      <div className="-mt-1 w-[236px] origin-top -rotate-[5deg] overflow-hidden rounded-2xl border border-line-strong bg-panel shadow-[0_40px_80px_rgba(0,0,0,0.55)] md:w-[300px] md:rounded-[18px]">
        <div className="flex h-9 items-center justify-between bg-accent px-4 md:h-[46px] md:px-[18px]">
          <span className="font-mono text-[10px] tracking-[0.16em] text-white md:text-[11px]">EMPLOYEE ID</span>
          <span aria-hidden="true" className="h-2.5 w-[54px] rounded-md bg-panel" />
        </div>

        <div className="flex flex-col gap-3.5 p-4 md:p-5">
          <Image
            src="/images/profile/id-card.jpg"
            alt={`Portrait of ${profile.name}`}
            width={492}
            height={600}
            priority
            className="h-[190px] w-full rounded-[10px] object-cover object-top md:h-[250px]"
          />

          <div className="flex flex-col gap-1">
            <p className="font-display text-lg font-bold leading-tight text-heading md:text-[22px]">
              {profile.name}
            </p>
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent-light md:text-xs">
              {profile.role.toUpperCase()}
            </p>
          </div>

          <div className="flex items-end justify-between border-t border-dashed border-line-strong pt-3">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] tracking-[0.12em] text-faint">DEPT</span>
              <span className="font-mono text-xs text-body">{profile.department.toUpperCase()}</span>
            </div>
            {/* Decorative QR pattern. A real, scannable QR can replace it in Phase 6. */}
            <svg aria-hidden="true" width="44" height="44" viewBox="0 0 7 7" className="rounded bg-fg p-[3px]">
              <path
                fill="#0b1224"
                fillRule="evenodd"
                d="M0 0h3v3H0zM4 0h3v3H4zM0 4h3v3H0zM1 1v1h1V1zM5 1v1h1V1zM1 5v1h1V5zM4 4h1v1H4zM6 4h1v1H6zM5 5h1v1H5zM4 6h1v1H4zM6 6h1v1H6z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}