import { useEffect, useRef } from "react";
import profileImg from "@assets/IMG_2767_1780991576965.jpg";
import { useTheme } from "./ThemeProvider";

const CHARS = "@#S%?*+;:,. ".split("");

export default function AsciiArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = profileImg;

    img.onload = () => {
      // Calculate dimensions
      const targetWidth = 80;
      // Crop upper 55%
      const cropRatio = 0.55;
      const aspectRatio = (img.height * cropRatio) / img.width;
      const targetHeight = Math.floor(targetWidth * aspectRatio * 0.5); // *0.5 because font chars are taller than wide

      canvas.width = targetWidth * 6; // 6px per char width
      canvas.height = targetHeight * 10; // 10px per char height

      const offscreen = document.createElement("canvas");
      offscreen.width = targetWidth;
      offscreen.height = targetHeight;
      const octx = offscreen.getContext("2d");
      if (!octx) return;

      octx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height * cropRatio,
        0,
        0,
        targetWidth,
        targetHeight
      );

      const imgData = octx.getImageData(0, 0, targetWidth, targetHeight);
      const pixels = imgData.data;

      const asciiPixels: { char: string; color: string; targetChar: string }[] = [];
      
      const accentColor = theme === "dark" ? [47, 129, 247] : [26, 107, 212]; // #2F81F7 / #1A6BD4

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        if (a === 0) {
          asciiPixels.push({ char: " ", color: "transparent", targetChar: " " });
          continue;
        }

        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const charIndex = Math.floor((1 - brightness) * (CHARS.length - 1));
        const targetChar = CHARS[charIndex] || " ";

        // Tint to accent
        const tintedColor = `rgba(${accentColor[0]}, ${accentColor[1]}, ${accentColor[2]}, ${brightness + 0.2})`;

        asciiPixels.push({
          char: CHARS[Math.floor(Math.random() * CHARS.length)], // initial random char
          color: tintedColor,
          targetChar,
        });
      }

      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.textBaseline = "top";

      let progress = 0;
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        progress += 0.05;
        if (progress > 1) progress = 1;

        let allDone = true;

        for (let y = 0; y < targetHeight; y++) {
          for (let x = 0; x < targetWidth; x++) {
            const idx = y * targetWidth + x;
            const p = asciiPixels[idx];
            
            if (!p || p.targetChar === " ") continue;

            if (Math.random() < progress) {
              p.char = p.targetChar;
            } else {
              p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
              allDone = false;
            }

            ctx.fillStyle = p.color;
            ctx.fillText(p.char, x * 6, y * 10);
          }
        }

        if (!allDone) {
          requestAnimationFrame(draw);
        }
      };

      requestAnimationFrame(draw);
    };
  }, [theme]);

  return (
    <div className="w-full max-w-[400px] flex items-center justify-center relative aspect-square md:aspect-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-auto object-contain opacity-90 transition-opacity duration-1000"
        data-testid="ascii-canvas"
      />
    </div>
  );
}
