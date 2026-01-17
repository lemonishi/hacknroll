import Lamp from "./Lamp";

function Floorplan(props: any) {
  const handleMove = (label: string, x: string, y: string) => {
    props.setLamps((prev: any) => ({
      ...prev,
      [label]: { ...(prev?.[label] ?? { label }), x, y },
    }));
  };

  return (
    <div className="col-span-12 lg:col-span-8 lg:row-span-2 w-full bg-[#2b2b2b] rounded-xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-white text-lg font-semibold">Floorplan</div>
          <div className="text-white/60 text-xs">
            Drag pins to set lamp positions • Level {props.level}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-full border border-white/10 text-white/70">
            Legend
          </span>
          <span className="px-2 py-1 rounded-full bg-green-500/15 text-green-200 border border-green-500/30">
            Quiet
          </span>
          <span className="px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-200 border border-yellow-500/30">
            Warn
          </span>
          <span className="px-2 py-1 rounded-full bg-red-500/15 text-red-200 border border-red-500/30">
            Loud
          </span>
        </div>
      </div>

      <div className="relative w-full h-[55vh] rounded-xl overflow-hidden bg-[#1f1f1f] border border-white/10">
        <img
          src={`/floorplan-${props.level}.png`}
          alt="Library Floorplan"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          draggable={false}
        />

        {(props.lamps || []).map((l: any) => (
          <Lamp
            key={l.label}
            label={l.label}
            x={l.x || "50%"}
            y={l.y || "50%"}
            value={typeof l.value === "number" ? l.value : 0}
            onMove={handleMove}
          />
        ))}
      </div>
    </div>
  );
}

export default Floorplan;
