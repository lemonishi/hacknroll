import Lamp from "./Lamp";

function Floorplan(props: any) {
  const handleMove = (label: string, x: string, y: string) => {
    props.setLamps((prev: any) => ({
      ...prev,
      [label]: { ...prev[label], x, y },
    }));
  };

  return (
    <div className="flex justify-center items-center row-span-2 col-span-5 bg-[#2d2d2d]">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-[url('/floorplan.png')] bg-contain bg-no-repeat bg-center" />
        {Object.entries(props.lamps).map(([key, l]: [string, any]) => (
          <Lamp
            key={l.label}
            label={l.label}
            x={l.x || "50%"} // fallback so it won't disappear
            y={l.y || "50%"}
            onMove={handleMove}
          />
        ))}
      </div>
    </div>
  );
}

export default Floorplan;
