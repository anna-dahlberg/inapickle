import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import oracleImg from "@/imports/ChatGPT_Image_24_aug._2026_11_08_35.png";

interface PickleOracleProps {
  onBack: () => void;
}

type OracleState = "idle" | "animating" | "revealed";

// Crystal ball center as % of the image (pickle on left, ball on right)
const BALL_X = "66%";
const BALL_Y = "56%";

function Sparkle({ x, y, size = 7, color = "#FF98DE", delay = 0 }: {
  x: string; y: string; size?: number; color?: string; delay?: number;
}) {
  const s = size;
  const s4 = s * 0.28;
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0.8, 0], scale: [0, 1.1, 0.9, 0], rotate: [0, 90] }}
      transition={{ duration: 1.6, delay, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
    >
      <svg width={s * 2} height={s * 2} viewBox={`0 0 ${s * 2} ${s * 2}`}>
        <path
          d={`M${s},0 L${s+s4},${s-s4} L${s*2},${s} L${s+s4},${s+s4} L${s},${s*2} L${s-s4},${s+s4} L0,${s} L${s-s4},${s-s4}Z`}
          fill={color}
        />
      </svg>
    </motion.div>
  );
}

// Sparkles around ball center (66%, 58%), spread wider
const sparkles = [
  { x: "48%", y: "38%", size: 7, color: "#FF98DE", delay: 0 },
  { x: "50%", y: "60%", size: 5, color: "#ADDF26", delay: 0.4 },
  { x: "80%", y: "38%", size: 7, color: "#ADDF26", delay: 0.2 },
  { x: "81%", y: "62%", size: 5, color: "#FF98DE", delay: 0.6 },
  { x: "64%", y: "30%", size: 6, color: "#FF98DE", delay: 0.1 },
  { x: "53%", y: "76%", size: 5, color: "#ADDF26", delay: 0.5 },
  { x: "76%", y: "74%", size: 5, color: "#FF98DE", delay: 0.3 },
];

export function PickleOracle({ onBack }: PickleOracleProps) {
  const [oracleState, setOracleState] = useState<OracleState>("idle");
  const [answer, setAnswer] = useState<"yes" | "no">("yes");

  const triggerOracle = () => {
    const result = Math.random() < 0.5 ? "yes" : "no";
    setAnswer(result);
    setOracleState("animating");
    setTimeout(() => setOracleState("revealed"), 2400);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between pt-24 pb-14"
      style={{ backgroundColor: "#096343" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 items-start w-full px-10">
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 9vw, 42px)",
            lineHeight: 1.1,
            color: "#FF98DE",
            whiteSpace: "nowrap",
          }}
        >
          the pickle oracle
        </h1>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500,
            fontSize: "20px",
            lineHeight: 1.3,
            color: "rgba(241,246,236,0.8)",
          }}
        >
          in the pickle we trust
        </p>
      </div>

      {/* Illustration */}
      <div className="relative w-full" style={{ maxWidth: "100%" }}>
        <img
          src={oracleImg}
          alt="pickle oracle"
          className="w-full"
          style={{}}
        />

        {/* Sparkles around ball when animating */}
        <AnimatePresence>
          {oracleState === "animating" && sparkles.map((s, i) => (
            <Sparkle key={i} {...s} />
          ))}
        </AnimatePresence>

        {/* Answer text centered on crystal ball */}
        <AnimatePresence>
          {oracleState === "revealed" && (
            <div
              className="absolute pointer-events-none flex items-center justify-center"
              style={{ left: BALL_X, top: BALL_Y, transform: "translate(-50%, -50%)" }}
            >
              <motion.span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: "34px",
                  color: "#2b1260",
                  lineHeight: 1,
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {answer}
              </motion.span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full px-10">
        {oracleState === "revealed" ? (
          <button
            onClick={triggerOracle}
            className="w-full rounded-2xl py-3 transition-opacity active:opacity-80"
            style={{
              backgroundColor: "#FF98DE",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#F1F6EC",
            }}
          >
            pick again
          </button>
        ) : (
          <button
            onClick={triggerOracle}
            disabled={oracleState === "animating"}
            className="w-full rounded-2xl py-3 transition-opacity active:opacity-80 disabled:opacity-60"
            style={{
              backgroundColor: "#FF98DE",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#F1F6EC",
            }}
          >
            pickle my faith
          </button>
        )}
        <button
          onClick={onBack}
          className="w-full rounded-2xl py-3 border transition-opacity active:opacity-80"
          style={{
            borderColor: "#F1F6EC",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: "20px",
            color: "#F1F6EC",
          }}
        >
          back home
        </button>
      </div>
    </div>
  );
}
