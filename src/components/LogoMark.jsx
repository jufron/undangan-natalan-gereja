import { useState } from "react";
import fallbackLogoSvg from "../assets/logo.svg";

// Otomatis menggunakan src/assets/logo.png jika tersedia; jika belum ada, gunakan logo.svg
const logoModules = import.meta.glob("../assets/logo.{png,jpg,jpeg,webp}", {
  eager: true,
});
const customLogoSrc =
  logoModules["../assets/logo.png"]?.default ||
  Object.values(logoModules)[0]?.default ||
  fallbackLogoSvg;

/**
 * Menampilkan logo dengan wadah putih bersih tanpa efek bayangan berlebih.
 */
export default function LogoMark({ size = "md", className = "" }) {
  const [logoSrc, setLogoSrc] = useState(customLogoSrc);

  const dimensions =
    size === "sm"
      ? "w-12 h-12 p-1"
      : size === "lg"
      ? "w-20 h-20 sm:w-24 sm:h-24 p-1.5"
      : "w-16 h-16 p-1.5";

  return (
    <div
      className={`${dimensions} rounded-full bg-white border border-[#E9E6EC] flex items-center justify-center shrink-0 ${className}`}
    >
      <img
        src={logoSrc}
        alt="Logo GKKD Bali"
        width={96}
        height={96}
        referrerPolicy="no-referrer"
        onError={() => {
          if (logoSrc !== fallbackLogoSvg) {
            setLogoSrc(fallbackLogoSvg);
          }
        }}
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  );
}
