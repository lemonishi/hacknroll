import Lamp from "./Lamp";

function Floorplan(props: any) {
  return (
    <div className="flex justify-center items-center bg-gray-500 w-2/3">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-[url('/floorplan.png')] bg-contain bg-no-repeat bg-center" />
        <Lamp />
      </div>
    </div>
  );
}

export default Floorplan;
