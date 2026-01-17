import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Sidebar from "./components/Sidebar";
import Floorplan from "./components/Floorplan";
import Navbar from "./components/Navbar";
import GridLayout from "./layouts/GridLayout";
import Log from "./components/Log";
import initialLampsRaw from "./data/test.json";
import { useMemo, useState } from "react";
import allLevels from "./components/LevelList"

type Lamp = {
  uuid: string;     // we normalize keys (A1, A2...) into uuid
  label?: string;   // optional, but we keep it if present
  value?: number;
  x?: string;
  y?: string;
  level?: 1 | 2;
  [k: string]: any;
};

type LampsDict = Record<string, Lamp>;

function normalizeToDict(data: any): LampsDict {
  // dict input: { "A1": {...}, "A2": {...} }
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const out: LampsDict = {};
    for (const [k, v] of Object.entries(data)) {
      const lamp = (v as any) ?? {};
      const uuid = lamp.uuid ?? lamp.label ?? k;
      out[uuid] = { uuid, ...lamp, label: lamp.label ?? uuid };
    }
    return out;
  }

  // array input: [{uuid:...}, ...]
  if (Array.isArray(data)) {
    const out: LampsDict = {};
    for (const item of data) {
      if (!item) continue;
      const uuid = item.uuid ?? item.label;
      if (!uuid) continue;
      out[uuid] = { uuid, ...item, label: item.label ?? uuid };
    }
    return out;
  }

  return {};
}

function App() {
  const [lamps, setLamps] = useState<LampsDict>(() => normalizeToDict(initialLampsRaw));
  const [level, setLevel] = useState<typeof allLevels[number]>(1);

  const lampsArray = useMemo(() => Object.values(lamps), [lamps]);

  // ✅ always filter by level (works once test.json has level)
  const visibleLamps = useMemo(() => {
    return lampsArray.filter((l) => Number(l.level) === level);
  }, [lampsArray, level]);

  return (
    <MainLayout>
      <Navbar level={level} setLevel={setLevel} />

      <GridLayout>
        <Floorplan lamps={visibleLamps} setLamps={setLamps} level={level} />
        <Log />
        <Sidebar lamps={visibleLamps} />
      </GridLayout>
    </MainLayout>
  );
}

export default App;
