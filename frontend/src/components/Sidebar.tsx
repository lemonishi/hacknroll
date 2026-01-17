function Sidebar(props: any) {
  return (
    <div className="bg-[#2d2d2d] p-5 pt-10 col-span-8">
      <div className="flex flex-col gap-4">
        {props.lamps.map((lamp: any) => (
          <div className="flex flex-col gap-4 bg-[#2f2f2f] rounded-lg p-4">
            <p className="text-3xl text-white">{lamp.uuid}</p>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-white font-medium text-body">
                Noise Level
              </span>
              <span className="text-sm text-white font-medium text-body">
                50%
              </span>
            </div>
            <div className="w-full bg-[#3a3a3a] rounded-full h-2">
              <div className="bg-white h-2 rounded-full w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
