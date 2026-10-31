// Inline SVG icons. Stroke icons inherit the current text color.
// Usage: <PinIcon />, or <PinIcon width={14} height={14} className="text-accent" />

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function PinIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function MenuIcon(props) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function LinkedInIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7" />
      <path d="M8 7v.01" />
      <path d="M12 17v-4a2 2 0 0 1 4 0v4" />
      <path d="M12 10v7" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5v.01" />
    </svg>
  );
}

export function TikTokIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.5 2.5 2.5 4.5 5 5" />
    </svg>
  );
}

export function MailIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function DownloadIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4v12" />
      <path d="M6 11l6 6 6-6" />
      <path d="M5 20h14" />
    </svg>
  );
}

export function CameraIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

// Lets components pick a social icon by id from src/data/profile.js
export const socialIcons = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  email: MailIcon,
};