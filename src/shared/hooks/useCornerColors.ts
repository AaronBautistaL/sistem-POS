import { useState, useEffect } from 'react';

export interface CornerColors {
  tl: [number, number, number];
  tr: [number, number, number];
  bl: [number, number, number];
  br: [number, number, number];
}

export function useCornerColors(src?: string): CornerColors | null {
  const [colors, setColors] = useState<CornerColors | null>(null);

  useEffect(() => {
    if (!src) { setColors(null); return; }

    const img = new Image();
    img.onload = () => {
      const size = 80;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);

      const getPixel = (x: number, y: number): [number, number, number] => {
        const i = (y * size + x) * 4;
        return [data[i], data[i + 1], data[i + 2]];
      };

      // Average a block of pixels at each corner
      const avgCorner = (originX: number, originY: number): [number, number, number] => {
        const block = 6;
        let r = 0, g = 0, b = 0;
        for (let dy = 0; dy < block; dy++) {
          for (let dx = 0; dx < block; dx++) {
            const [pr, pg, pb] = getPixel(originX + dx, originY + dy);
            r += pr; g += pg; b += pb;
          }
        }
        const n = block * block;
        return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
      };

      setColors({
        tl: avgCorner(0,          0),
        tr: avgCorner(size - 6,   0),
        bl: avgCorner(0,          size - 6),
        br: avgCorner(size - 6,   size - 6),
      });
    };
    img.src = src;
  }, [src]);

  return colors;
}

// Keep old export as alias for backwards compat
export function useDominantColor(src?: string): [number, number, number] | null {
  const corners = useCornerColors(src);
  if (!corners) return null;
  const { tl, tr, bl, br } = corners;
  return [
    Math.round((tl[0] + tr[0] + bl[0] + br[0]) / 4),
    Math.round((tl[1] + tr[1] + bl[1] + br[1]) / 4),
    Math.round((tl[2] + tr[2] + bl[2] + br[2]) / 4),
  ];
}
