'use client';

import { type DarkLightImageFragment } from "../lib/basehub/fragments";
import clsx from "clsx";
import Image from "next/image";
import type { ImageProps } from "next/image";


type DarkLightImageProps = DarkLightImageFragment &
  Omit<ImageProps, "src" | "alt"> & {
    alt?: string;
    withPlaceholder?: boolean;
  };

export function DarkLightImage({
  alt,
  dark,
  light,
  className,
  width,
  height,
  withPlaceholder,
  ...props
}: DarkLightImageProps) {
  // Ensure consistent rendering between server and client
  const hasDark = !!dark && !!dark.url;
  const hasLight = !!light && !!light.url;
  
  // Always render both images to ensure consistent DOM structure
  // Use CSS classes to control visibility instead of conditional rendering
  return (
    <>
      <Image
        key={`dark-${dark?._id || 'fallback'}`}
        alt={dark?.alt ?? alt ?? ""}
        className={clsx("hidden dark:block", className)}
        height={height ?? dark?.height || 100}
        src={dark?.url || "/placeholder.svg"}
        width={width ?? dark?.width || 100}
        {...props}
        {...(withPlaceholder && dark?.blurDataURL
          ? {
              placeholder: "blur",
              blurDataURL: dark.blurDataURL,
            }
          : {})}
        onError={() => {
          if (dark?.url) console.warn(`Failed to load dark image: ${dark.url}`);
        }}
      />
      <Image
        key={`light-${light?._id || 'fallback'}`}
        alt={light?.alt ?? alt ?? ""}
        className={clsx(dark ? "dark:hidden" : "", className)}
        height={height ?? light?.height || 100}
        src={light?.url || "/placeholder.svg"}
        width={width ?? light?.width || 100}
        {...props}
        {...(withPlaceholder && light?.blurDataURL
          ? {
              placeholder: "blur",
              blurDataURL: light.blurDataURL,
            }
          : {})}
        onError={() => {
          if (light?.url) console.warn(`Failed to load light image: ${light.url}`);
        }}
      />
    </>
  );
}

export function DarkLightImageAutoscale(props: DarkLightImageProps) {
  const [aspectRatioWidth, aspectRatioHeight] = props.light.aspectRatio.split("/").map(Number);
  const aspectRatio = (aspectRatioWidth ?? 0) / (aspectRatioHeight ?? 0);
  let logoStyle;

  switch (true) {
    case aspectRatio <= 1.2:
      logoStyle = "square";
      break;
    case aspectRatio < 1.4:
      logoStyle = "4/3";
      break;
    case aspectRatio < 4:
      logoStyle = "portrait";
      break;
    default:
      logoStyle = "landscape";
      break;
  }

  return (
    <DarkLightImage
      priority
      alt="logo"
      className={clsx("w-auto max-w-[200px] object-contain", {
        "h-10": logoStyle === "square",
        "h-9": logoStyle === "4/3",
        "h-8": logoStyle === "portrait",
        "h-6": logoStyle === "landscape",
      })}
      style={{
        aspectRatio: props.light.aspectRatio,
      }}
      {...props}
    />
  );
}
