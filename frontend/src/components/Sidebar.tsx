function Sidebar(props: any) {
  return (
    <div className="bg-gray-600 p-5 pt-10 w-1/3">
      <div className="flex flex-col gap-4">
        {props.lamps.map((lamp: any) => (
          <div className="flex flex-col gap-4 bg-gray-300 rounded-lg p-2">
            <p className="text-lg">{lamp.uuid}</p>
            <p className="text-sm">Noise Level</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
