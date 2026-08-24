import { motion } from "motion/react";

interface HomeScreenProps {
  onPickleOracle: () => void;
  onThePicker: () => void;
  onYourPantry: () => void;
}

export function HomeScreen({ onPickleOracle, onThePicker, onYourPantry }: HomeScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-10 pt-4 pb-16"
      style={{ backgroundColor: "#096343" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-16 w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(36px, 14vw, 64px)",
            lineHeight: 1.1,
            color: "#FF98DE",
            textAlign: "center",
          }}
        >
          in a pickle?
        </motion.h1>

        <motion.div
          className="flex flex-col gap-4 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <button
            onClick={onPickleOracle}
            className="w-full rounded-2xl py-3 transition-opacity active:opacity-80"
            style={{
              backgroundColor: "#FF98DE",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#F1F6EC",
            }}
          >
            the pickle oracle
          </button>
          <button
            onClick={onThePicker}
            className="w-full rounded-2xl py-3 transition-opacity active:opacity-80"
            style={{
              backgroundColor: "#ADDF26",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#F1F6EC",
            }}
          >
            the picker
          </button>
          <button
            onClick={onYourPantry}
            className="w-full rounded-2xl py-3 border transition-opacity active:opacity-80"
            style={{
              borderColor: "#F1F6EC",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#F1F6EC",
            }}
          >
            your pantry
          </button>
        </motion.div>
      </div>
    </div>
  );
}
