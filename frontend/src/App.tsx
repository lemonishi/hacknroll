import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Sidebar from "./components/Sidebar";
import Floorplan from "./components/Floorplan";
import Navbar from "./components/Navbar";
import GridLayout from "./layouts/GridLayout";
import Log from "./components/Log";
import initialLampsRaw from "./data/test.json";
import { useEffect, useMemo, useState } from "react";

type Lamp = {
  uuid: string;
  value?: number;
  x?: string;
  y?: string;
  level?: 1 | 2;
  [k: string]: any;
};

type LampsDict = Record<string, Lamp>;

function normalizeToDict(data: any): LampsDict {
  // If already a dict: return it, but ensure uuid exists
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const out: LampsDict = {};
    for (const [k, v] of Object.entries(data)) {
      const lamp = (v as any) ?? {};
      const uuid = lamp.uuid ?? k;
      out[uuid] = { uuid, ...lamp };
    }
    return out;
  }

  // If array: convert to dict by uuid
  if (Array.isArray(data)) {
    const out: LampsDict = {};
    for (const item of data) {
      if (!item) continue;
      const uuid = item.uuid;
      if (!uuid) continue;
      out[uuid] = { uuid, ...item };
    }
    return out;
  }

  return {};
}

function App() {
  // store as DICTIONARY now
  const [lamps, setLamps] = useState<LampsDict>(() => normalizeToDict(initialLampsRaw));

  // Level selector
  const [level, setLevel] = useState<1 | 2>(1);

  // Example: if you fetch lamps periodically and backend returns dict
  // keep it dictionary-safe:
  useEffect(() => {
    async function fetchLamps() {
      // TODO: replace with your real endpoint
      // const res = await fetch("http://localhost:5000/lamps");
      // const data = await res.json();
      // setLamps(normalizeToDict(data));
    }

    fetchLamps();
    const interval = setInterval(fetchLamps, 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert dict -> array when you need list operations
  const lampsArray = useMemo(() => Object.values(lamps), [lamps]);

  // Filter only if "level" actually exists in the lamp objects
  const visibleLamps = useMemo(() => {
    const hasLevelField = lampsArray.some((l) => l && (l.level === 1 || l.level === 2));
    if (!hasLevelField) return lampsArray;
    return lampsArray.filter((l) => l.level === level);
  }, [lampsArray, level]);

  return (
    <MainLayout>
      {/* IMPORTANT: setLevel prop name must match Navbar.tsx */}
      <Navbar level={level} setLevel={setLevel} />

      <GridLayout>
        {/* Floorplan/Sidebar still receive an ARRAY (visibleLamps) */}
        {/* But setLamps is now DICT setter; Floorplan must update dict by uuid */}
        <Floorplan lamps={visibleLamps} setLamps={setLamps} level={level} />
        <Log />
        <Sidebar lamps={visibleLamps} />
      </GridLayout>
    </MainLayout>
  );
}

export default App;
