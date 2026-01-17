import Lamp from "./Lamp";

function Floorplan(props: any) {
  const handleMove = (uuid: string, x: string, y: string) => {
    props.setLamps((prev: any[]) =>
      prev.map((l: any) => (l.uuid === uuid ? { ...l, x, y } : l))
    );
  };

  return (
    
    <div className="flex justify-center items-center row-span-2 col-span-5 bg-[#2d2d2d]">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-[url('/floorplan.png')] bg-contain bg-no-repeat bg-center" />
        {props.lamps.map((l: any) => (
          <Lamp
            key={l.uuid}
            label={l.uuid}
            x={l.x || "50%"}   // fallback so it won't disappear
            y={l.y || "50%"}
            onMove={handleMove}
          />
        ))}
      </div>
    </div>
  );
}

export default Floorplan;
