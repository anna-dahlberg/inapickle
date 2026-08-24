import { useState, useCallback, useEffect } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { HomeScreen } from "./components/HomeScreen";
import { PickleOracle } from "./components/PickleOracle";
import { PickerScreen } from "./components/PickerScreen";
import { PantryScreen } from "./components/PantryScreen";
import type { Jar } from "./components/PantryScreen";
import { SlotMachineScreen } from "./components/SlotMachineScreen";
import { colors } from "../styles/tokens";

type Screen =
  | "splash"
  | "home"
  | "oracle"
  | "picker"
  | "pantry"
  | "slot-machine";

interface PickerState {
  title: string;
  options: string[];
  editingJarId: string | null;
}

interface SlotState {
  options: string[];
  title: string;
  returnTo: "picker" | "pantry";
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [jars, setJars] = useState<Jar[]>(() => {
    try {
      const stored = localStorage.getItem("pickle-jars");
      return stored ? (JSON.parse(stored) as Jar[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("pickle-jars", JSON.stringify(jars));
  }, [jars]);
  const [pickerState, setPickerState] = useState<PickerState>({
    title: "",
    options: [],
    editingJarId: null,
  });
  const [slotState, setSlotState] = useState<SlotState>({
    options: [],
    title: "",
    returnTo: "picker",
  });

  const goHome = useCallback(() => setScreen("home"), []);

  const handlePickAPickle = useCallback(
    (options: string[], title: string) => {
      setSlotState({ options, title, returnTo: "picker" });
      setScreen("slot-machine");
    },
    []
  );

  const handleSaveToPantry = useCallback(
    (title: string, options: string[], jarId?: string) => {
      setJars((prev) => {
        if (jarId) {
          return prev.map((j) =>
            j.id === jarId ? { ...j, name: title, options } : j
          );
        }
        const newJar: Jar = {
          id: crypto.randomUUID(),
          name: title,
          options,
          pinned: false,
        };
        return [...prev, newJar];
      });
      setScreen("pantry");
    },
    []
  );

  const handleTogglePin = useCallback((id: string) => {
    setJars((prev) =>
      prev.map((j) => (j.id === id ? { ...j, pinned: !j.pinned } : j))
    );
  }, []);

  const handleDeleteJar = useCallback((id: string) => {
    setJars((prev) => prev.filter((j) => j.id !== id));
  }, []);

  const handleEditJar = useCallback((jar: Jar) => {
    setPickerState({
      title: jar.name,
      options: jar.options,
      editingJarId: jar.id,
    });
    setScreen("picker");
  }, []);

  const handlePickFromJar = useCallback((jar: Jar) => {
    setSlotState({
      options: jar.options,
      title: jar.name,
      returnTo: "pantry",
    });
    setScreen("slot-machine");
  }, []);

  const handleNewJar = useCallback(() => {
    setPickerState({ title: "", options: [], editingJarId: null });
    setScreen("picker");
  }, []);

  const handleOpenPicker = useCallback(() => {
    setPickerState({ title: "", options: [], editingJarId: null });
    setScreen("picker");
  }, []);

  const handleSlotBack = useCallback(() => {
    setScreen(slotState.returnTo === "pantry" ? "pantry" : "home");
  }, [slotState.returnTo]);

  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return <SplashScreen onComplete={goHome} />;

      case "home":
        return (
          <HomeScreen
            onPickleOracle={() => setScreen("oracle")}
            onThePicker={handleOpenPicker}
            onYourPantry={() => setScreen("pantry")}
          />
        );

      case "oracle":
        return <PickleOracle onBack={goHome} />;

      case "picker":
        return (
          <PickerScreen
            initialTitle={pickerState.title}
            initialOptions={pickerState.options}
            editingJarId={pickerState.editingJarId}
            onPickAPickle={handlePickAPickle}
            onSaveToPantry={handleSaveToPantry}
            onBack={goHome}
          />
        );

      case "pantry":
        return (
          <PantryScreen
            jars={jars}
            onTogglePin={handleTogglePin}
            onEditJar={handleEditJar}
            onPickFromJar={handlePickFromJar}
            onDeleteJar={handleDeleteJar}
            onNewJar={handleNewJar}
            onBack={goHome}
          />
        );

      case "slot-machine":
        return (
          <SlotMachineScreen
            options={slotState.options}
            title={slotState.title}
            onBack={handleSlotBack}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="w-full max-w-[440px] min-h-screen relative">
        {renderScreen()}
      </div>
    </div>
  );
}
