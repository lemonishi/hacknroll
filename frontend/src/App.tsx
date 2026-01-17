import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Sidebar from "./components/Sidebar";
import Floorplan from "./components/Floorplan";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import GridLayout from "./layouts/GridLayout";
import Log from "./components/Log";
import initialLamps from "./data/test.json";
import { useMemo, useState } from "react";

function App() {
  const [lamps, setLamps] = useState(initialLamps);
  const url = "http://10.203.103.170:5001";

  useEffect(() => {
    const fetchLamps = async () => {
      try {
        const res = await fetch(`${url}/devices/list`);
        if (!res.ok) {
          throw new Error("Failed to get lamps!");
        }
        const data = await res.json();
        setLamps(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLamps();
    const interval = setInterval(fetchLamps, 1000);
    return () => clearInterval(interval);
  }, []);

  // Level selector state (Navbar buttons will now work)
  const [level, setLevel] = useState<1 | 2>(1);

  // If your lamps have a `level` field (1/2), this will filter.
  // If they DON'T, it will just show all lamps (still fine).
  const visibleLamps = useMemo(() => {
    const hasLevelField = lamps.some((l) => l && (l.level === 1 || l.level === 2));
    if (!hasLevelField) return lamps;
    return lamps.filter((l) => l.level === level);
  }, [lamps, level]);

  return (
    <MainLayout>
      <Navbar level={level} setLevel={setLevel} />

      <GridLayout>
        <Floorplan lamps={visibleLamps} setLamps={setLamps} />
        <Log />
        <Sidebar lamps={visibleLamps} />
      </GridLayout>
    </MainLayout>
  );
}

export default App;
