import Lamp from "./Lamp";
import positions from "../data/position.json";
import { useMemo } from "react";

type Position = {
  id: string;
  x: string;
  y: string;
  level: 1 | 2;
};

function Floorplan(props: any) {
  /**
   * Build lookup:
   * {
   *   A1: { x, y, level },
   *   A2: { x, y, level },
   *   ...
   * }
   */
  const positionMap = useMemo(() => {
    const map: Record<string, Position> = {};
    (positions as Position[]).forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, []);

  /**
   * Drag handler
   * (updates App state only; does NOT touch position.json)
   */
  const handleMove = (label: string, x: string, y: string) => {
    props.setLamps((prev: any) => ({
      ...prev,
      [label]: {
        ...(prev?.[label] ?? { label }),
        x,
        y,
      },
    }));
  };

  return (
    <div className="col-span-12 lg:col-span-8 lg:row-span-2 w-full bg-[#2b2b2b] rounded-xl border border-white/5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-white text-lg font-semibold">Floorplan</div>
          <div className="text-white/60 text-xs">
            Drag pins to set lamp positions • Level {props.level}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-[55vh] rounded-xl overflow-hidden bg-[#1f1f1f] border border-white/10">
        {/* SINGLE shared floorplan image */}
        <img
          src={`/floorplan-${props.level}.png`}
          alt="Library Floorplan"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          draggable={false}
        />


        {/* Lamps */}
        {(props.lamps || []).map((lamp: any) => {
          const pos = positionMap[lamp.label];

          // If no position entry or wrong level → don't render
          if (!pos || pos.level !== props.level) return null;

          return (
            <Lamp
              key={lamp.label}
              label={lamp.label}
              value={typeof lamp.value === "number" ? lamp.value : 0}
              x={lamp.x ?? pos.x}
              y={lamp.y ?? pos.y}
              onMove={handleMove}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Floorplan;
