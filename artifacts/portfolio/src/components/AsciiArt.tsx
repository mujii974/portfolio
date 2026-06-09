import { motion } from "framer-motion";
import profileImg from "@assets/IMG_2767_1780991576965.jpg";
import { useTheme } from "./ThemeProvider";

export default function AsciiArt() {
  const { theme } = useTheme();

  // Blue accent fills the gaps between dots; grayscale photo shows through dots.
  // Dark pixels → dark dots on blue → face features clearly visible.
  // No hue-rotate tricks that distort dark/hair areas.
  const bgColor = theme === "dark" ? "#2F81F7" : "#1A6BD4";

  return (
    <motion.div
      className="w-full max-w-[400px] shrink-0 rounded-2xl overflow-hidden shadow-xl"
      style={{ background: bgColor, aspectRatio: "1" }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      data-testid="ascii-canvas"
    >
      {/*
       * Inner div = the actual photo shown through a dot-grid mask.
       * Grayscale + contrast make face features crisp.
       * The blue parent background bleeds through the transparent gaps between dots.
       */}
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url(${profileImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 15%",
          filter: "grayscale(1) contrast(1.5) brightness(0.88)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, black 46%, transparent 46%)",
          WebkitMaskSize: "12px 12px",
          maskImage:
            "radial-gradient(circle at 50% 50%, black 46%, transparent 46%)",
          maskSize: "12px 12px",
        }}
      />
    </motion.div>
  );
}
