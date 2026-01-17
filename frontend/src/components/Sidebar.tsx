function Sidebar(props: any) {
  return (
    <div className="col-span-12 w-full bg-[#2d2d2d] p-5 pt-10 rounded-xl border border-white/5">
      <div className="flex flex-col gap-4">
        {props.lamps.map((lamp: any) => (
          <div key={lamp.uuid} className="flex flex-col gap-4 bg-[#2f2f2f] rounded-lg p-4 border border-white/5">
            <p className="text-3xl text-white">{lamp.uuid}</p>

            <div className="flex justify-between mb-1">
              <span className="text-sm text-white font-medium">Noise Level</span>
              <span className="text-sm text-white font-medium">
                {typeof lamp.value === "number" ? `${lamp.value}%` : "—"}
              </span>
            </div>

            <div className="w-full bg-[#3a3a3a] rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{
                  width:
                    typeof lamp.value === "number"
                      ? `${Math.max(0, Math.min(100, lamp.value))}%`
                      : "0%",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
