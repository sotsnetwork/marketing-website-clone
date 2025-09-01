'use client';

import { type DarkLightImageFragment } from "../lib/basehub/fragments";
import clsx from "clsx";
import { BaseHubImage } from "basehub/next-image";
import Image from "next/image";
import type { ImageProps } from "next/image";
import { useHasRendered } from "../../hooks/use-has-rendered";

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
  const hasRendered = useHasRendered();
  
  // Ensure consistent rendering between server and client
  const hasDark = !!dark && !!dark.url;
  const hasLight = !!light && !!light.url;
  
  // If no valid images, render a placeholder
  if (!hasDark && !hasLight) {
    return (
      <div 
        className={clsx("bg-gray-200 flex items-center justify-center", className)}
        style={{ width: width || 100, height: height || 100 }}
      >
        <span className="text-gray-500 text-sm">Image</span>
      </div>
    );
  }

  // Only render theme-dependent content after hydration to prevent mismatches
  if (!hasRendered) {
    return (
      <div 
        className={clsx("bg-gray-200 flex items-center justify-center", className)}
        style={{ width: width || 100, height: height || 100 }}
      >
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }

  // Fallback to regular Next.js Image if Basehub is not available
  const ImageComponent = (props: any) => {
    try {
      return <BaseHubImage {...props} />;
    } catch (error) {
      console.warn("Basehub image failed, falling back to Next.js Image:", error);
      return <Image {...props} />;
    }
  };

  return (
    <>
      {hasDark && (
        <ImageComponent
          key={`dark-${dark._id || 'fallback'}`}
          alt={dark.alt ?? alt ?? ""}
          className={clsx("hidden dark:block", className)}
          height={height ?? dark.height}
          src={dark.url}
          width={width ?? dark.width}
          {...props}
          {...(withPlaceholder && dark.blurDataURL
            ? {
                placeholder: "blur",
                blurDataURL: dark.blurDataURL,
              }
            : {})}
          onError={() => {
            console.warn(`Failed to load image: ${dark.url}`);
          }}
        />
      )}
      {hasLight && (
        <ImageComponent
          key={`light-${light._id || 'fallback'}`}
          alt={light.alt ?? alt ?? ""}
          className={clsx(hasDark && "dark:hidden", className)}
          height={height ?? light.height}
          src={light.url}
          width={width ?? light.width}
          {...props}
          {...(withPlaceholder && light.blurDataURL
            ? {
                placeholder: "blur",
                blurDataURL: light.blurDataURL,
              }
            : {})}
          onError={() => {
            console.warn(`Failed to load image: ${light.url}`);
          }}
        />
      )}
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
