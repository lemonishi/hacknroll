import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Sidebar from "./components/Sidebar";
import Floorplan from "./components/Floorplan";
import lamps from "./data/test.json";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import GridLayout from "./layouts/GridLayout";
import Log from "./components/Log";
import initialLamps from "./data/test.json";
import { useState } from "react";

function App() {
  const [lamps, setLamps] = useState<any[]>(initialLamps as any[]);

  return (
    <MainLayout>
      <Navbar />
      <GridLayout>
        <Floorplan lamps={lamps} setLamps={setLamps} />
        <Log />
        <Sidebar lamps={lamps} />
      </GridLayout>
    </MainLayout>
  );
}

export default App;
