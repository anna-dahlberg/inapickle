import { motion } from "motion/react";
import { colors, font } from "../../styles/tokens";

interface HomeScreenProps {
  onPickleOracle: () => void;
  onThePicker: () => void;
  onYourPantry: () => void;
}

let hasAnimated = false;

export function HomeScreen({ onPickleOracle, onThePicker, onYourPantry }: HomeScreenProps) {
  const animate = !hasAnimated;
  if (!hasAnimated) hasAnimated = true;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-10 pt-4 pb-16"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-16 w-full">
        <motion.h1
          initial={animate ? { scale: 0.8, y: -16 } : false}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          style={{
            fontFamily: font.family,
            fontWeight: font.weight.bold,
            fontSize: "clamp(36px, 14vw, 64px)",
            lineHeight: 1.1,
            color: colors.pink,
            textAlign: "center",
          }}
        >
          in a pickle?
        </motion.h1>

        <motion.div
          className="flex flex-col gap-4 w-full"
          initial={animate ? { scale: 0.9, y: 20 } : false}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.08 }}
        >
          <button
            onClick={onPickleOracle}
            className="w-full rounded-2xl py-3 transition-opacity active:opacity-80"
            style={{
              backgroundColor: colors.pink,
              fontFamily: font.family,
              fontWeight: font.weight.semibold,
              fontSize: "20px",
              color: colors.text,
            }}
          >
            the pickle oracle
          </button>
          <button
            onClick={onThePicker}
            className="w-full rounded-2xl py-3 transition-opacity active:opacity-80"
            style={{
              backgroundColor: colors.lime,
              fontFamily: font.family,
              fontWeight: font.weight.semibold,
              fontSize: "20px",
              color: colors.text,
            }}
          >
            the picker
          </button>
          <button
            onClick={onYourPantry}
            className="w-full rounded-2xl py-3 border transition-opacity active:opacity-80"
            style={{
              borderColor: colors.text,
              fontFamily: font.family,
              fontWeight: font.weight.semibold,
              fontSize: "20px",
              color: colors.text,
            }}
          >
            your pantry
          </button>
        </motion.div>
      </div>
    </div>
  );
}
