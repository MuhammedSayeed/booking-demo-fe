import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertTo12Hour(time24:string) {
  const [hour, minute] = time24.split(":");
  const h = parseInt(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${minute} ${suffix}`;
}

/**
 * Converts a hex color string to an HSL string format for Tailwind/shadcn.
 * @param hex The hex color string (e.g., "#RRGGBB" or "#RGB").
 * @returns A string in the format "H S% L%" (e.g., "201.0 96.0% 32.0%").
 */
export function hexToHsl(hex: string): string {
  if (!hex || hex.length < 4) {
    // Return a default (white) if the hex is invalid
    return "0 0% 100%";
  }

  let hexVal = hex.startsWith("#") ? hex.substring(1) : hex;

  // Expand shorthand form (e.g. "03F")
  if (hexVal.length === 3) {
    hexVal = hexVal[0] + hexVal[0] + hexVal[1] + hexVal[1] + hexVal[2] + hexVal[2];
  }

  // Convert hex to R, G, B
  const r = parseInt(hexVal.substring(0, 2), 16) / 255;
  const g = parseInt(hexVal.substring(2, 4), 16) / 255;
  const b = parseInt(hexVal.substring(4, 6), 16) / 255;

  // Find min and max values of R, G, B
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = h * 360;
  s = s * 100;
  l = l * 100;

  // Format to one decimal place, as shadcn variables do
  return `${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%`;
}