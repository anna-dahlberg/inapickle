import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { colors, font } from "../../styles/tokens";

interface PickerScreenProps {
  initialTitle?: string;
  initialOptions?: string[];
  editingJarId?: string | null;
  onPickAPickle: (options: string[], title: string) => void;
  onSaveToPantry: (title: string, options: string[], jarId?: string) => void;
  onBack: () => void;
}

export function PickerScreen({
  initialTitle = "",
  initialOptions = [],
  editingJarId,
  onPickAPickle,
  onSaveToPantry,
  onBack,
}: PickerScreenProps) {
  const [title, setTitle] = useState(initialTitle);
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [optionInput, setOptionInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [options.length]);

  const addOption = () => {
    const trimmed = optionInput.trim();
    if (!trimmed) return;
    setOptions((prev) => [...prev, trimmed]);
    setOptionInput("");
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addOption();
  };

  const handlePickAPickle = () => {
    if (options.length === 0) return;
    onPickAPickle(options, title || "the picker");
  };

  const handleSave = () => {
    if (!title.trim() || options.length === 0) return;
    onSaveToPantry(title.trim(), options, editingJarId || undefined);
  };

  const isValid = options.length > 0;
  const canSave = title.trim().length > 0 && options.length > 0;

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
        {editingJarId ? "edit jar" : "the picker"}
      </h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="jar title..."
        className="w-full rounded-2xl px-4 py-4 outline-none mt-8"
        style={{
          backgroundColor: colors.limeTint,
          fontFamily: font.family,
          fontWeight: font.weight.bold,
          fontSize: "22px",
          lineHeight: 1.2,
          color: colors.text,
          flexShrink: 0,
        }}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto mt-6 min-h-0 no-scrollbar">
        <div className="flex flex-col gap-5 w-full">
          <AnimatePresence>
            {options.map((opt, index) => (
              <motion.div
                key={`${opt}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="relative w-full"
              >
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ backgroundColor: colors.textDim }}
                />
                <div className="flex items-center justify-between px-4 py-2">
                  <span
                    style={{
                      fontFamily: font.family,
                      fontWeight: font.weight.medium,
                      fontSize: "20px",
                      lineHeight: 1.3,
                      color: colors.text,
                    }}
                  >
                    {opt}
                  </span>
                  <button
                    onClick={() => removeOption(index)}
                    className="shrink-0 w-5 h-5 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                      <path d="M1 13L13 1M13 13L1 1" stroke={colors.text} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-center w-full mt-6" style={{ flexShrink: 0 }}>
        <div className="flex gap-4 items-center w-full">
          <input
            value={optionInput}
            onChange={(e) => setOptionInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="add an option..."
            className="flex-1 rounded-2xl px-4 py-3 outline-none"
            style={{
              backgroundColor: colors.limeTint,
              fontFamily: font.family,
              fontWeight: font.weight.medium,
              fontSize: "20px",
              lineHeight: 1.3,
              color: colors.text,
            }}
          />
          <button
            onClick={addOption}
            className="shrink-0 w-[53px] h-[53px] rounded-2xl flex items-center justify-center transition-opacity active:opacity-80"
            style={{ backgroundColor: colors.textGhost }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M12 4v16M4 12h16" stroke={colors.text} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={handlePickAPickle}
            disabled={!isValid}
            className="w-full rounded-2xl py-3 transition-opacity active:opacity-80 disabled:opacity-40"
            style={{
              backgroundColor: colors.lime,
              fontFamily: font.family,
              fontWeight: font.weight.semibold,
              fontSize: "20px",
              color: colors.text,
            }}
          >
            pick a pickle
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="w-full rounded-2xl py-3 transition-opacity active:opacity-80 disabled:opacity-40"
            style={{
              backgroundColor: colors.pink,
              fontFamily: font.family,
              fontWeight: font.weight.semibold,
              fontSize: "20px",
              color: colors.text,
            }}
          >
            save to pantry
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
    </div>
  );
}
