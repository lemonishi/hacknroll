import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Sidebar from "./components/Sidebar";
import Floorplan from "./components/Floorplan";
import lamps from "./data/test.json";
import { useEffect } from "react";

function App() {
  const url = "";
  // const lamps = ["lamp1", "lamp2"];

  // useEffect(() => {
  //   fetch(url);
  // }, []);

  return (
    <MainLayout>
      <Sidebar lamps={lamps} />
      <Floorplan lamps={lamps} />
    </MainLayout>
  );
}

export default App;
