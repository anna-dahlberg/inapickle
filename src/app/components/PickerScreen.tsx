import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

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
  const [title, setTitle] = useState(initialTitle || "");
  const [options, setOptions] = useState<string[]>(initialOptions || []);
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
      style={{ backgroundColor: "#096343" }}
    >
      {/* Header */}
      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(28px, 9vw, 42px)",
          lineHeight: 1.1,
          color: "#F1F6EC",
          flexShrink: 0,
        }}
      >
        {editingJarId ? "edit jar" : "the picker"}
      </h1>

      {/* Title input */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="jar title..."
        className="w-full rounded-2xl px-4 py-4 outline-none mt-8"
        style={{
          backgroundColor: "rgba(173, 223, 38, 0.15)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: "22px",
          lineHeight: 1.2,
          color: "#F1F6EC",
          flexShrink: 0,
        }}
      />

      {/* Scrollable options list */}
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
                  style={{ backgroundColor: "rgba(241,246,236,0.2)" }}
                />
                <div className="flex items-center justify-between px-4 py-2">
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: "20px",
                      lineHeight: 1.3,
                      color: "#F1F6EC",
                    }}
                  >
                    {opt}
                  </span>
                  <button
                    onClick={() => removeOption(index)}
                    className="shrink-0 w-5 h-5 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                      <path d="M1 13L13 1M13 13L1 1" stroke="#F1F6EC" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-6 items-center w-full mt-6" style={{ flexShrink: 0 }}>
        {/* Option input row */}
        <div className="flex gap-4 items-center w-full">
          <input
            value={optionInput}
            onChange={(e) => setOptionInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="add an option..."
            className="flex-1 rounded-2xl px-4 py-3 outline-none"
            style={{
              backgroundColor: "rgba(173, 223, 38, 0.15)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: 1.3,
              color: "#F1F6EC",
            }}
          />
          <button
            onClick={addOption}
            className="shrink-0 w-[53px] h-[53px] rounded-2xl flex items-center justify-center transition-opacity active:opacity-80"
            style={{ backgroundColor: "rgba(241,246,236,0.1)" }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M12 4v16M4 12h16" stroke="#F1F6EC" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={handlePickAPickle}
            disabled={!isValid}
            className="w-full rounded-2xl py-3 transition-opacity active:opacity-80 disabled:opacity-40"
            style={{
              backgroundColor: "#ADDF26",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#F1F6EC",
            }}
          >
            pick a pickle
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="w-full rounded-2xl py-3 transition-opacity active:opacity-80 disabled:opacity-40"
            style={{
              backgroundColor: "#FF98DE",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#F1F6EC",
            }}
          >
            save to pantry
          </button>
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
    </div>
  );
}
