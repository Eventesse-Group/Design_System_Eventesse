import type { ImgHTMLAttributes } from "react";

import iconColor from "../assets/brand/eventesse-icon-color.png";
import iconWhite from "../assets/brand/eventesse-icon-white.png";
import logoBlack from "../assets/brand/eventesse-logo-black.png";
import logoColor from "../assets/brand/eventesse-logo-color.png";
import logoWhite from "../assets/brand/eventesse-logo-white.png";

type BrandKind = "logo" | "icon";
type BrandTone = "color" | "white" | "black";

const brandAssets = {
  logo: { color: logoColor, white: logoWhite, black: logoBlack },
  icon: { color: iconColor, white: iconWhite },
} as const;

export interface BrandProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  kind?: BrandKind;
  tone?: BrandTone;
}

export function Brand({ kind = "logo", tone = "color", alt = "Eventesse", ...props }: BrandProps) {
  const availableTone = kind === "icon" && tone === "black" ? "color" : tone;
  const src = brandAssets[kind][availableTone as keyof (typeof brandAssets)[typeof kind]];
  return <img src={src} alt={alt} {...props} />;
}

export { brandAssets };