import { useEffect } from "react";
import { motion } from "motion/react";
import { colors, font } from "../../styles/tokens";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: colors.bg }}
      onClick={onComplete}
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          fontFamily: font.family,
          fontWeight: font.weight.bold,
          fontSize: "62px",
          lineHeight: 1.1,
          color: colors.pink,
          textAlign: "center",
        }}
      >
        in a pickle?
      </motion.h1>
    </div>
  );
}
