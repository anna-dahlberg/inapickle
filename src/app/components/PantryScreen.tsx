import { useState, useEffect, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { JarIcon } from "./JarIcon";
import { colors, font } from "../../styles/tokens";

export interface Jar {
  id: string;
  name: string;
  options: string[];
  pinned: boolean;
}

interface PantryScreenProps {
  jars: Jar[];
  onTogglePin: (id: string) => void;
  onEditJar: (jar: Jar) => void;
  onPickFromJar: (jar: Jar) => void;
  onDeleteJar: (id: string) => void;
  onNewJar: () => void;
  onBack: () => void;
}

function PinIcon({ pinned }: { pinned: boolean }) {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 22 22" style={{ opacity: pinned ? 1 : 0.4 }}>
      <circle cx="7.5" cy="7.5" r="5.5" stroke={pinned ? colors.pink : colors.text} strokeWidth="1.5" />
      <path d="M7.5 13v7" stroke={pinned ? colors.pink : colors.text} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path
        d="M14.5 2.5L17.5 5.5L6.5 16.5H3.5V13.5L14.5 2.5Z"
        stroke={colors.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"
      />
    </svg>
  );
}

function TrashIcon({ confirming }: { confirming: boolean }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path
        d="M3 5h14M8 5V3h4v2M6 5l1 11h6l1-11"
        stroke={confirming ? colors.danger : colors.text}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        opacity={confirming ? 1 : 0.6}
      />
    </svg>
  );
}

const JarCard = forwardRef<HTMLDivElement, {
  jar: Jar;
  onTogglePin: (id: string) => void;
  onEditJar: (jar: Jar) => void;
  onPickFromJar: (jar: Jar) => void;
  onDeleteJar: (id: string) => void;
}>(function JarCard({
  jar,
  onTogglePin,
  onEditJar,
  onPickFromJar,
  onDeleteJar,
}, ref) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!confirmingDelete) return;
    const t = setTimeout(() => setConfirmingDelete(false), 2500);
    return () => clearTimeout(t);
  }, [confirmingDelete]);

  const handleTrashTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmingDelete) {
      onDeleteJar(jar.id);
    } else {
      setConfirmingDelete(true);
    }
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.22 } }}
      transition={{ duration: 0.2 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        backgroundColor: jar.pinned ? colors.pinkWash : "transparent",
        border: jar.pinned ? `2px solid ${colors.pink}` : `1px solid ${colors.textSoft}`,
        boxShadow: jar.pinned ? "none" : "0px 4px 4px 0px rgba(0,0,0,0.25)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <button
          className="flex items-center gap-3 flex-1 text-left active:opacity-70 transition-opacity"
          onClick={() => onPickFromJar(jar)}
        >
          <JarIcon color={jar.pinned ? colors.pink : colors.text} size={36} />
          <div className="flex flex-col gap-1">
            <span
              style={{
                fontFamily: font.family,
                fontWeight: font.weight.bold,
                fontSize: "16px",
                lineHeight: 1.4,
                color: colors.text,
              }}
            >
              {jar.name}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <button onClick={() => onEditJar(jar)} className="transition-opacity active:opacity-70">
            <EditIcon />
          </button>
          <button onClick={() => onTogglePin(jar.id)} className="transition-opacity active:opacity-70">
            <PinIcon pinned={jar.pinned} />
          </button>
          <motion.button
            onClick={handleTrashTap}
            className="transition-opacity active:opacity-70 relative"
            animate={{ scale: confirmingDelete ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            <TrashIcon confirming={confirmingDelete} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {confirmingDelete && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 24, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: colors.dangerTint }}
          >
            <span
              style={{
                fontFamily: font.family,
                fontWeight: font.weight.medium,
                fontSize: "12px",
                color: colors.danger,
              }}
            >
              tap trash again to delete
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export function PantryScreen({
  jars,
  onTogglePin,
  onEditJar,
  onPickFromJar,
  onDeleteJar,
  onNewJar,
  onBack,
}: PantryScreenProps) {
  const sortedJars = [...jars].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollMore, setCanScrollMore] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollMore(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  };

  useEffect(() => {
    checkScroll();
  }, [sortedJars.length]);

  return (
    <div
      className="h-screen flex flex-col px-10 pt-24 pb-14 overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      <h1
        style={{
          fontFamily: font.family,
          fontWeight: font.weight.bold,
          fontSize: "clamp(28px, 9vw, 42px)",
          lineHeight: 1.1,
          color: colors.text,
          flexShrink: 0,
        }}
      >
        your pantry
      </h1>

      <div className="relative flex-1 min-h-0 mt-8">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="h-full overflow-y-auto no-scrollbar"
        >
          <div className="flex flex-col gap-4 w-full pb-4">
            <AnimatePresence mode="popLayout">
              {sortedJars.length === 0 && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: font.family,
                    fontWeight: font.weight.regular,
                    fontSize: "16px",
                    color: colors.text,
                    textAlign: "center",
                    paddingTop: "32px",
                  }}
                >
                  no jars yet — save some options from the picker!
                </motion.p>
              )}
              {sortedJars.map((jar) => (
                <JarCard
                  key={jar.id}
                  jar={jar}
                  onTogglePin={onTogglePin}
                  onEditJar={onEditJar}
                  onPickFromJar={onPickFromJar}
                  onDeleteJar={onDeleteJar}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {canScrollMore && (
          <div
            className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pointer-events-none"
            style={{
              height: 64,
              background: `linear-gradient(to bottom, transparent, ${colors.bg})`,
            }}
          >
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" style={{ marginBottom: 4, opacity: 0.7 }}>
              <path d="M2 2l8 8 8-8" stroke={colors.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 w-full mt-6" style={{ flexShrink: 0 }}>
        <button
          onClick={onNewJar}
          className="w-full rounded-2xl py-3 flex items-center justify-center gap-2 transition-opacity active:opacity-80"
          style={{
            backgroundColor: colors.pink,
            fontFamily: font.family,
            fontWeight: font.weight.semibold,
            fontSize: "20px",
            color: colors.text,
          }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M10 3v14M3 10h14" stroke={colors.text} strokeWidth="2" strokeLinecap="round" />
          </svg>
          new jar
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
          back home
        </button>
      </div>
    </div>
  );
}
