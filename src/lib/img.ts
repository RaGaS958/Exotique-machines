const BASE = 'https://images.unsplash.com/';

/*
 * Photos come from Unsplash's CDN. A build with VITE_LOCAL_IMAGES=1 points at
 * copies in ./img instead (two sizes per photo), for hosts that block
 * third-party images. See scripts/fetch-images.mjs.
 */
const LOCAL = import.meta.env.VITE_LOCAL_IMAGES === '1';
const LOCAL_SIZES = [800, 1600];
const local = (id: string, w: number) => `img/${id}-${LOCAL_SIZES.find((s) => s >= w) ?? LOCAL_SIZES[LOCAL_SIZES.length - 1]}.jpg`;

export function img(id: string, w = 1600, q = 80): string {
  if (LOCAL) return local(id, w);
  return `${BASE}${id}?auto=format&fit=crop&q=${q}&w=${w}`;
}

export function srcSet(id: string, widths = [480, 800, 1200, 1600, 2200], q = 78): string {
  if (LOCAL) return LOCAL_SIZES.map((w) => `${local(id, w)} ${w}w`).join(', ');
  return widths.map((w) => `${img(id, w, q)} ${w}w`).join(', ');
}

const loaded = new Set<string>();

/** Resolve when an image has decoded (or failed), never rejects. */
export function preload(src: string): Promise<void> {
  if (loaded.has(src)) return Promise.resolve();
  return new Promise((resolve) => {
    const i = new Image();
    i.decoding = 'async';
    i.onload = i.onerror = () => {
      loaded.add(src);
      resolve();
    };
    i.src = src;
  });
}

const HERO_WIDTHS = [800, 1200, 1600, 2200, 2800];

/** One URL per device for full-bleed photos, so a preload and the <img> always match. */
export function heroSrc(id: string): string {
  const need = typeof window === 'undefined' ? 1600 : window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
  const w = HERO_WIDTHS.find((x) => x >= need) ?? HERO_WIDTHS[HERO_WIDTHS.length - 1];
  return img(id, w, 78);
}
