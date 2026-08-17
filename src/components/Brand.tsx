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

const brandDimensions = {
  logo: { width: 3080, height: 882 },
  icon: {
    color: { width: 764, height: 779 },
    white: { width: 764, height: 882 },
  },
} as const;

export interface BrandProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  kind?: BrandKind;
  tone?: BrandTone;
}

export function Brand({ kind = "logo", tone = "color", alt = "Eventesse", className = "", ...props }: BrandProps) {
  const availableTone = kind === "icon" && tone === "black" ? "color" : tone;
  const src = brandAssets[kind][availableTone as keyof (typeof brandAssets)[typeof kind]];
  const dimensions = kind === "logo"
    ? brandDimensions.logo
    : brandDimensions.icon[availableTone as keyof typeof brandDimensions.icon];

  return (
    <img
      {...props}
      src={src}
      width={dimensions.width}
      height={dimensions.height}
      alt={alt}
      className={`eds-brand ${className}`.trim()}
      data-eds-brand="official"
      data-eds-brand-kind={kind}
      draggable={false}
    />
  );
}

export { brandAssets };
