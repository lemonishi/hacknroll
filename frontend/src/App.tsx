import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Sidebar from "./components/Sidebar";
import Floorplan from "./components/Floorplan";
import Navbar from "./components/Navbar";
import GridLayout from "./layouts/GridLayout";
import Log from "./components/Log";
import initialLampsRaw from "./data/test.json";
import { useEffect, useMemo, useRef, useState } from "react";

type Lamp = {
  uuid: string;
  label?: string;
  value?: number;
  x?: string;
  y?: string;
  level?: 1 | 2;
  [k: string]: any;
};

type LampsDict = Record<string, Lamp>;

type LogItem = {
  ts: string;
  lamp: string;
  msg: string;
  level?: "info" | "warn" | "alert";
};

const LOUD_THRESHOLD = 70;
const LOUD_STREAK_TO_LOG = 10;
const MAX_LOGS = 50;

function nowTs() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function normalizeToDict(data: any): LampsDict {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const out: LampsDict = {};
    for (const [k, v] of Object.entries(data)) {
      const lamp = (v as any) ?? {};
      const uuid = lamp.uuid ?? lamp.label ?? k;
      out[uuid] = {
        uuid,
        ...lamp,
        level: lamp.level ?? 1,
        label: lamp.label ?? uuid,
      };
    }
    return out;
  }

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

export default function App() {
  const [lamps, setLamps] = useState<LampsDict>(() =>
    normalizeToDict(initialLampsRaw),
  );
  const [level, setLevel] = useState<1 | 2>(1);

  const [logs, setLogs] = useState<LogItem[]>([]);

  // refs to avoid stale closures + avoid rerenders
  const lampsRef = useRef<LampsDict>(lamps);
  useEffect(() => {
    lampsRef.current = lamps;
  }, [lamps]);

  const loudStreakRef = useRef<Record<string, number>>({});
  const hasLoggedThisEpisodeRef = useRef<Record<string, boolean>>({});

  const lampsArray = useMemo(() => Object.values(lamps), [lamps]);
  const visibleLamps = useMemo(
    () => lampsArray.filter((l) => Number(l.level) === level),
    [lampsArray, level],
  );

  function applyIncoming(incoming: LampsDict) {
    // ✅ merge: do NOT lose local x/y when polling
    setLamps((prev) => {
      const merged: LampsDict = {};

      // merge incoming with prev positions
      for (const [id, incLamp] of Object.entries(incoming)) {
        const prevLamp = prev[id];
        merged[id] = {
          ...incLamp,
          x: incLamp.x ?? prevLamp?.x,
          y: incLamp.y ?? prevLamp?.y,
        };
      }

      // keep any prev lamps missing from incoming
      for (const [id, prevLamp] of Object.entries(prev)) {
        if (!merged[id]) merged[id] = prevLamp;
      }

      return merged;
    });

    // ✅ log logic based on incoming values (doesn't affect drag)
    const newLogs: LogItem[] = [];

    for (const [id, lamp] of Object.entries(incoming)) {
      const v = typeof lamp.value === "number" ? lamp.value : 0;
      const isLoud = v >= LOUD_THRESHOLD;

      const prevStreak = loudStreakRef.current[id] ?? 0;
      const nextStreak = isLoud ? prevStreak + 1 : 0;
      loudStreakRef.current[id] = nextStreak;

      if (!isLoud) {
        hasLoggedThisEpisodeRef.current[id] = false;
        continue;
      }

      const alreadyLogged = hasLoggedThisEpisodeRef.current[id] ?? false;
      if (!alreadyLogged && nextStreak >= LOUD_STREAK_TO_LOG) {
        hasLoggedThisEpisodeRef.current[id] = true;
        const name = lamp.label ?? lamp.uuid ?? id;

        newLogs.push({
          ts: nowTs(),
          lamp: name,
          msg: `Stayed LOUD (≥ ${LOUD_THRESHOLD}%) for ${LOUD_STREAK_TO_LOG} seconds. Current: ${v}%`,
          level: "alert",
        });
      }
    }

    if (newLogs.length) {
      setLogs((prev) => [...newLogs, ...prev].slice(0, MAX_LOGS));
    }
  }

  useEffect(() => {
    async function fetchLamps() {
      // ✅ If backend is not working yet, simulate "fetch" using CURRENT state (not stale)
      // This keeps logs counting and allows drag to persist.
      // const simulatedIncoming = lampsRef.current;
      // applyIncoming(simulatedIncoming);

      // Later, replace the above 2 lines with real fetch:
      const res = await fetch("http://10.203.103.170:5001/devices/list");
      const data = await res.json();
      applyIncoming(normalizeToDict(data));
      console.log(lamps);
    }

    fetchLamps();
    const interval = setInterval(fetchLamps, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      <Navbar level={level} setLevel={setLevel} />
      <GridLayout>
        <Floorplan lamps={visibleLamps} setLamps={setLamps} level={level} />
        <Log logs={logs} />
        <Sidebar lamps={visibleLamps} />
      </GridLayout>
    </MainLayout>
  );
}
