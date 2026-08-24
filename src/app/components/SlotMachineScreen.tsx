import { useState, useMemo, useRef } from "react";
import { motion, useAnimate } from "motion/react";
import confetti from "canvas-confetti";
import machineImg from "@/imports/ChatGPT_Image_24_aug._2026_11_06_14.png";
import { colors, font } from "../../styles/tokens";

interface SlotMachineScreenProps {
  options: string[];
  title: string;
  onBack: () => void;
}

const ITEM_HEIGHT = 48;
const REPEATS = 150;
const START_REP = 3;
const LANDING_LAPS = 2;
const PHASE1_PX = ITEM_HEIGHT * 30;

const SCREEN_LEFT   = "21.8%";
const SCREEN_TOP    = "26.9%";
const SCREEN_WIDTH  = "56.4%";
const SCREEN_HEIGHT = "39.8%";

export function SlotMachineScreen({ options, title, onBack }: SlotMachineScreenProps) {
  const [scope, animate] = useAnimate();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hasEverSpun, setHasEverSpun] = useState(false);

  const reelItems = useMemo(() => {
    if (options.length === 0) return [];
    return Array(REPEATS).fill(options).flat();
  }, [options]);

  const initialY = -(options.length * START_REP * ITEM_HEIGHT) + ITEM_HEIGHT;
  const currentYRef = useRef<number>(initialY);

  const doSpin = async () => {
    if (spinning || options.length === 0) return;
    setSpinning(true);
    setResult(null);

    const winnerIdx = Math.floor(Math.random() * options.length);
    const startY = currentYRef.current;
    const phase1Y = startY - PHASE1_PX;

    if (scope.current) {
      await animate(scope.current, { y: phase1Y }, { duration: 2.0, ease: "linear" });
    }

    const phase1ItemIdx = Math.round((ITEM_HEIGHT - phase1Y) / ITEM_HEIGHT);
    const currentMod = ((phase1ItemIdx % options.length) + options.length) % options.length;
    const stepsToWinner = ((winnerIdx - currentMod + options.length) % options.length) || options.length;
    const targetItemIdx = phase1ItemIdx + options.length * LANDING_LAPS + stepsToWinner;
    const targetY = -(targetItemIdx * ITEM_HEIGHT) + ITEM_HEIGHT;

    if (scope.current) {
      await animate(scope.current, { y: targetY }, { duration: 1.4, ease: [0.0, 0.0, 0.2, 1.0] });
    }

    currentYRef.current = targetY;
    setResult(options[winnerIdx]);
    setSpinning(false);
    setHasEverSpun(true);

    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.75 }, colors: [colors.pink, colors.lime, colors.text] });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.75 }, colors: [colors.pink, colors.lime, colors.text] });
  };

  return (
    <div
      className="h-screen flex flex-col pt-24 pb-14 overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      <h1
        className="px-10"
        style={{
          fontFamily: font.family,
          fontWeight: font.weight.bold,
          fontSize: "clamp(28px, 9vw, 42px)",
          lineHeight: 1.1,
          color: colors.text,
          flexShrink: 0,
        }}
      >
        {title}
      </h1>

      <div className="flex-1 flex items-center justify-center min-h-0">
        <div style={{ position: "relative", width: "100%" }}>

          <div
            style={{
              position: "absolute",
              left: SCREEN_LEFT,
              top: SCREEN_TOP,
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              overflow: "hidden",
              backgroundColor: colors.bgDeep,
              borderRadius: 8,
              zIndex: 1,
            }}
          >
            <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none" style={{
              height: ITEM_HEIGHT,
              background: `linear-gradient(to bottom, ${colors.bgOverlay}, transparent)`,
            }} />
            <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none" style={{
              height: ITEM_HEIGHT,
              background: `linear-gradient(to top, ${colors.bgOverlay}, transparent)`,
            }} />
            <div className="absolute left-0 right-0 z-0 pointer-events-none" style={{
              top: ITEM_HEIGHT,
              height: ITEM_HEIGHT,
              backgroundColor: colors.pinkTint,
              borderTop: `2px solid ${colors.pink}`,
              borderBottom: `2px solid ${colors.pink}`,
            }} />

            <motion.div ref={scope} style={{ y: initialY }}>
              {reelItems.map((item, i) => (
                <div key={i} className="flex items-center justify-center" style={{ height: ITEM_HEIGHT, padding: "0 10px" }}>
                  <span className="text-center truncate w-full" style={{
                    fontFamily: font.family,
                    fontWeight: font.weight.semibold,
                    fontSize: "15px",
                    color: colors.text,
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>

            {result && !spinning && (
              <div
                className="absolute left-0 right-0 flex items-center justify-center pointer-events-none z-20"
                style={{
                  top: ITEM_HEIGHT,
                  height: ITEM_HEIGHT,
                  padding: "0 10px",
                  backgroundColor: colors.bgOverlay,
                  borderTop: `2px solid ${colors.pink}`,
                  borderBottom: `2px solid ${colors.pink}`,
                }}
              >
                <span
                  className="text-center w-full truncate"
                  style={{
                    fontFamily: font.family,
                    fontWeight: font.weight.extrabold,
                    fontSize: "19px",
                    color: colors.pink,
                    lineHeight: 1.2,
                  }}
                >
                  {result}
                </span>
              </div>
            )}
          </div>

          <img
            src={machineImg}
            alt="slot machine"
            className="w-full relative"
            style={{ zIndex: 2, pointerEvents: "none" }}
          />

          <button
            onClick={doSpin}
            disabled={spinning}
            aria-label="spin"
            style={{
              position: "absolute",
              left: "37%", top: "72%",
              width: "26%", height: "13%",
              zIndex: 3,
              opacity: 0,
              cursor: "pointer",
            }}
          />

          <button
            onClick={doSpin}
            disabled={spinning}
            aria-label="pull handle"
            style={{
              position: "absolute",
              left: "76%", top: "38%",
              width: "18%", height: "28%",
              zIndex: 3,
              opacity: 0,
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full px-10" style={{ flexShrink: 0 }}>
        <button
          onClick={doSpin}
          disabled={spinning}
          className={`w-full rounded-2xl py-3 transition-opacity active:opacity-80 ${spinning ? 'opacity-40 pointer-events-none' : ''}`}
          style={{
            backgroundColor: colors.lime,
            fontFamily: font.family,
            fontWeight: font.weight.semibold,
            fontSize: "20px",
            color: colors.text,
          }}
        >
          {hasEverSpun ? "spin again" : "spin"}
        </button>
        <button
          onClick={onBack}
          className="w-full rounded-2xl py-3 border transition-opacity active:opacity-80"
          style={{
            borderColor: colors.text,
            fontFamily: font.family,
            fontWeight: font.weight.semibold,
            fontSize: "20px",
            color: colors.text,
          }}
        >
          back
        </button>
      </div>
    </div>
  );
}
