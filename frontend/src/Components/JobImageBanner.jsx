const DEFAULT_JOB_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#6d1fa0" />
        <stop offset="52%" stop-color="#c0396b" />
        <stop offset="100%" stop-color="#f4622a" />
      </linearGradient>
      <radialGradient id="glowOne" cx="20%" cy="20%" r="45%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="glowTwo" cx="82%" cy="25%" r="35%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.26" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#bg)" />
    <circle cx="210" cy="180" r="220" fill="url(#glowOne)" />
    <circle cx="980" cy="210" r="180" fill="url(#glowTwo)" />
    <path d="M0 650 C230 520 400 760 670 630 C880 530 1010 590 1200 470 L1200 800 L0 800 Z" fill="#ffffff" fill-opacity="0.12" />
    <path d="M0 710 C280 560 530 780 770 680 C940 610 1060 640 1200 590 L1200 800 L0 800 Z" fill="#ffffff" fill-opacity="0.08" />
  </svg>`
)}`;

export default function JobImageBanner({
  image,
  title,
  badge,
  meta,
  heightClass = "h-44",
}) {
  const backgroundImage = image || DEFAULT_JOB_IMAGE;

  return (
    <div className={`relative overflow-hidden ${heightClass} bg-slate-900`}>
      <img
        src={backgroundImage}
        alt={title || "Job opportunity"}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/15 via-slate-950/35 to-slate-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_38%)]" />

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        {badge && (
          <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/95 backdrop-blur-sm">
            {badge}
          </span>
        )}

        <h3 className="mt-3 max-w-2xl text-xl font-extrabold leading-tight text-white drop-shadow-sm">
          {title || "Job Opportunity"}
        </h3>

        {meta && (
          <p className="mt-2 max-w-2xl text-sm font-medium text-white/85 drop-shadow-sm">
            {meta}
          </p>
        )}
      </div>
    </div>
  );
}
