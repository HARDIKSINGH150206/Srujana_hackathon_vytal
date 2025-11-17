// Browser-friendly utils wrapper that uses ESM CDN builds of clsx and tailwind-merge
import clsx from 'https://cdn.skypack.dev/clsx';
import { twMerge } from 'https://cdn.skypack.dev/tailwind-merge';

export function cn(...inputs) {
  // clsx accepts a list of inputs and returns a string
  // twMerge will intelligently merge Tailwind class names
  return twMerge(clsx(...inputs));
}
