import { useRef, useState } from "react";
import Lamp from "./Lamp";

type LampPos = { label: string; x: string; y: string };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function Floorplan() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [lamps, setLamps] = useState<LampPos[]>([
    { label: "L1", x: "50%", y: "50%" },
    { label: "L2", x: "30%", y: "40%" },
    { label: "L3", x: "70%", y: "35%" },
  ]);

  const handleMovePx = (label: string, clientX: number, clientY: number) => {
    const img = imgRef.current;
    if (!img) return;

    const r = img.getBoundingClientRect();

    // position inside image in px
    const px = clamp(clientX - r.left, 0, r.width);
    const py = clamp(clientY - r.top, 0, r.height);

    // convert to % relative to image
    const pctX = (px / r.width) * 100;
    const pctY = (py / r.height) * 100;

    setLamps(prev =>
      prev.map(l =>
        l.label === label
          ? { ...l, x: `${pctX.toFixed(1)}%`, y: `${pctY.toFixed(1)}%` }
          : l
      )
    );
  };

  return (
    <div className="w-2/3 bg-gray-500">
      <div className="relative w-full h-[90vh] overflow-hidden">
        <img
          ref={imgRef}
          src="/floorplan.png"
          alt="Library Floorplan"
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />

        {/* Put lamps in a layer that matches the image box */}
        <div className="absolute inset-0 pointer-events-none">
          {lamps.map(l => (
            <Lamp
              key={l.label}
              label={l.label}
              x={l.x}
              y={l.y}
              onMovePx={handleMovePx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Floorplan;
