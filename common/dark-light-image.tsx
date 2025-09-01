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
  // Use static keys and consistent props to prevent hydration mismatches
  return (
    <>
      <Image
        key="dark-image"
        alt={alt || "Dark theme image"}
        className={clsx("hidden dark:block", className)}
        height={height || 100}
        src={dark?.url || "/placeholder.svg"}
        width={width || 100}
        {...props}
        {...(withPlaceholder && dark?.blurDataURL
          ? {
              placeholder: "blur",
              blurDataURL: dark.blurDataURL,
            }
          : {})}
      />
      <Image
        key="light-image"
        alt={alt || "Light theme image"}
        className={clsx("dark:hidden", className)}
        height={height || 100}
        src={light?.url || "/placeholder.svg"}
        width={width || 100}
        {...props}
        {...(withPlaceholder && light?.blurDataURL
          ? {
              placeholder: "blur",
              blurDataURL: light.blurDataURL,
            }
          : {})}
      />
    </>
  );
}

export function DarkLightImageAutoscale(props: DarkLightImageProps) {
  // Add safety check for aspectRatio
  if (!props.light?.aspectRatio) {
    return (
      <DarkLightImage
        priority
        alt="logo"
        className="w-auto max-w-[200px] object-contain h-10"
        {...props}
      />
    );
  }

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
