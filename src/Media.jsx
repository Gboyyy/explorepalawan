import { useId, useState } from "react";
import useWiki from "./useWiki.js";

/* ---------- SVG ICONS (24x24, stroke style) ---------- */
const c = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const PATHS = {
  boat: ["M3 17l2 3h14l2-3H3z", "M12 3v10", "M12 4l6 8h-6"],
  bed: ["M3 19V6", "M3 14h18v5", "M21 14v-2a3 3 0 0 0-3-3h-7v5", c(7, 11, 1.4)],
  van: ["M3 17V8a1 1 0 0 1 1-1h10l5 5v5h-2", "M3 17h2", "M9 17h6", c(7, 17.5, 2), c(17, 17.5, 2)],
  food: ["M6 3v8", "M4 3v5a2 2 0 0 0 4 0V3", "M6 11v10", "M17 3c-2 2-3 5-3 8h3v10"],
  wave: ["M2 10c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1", "M2 16c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1"],
  sun: [c(12, 12, 4), "M12 2v2", "M12 20v2", "M2 12h2", "M20 12h2", "M5 5l1.5 1.5", "M17.5 17.5L19 19", "M19 5l-1.5 1.5", "M6.5 17.5L5 19"],
  palm: ["M12 21V10", "M12 10c-3-4-7-3-8-1", "M12 10c3-4 7-3 8-1", "M12 10c-1-4 1-6 3-6", "M12 10c-1-4-3-5-5-4", "M4 21h16"],
  city: ["M4 21V9h6v12", "M10 21V4h6v17", "M16 21V11h4v10", "M12 8h2", "M12 12h2", "M6 12h2", "M6 16h2"],
  bag: ["M6 8h12l1 13H5L6 8z", "M9 8V6a3 3 0 0 1 6 0v2"],
  shirt: ["M8 3L3 7l3 3 2-1v12h8V9l2 1 3-3-5-4a4 4 0 0 1-8 0z"],
  shield: ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z", "M9 12l2 2 4-4"],
  wallet: ["M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z", "M3 7l12-3v3", "M16 14h2"],
  leaf: ["M5 19c0-9 5-14 15-14 0 10-5 15-14 15", "M5 19l8-8"],
  access: [c(12, 5, 1.5), "M7 8h10", "M12 8v6", "M9 21l3-7 3 7"],
  sos: ["M12 3l9 16H3L12 3z", "M12 10v4", "M12 17h.01"],
  pin: ["M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z", c(12, 9, 2.5)],
  phone: ["M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"],
  mail: ["M3 5h18v14H3z", "M3 6l9 7 9-7"],
  clock: [c(12, 12, 9), "M12 7v5l3 2"],
  star: ["M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"],
  check: ["M5 12l5 5 9-10"],
  chat: ["M4 5h16v11H9l-5 4V5z"],
  calendar: ["M4 6h16v14H4z", "M4 10h16", "M8 3v4", "M16 3v4"],
  users: [c(9, 8, 3), "M3 20a6 6 0 0 1 12 0", "M16 5a3 3 0 0 1 0 6", "M18 20a6 6 0 0 0-3-5"],
  tag: ["M3 12V4h8l10 10-8 8L3 12z", "M7.5 7.5h.01"],
  plane: ["M2 14l20-9-4 14-6-4-3 4v-5L2 14z"],
  search: [c(11, 11, 7), "M16 16l5 5"],
  map: ["M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z", "M9 4v14", "M15 6v14"],
  compass: [c(12, 12, 9), "M15.5 8.5l-2 5-5 2 2-5 5-2z"],
  gift: ["M3 9h18v4H3z", "M5 13v8h14v-8", "M12 9v12", "M12 9c-3 0-5-1-5-3s3-2 5 3c2-5 5-5 5-3s-2 3-5 3z"],
  facebook: ["M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"],
  instagram: ["M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z", c(12, 12, 4), "M17.5 6.5h.01"],
  tiktok: ["M14 4v10a3.5 3.5 0 1 1-3.5-3.5", "M14 4c0 3 2 5 5 5"],
  plus: ["M12 5v14", "M5 12h14"],
  minus: ["M5 12h14"],
  quote: ["M5 17c0-5 2-8 5-9", "M5 17h4v-4H5", "M15 17c0-5 2-8 5-9", "M15 17h4v-4h-4"],
};

export function Icon({ name, size = 24, fill = "none", className = "" }) {
  return (
    <svg className={`icon ${className}`} viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {(PATHS[name] || []).map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

/* ---------- LOGO ---------- */
export function Logo({ size = 36 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} role="img" aria-label="Palawan Paradise Tours logo">
      <circle cx="24" cy="24" r="23" fill="#0b6e8a" />
      <circle cx="24" cy="17" r="7" fill="#ffb347" />
      <path d="M2 30c5-4 9-4 14 0s9 4 14 0 9-4 16 0v1a23 23 0 0 1-44 0z" fill="#3fc1c9" />
      <path d="M2.5 35c5-3 9-3 14 0s9 3 14 0 8-3 15 0a23 23 0 0 1-43 0z" fill="#07435a" />
      <path d="M24 30V20m0 0c-3-3-6-2-7 0m7 0c3-3 6-2 7 0" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- DECORATIVE WAVE DIVIDER ---------- */
export function WaveDivider({ color = "#fff8ec" }) {
  return (
    <svg className="wave-divider" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
      <path fill={color} d="M0 50c120-40 240-40 360 0s240 40 360 0 240-40 360 0 240 40 360 0v40H0z" />
    </svg>
  );
}

/* ---------- SVG SCENE (fallback illustration when a photo can't load) ---------- */
export function Scene({ label, hue = 190 }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="scene" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 70% 78%)`} />
          <stop offset="1" stopColor="#fff3dc" />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#${id})`} />
      <circle cx="315" cy="68" r="28" fill="#ffb347" />
      <path d="M0 150c40-20 80-20 120 0s80 20 120 0 100-20 160 0v100H0z" fill={`hsl(${hue} 60% 55%)`} opacity=".7" />
      <path d="M110 168c25-22 75-22 100 0z" fill="#e8c88a" />
      <path d="M160 150v-30m0 0c-8-9-18-7-22-2m22 2c8-9 18-7 22-2m-22 2c-3-10 2-17 9-18" stroke="#2d6a4f" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M0 190c50-18 90-18 140 0s90 18 140 0 80-14 120 0v60H0z" fill={`hsl(${hue} 65% 38%)`} />
      <text x="200" y="228" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="600">{label}</text>
    </svg>
  );
}

/* ---------- ONLINE PHOTOS via Wikipedia REST API (free, licensed, CORS-enabled) ---------- */
// Wikimedia only serves standard thumbnail widths: 500, 960, 1280 are safe.
export function WikiPhoto({ title, alt, width = 500, hue = 190, photoIndex = 0 }) {
  const data = useWiki(title, photoIndex);
  const [failedSrc, setFailedSrc] = useState(null);
  if (data === null) return <div className="skeleton" aria-busy="true" />;
  if (!data.src || failedSrc === data.src) return <Scene label={alt} hue={hue} />;
  return <img src={data.src} width={width} alt={alt} loading="lazy" onError={() => setFailedSrc(data.src)} />;
}