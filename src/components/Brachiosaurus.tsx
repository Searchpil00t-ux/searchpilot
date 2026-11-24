export default function Brachiosaurus({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 200 180" role="img" aria-label="SearchPilot brachiosaurus">
      <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3B82F6"/><stop offset="1" stopColor="#1D4ED8"/></linearGradient></defs>
      <path d="M40 120 Q8 128 4 150 Q30 140 52 140Z" fill="#1D4ED8"/>
      <ellipse cx="88" cy="118" rx="58" ry="30" fill="url(#bg)"/>
      <path d="M126 104 Q150 90 148 56 Q146 30 150 18 L172 20 Q176 26 166 30 Q164 52 168 70 Q170 108 140 130Z" fill="url(#bg)"/>
      <circle cx="166" cy="22" r="2.6" fill="#fff"/>
      <rect x="52" y="132" width="16" height="36" rx="6" fill="#2563EB"/>
      <rect x="76" y="136" width="16" height="32" rx="6" fill="#1D4ED8"/>
      <rect x="104" y="136" width="16" height="32" rx="6" fill="#2563EB"/>
      <rect x="126" y="132" width="16" height="36" rx="6" fill="#1D4ED8"/>
      <path d="M70 108 L82 96 L94 108 L106 96 L118 108" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinejoin="round" opacity=".85"/>
    </svg>
  );
}
