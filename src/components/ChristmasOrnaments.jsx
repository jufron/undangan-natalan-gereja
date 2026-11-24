/**
 * Koleksi ilustrasi vektor ornamen Natal bergaya garis halus modern (fine line-art).
 * Menggunakan currentColor agar mudah diwarnai dengan token emas sampanye atau ungu.
 */

export function StarOfBethlehem({ className = "w-24 h-24" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      fill="none"
      className={className}
    >
      {/* Sumbu utama bintang Natal memanjang ke bawah */}
      <path
        d="M60 6L65.5 48.5L108 54L65.5 59.5L60 114L54.5 59.5L12 54L54.5 48.5L60 6Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Garis diagonal sekunder */}
      <path
        d="M36 30L56 50M84 30L64 50M36 78L56 58M84 78L64 58"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Lingkaran geometris pusat */}
      <circle
        cx="60"
        cy="54"
        r="11"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.6"
      />
      <circle cx="60" cy="54" r="2.2" fill="currentColor" />
      {/* Bintang kecil pendamping */}
      <path
        d="M96 20V28M92 24H100"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M24 84V90M21 87H27"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}

export function PineSprig({ className = "w-44 h-44" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      fill="none"
      className={className}
    >
      {/* Batang ranting utama melengkung halus */}
      <path
        d="M18 176C54 134 102 88 178 24"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Cabang ranting sekunder */}
      <path
        d="M62 129C54 104 54 82 60 58"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M98 96C118 98 140 94 164 84"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M128 68C122 48 124 32 132 16"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Jarum pinus cabang utama */}
      <g stroke="currentColor" strokeWidth="0.95" strokeLinecap="round" opacity="0.88">
        <path d="M40 153L28 136M40 153L56 154M52 140L38 122M52 140L70 142" />
        <path d="M78 115L66 96M78 115L96 116M90 103L78 84M90 103L110 105" />
        <path d="M112 83L102 64M112 83L134 84M144 54L135 36M144 54L165 56" />
        <path d="M161 39L154 22M161 39L180 41M171 30L166 15M171 30L188 30" />

        {/* Jarum cabang kiri atas */}
        <path d="M57 104L42 94M57 104L68 88M56 84L42 74M56 84L68 68" />
        {/* Jarum cabang kanan */}
        <path d="M122 95L132 82M122 95L134 108M144 91L155 78M144 91L156 102" />
        {/* Jarum cabang atas */}
        <path d="M125 46L112 36M125 46L138 35M128 30L117 20M128 30L140 20" />
      </g>

      {/* Aksen beri kecil */}
      <circle cx="88" cy="112" r="2.8" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="95" cy="118" r="2.3" fill="currentColor" opacity="0.7" />
      <circle cx="136" cy="72" r="2.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function ChristmasBell({ className = "w-28 h-32" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 140"
      fill="none"
      className={className}
    >
      {/* Tali gantung vertikal */}
      <line
        x1="60"
        y1="0"
        x2="60"
        y2="24"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      {/* Pita busur minimalis */}
      <path
        d="M60 28C48 18 36 22 42 32C48 36 56 32 60 28ZM60 28C72 18 84 22 78 32C72 36 64 32 60 28Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      {/* Lonceng utama garis ganda */}
      <path
        d="M60 34C44 34 36 48 34 68L26 88H94L86 68C84 48 76 34 60 34Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M60 40C48 40 42 52 40 69L34 83H86L80 69C78 52 72 40 60 40Z"
        stroke="currentColor"
        strokeWidth="0.85"
        opacity="0.55"
        strokeLinejoin="round"
      />
      {/* Bandul lonceng */}
      <path
        d="M53 88C53 92.5 56 96 60 96C64 96 67 92.5 67 88"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {/* Bintang kecil di samping lonceng */}
      <path
        d="M98 48V56M94 52H102"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M22 60V66M19 63H25"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function HangingOrnaments({ className = "w-36 h-48" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 200"
      fill="none"
      className={className}
    >
      {/* Ornamen 1 (kiri, lebih tinggi) */}
      <line x1="48" y1="0" x2="48" y2="54" stroke="currentColor" strokeWidth="1" opacity="0.65" />
      <rect x="44" y="54" width="8" height="5" stroke="currentColor" strokeWidth="1" />
      <circle cx="48" cy="83" r="24" stroke="currentColor" strokeWidth="1.2" />
      <path d="M25 83H71" stroke="currentColor" strokeWidth="0.85" opacity="0.55" />
      <path
        d="M48 69L51 79L61 83L51 87L48 97L45 87L35 83L45 79L48 69Z"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.8"
      />

      {/* Ornamen 2 (kanan, lebih rendah) */}
      <line x1="116" y1="0" x2="116" y2="92" stroke="currentColor" strokeWidth="1" opacity="0.65" />
      <rect x="112" y="92" width="8" height="5" stroke="currentColor" strokeWidth="1" />
      <circle cx="116" cy="117" r="20" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="116" cy="117" r="11" stroke="currentColor" strokeWidth="0.85" opacity="0.55" />
      <circle cx="116" cy="117" r="2" fill="currentColor" />
    </svg>
  );
}
