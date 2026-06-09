import { motion } from "framer-motion";
import profileImg from "@assets/IMG_2767_1780991576965.jpg";
import { useTheme } from "./ThemeProvider";

export default function AsciiArt() {
  const { theme } = useTheme();

  // grayscale → sepia → hue-rotate shifts the tones to blue accent
  // dark mode: slightly brighter; light mode: higher contrast
  const filterStr =
    theme === "dark"
      ? "grayscale(1) contrast(1.25) sepia(1) saturate(5) hue-rotate(192deg) brightness(0.82)"
      : "grayscale(1) contrast(1.4)  sepia(1) saturate(6) hue-rotate(192deg) brightness(0.78)";

  return (
    <motion.div
      className="w-full max-w-[420px] aspect-square shrink-0"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      data-testid="ascii-canvas"
      style={{
        backgroundImage: `url(${profileImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center 8%",
        // Show the image only through dot-grid holes
        WebkitMaskImage:
          "radial-gradient(circle at 50% 50%, black 44%, transparent 44%)",
        WebkitMaskSize: "11px 11px",
        maskImage:
          "radial-gradient(circle at 50% 50%, black 44%, transparent 44%)",
        maskSize: "11px 11px",
        filter: filterStr,
      }}
    />
  );
}
