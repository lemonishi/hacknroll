function Sidebar(props: any) {
  const lamps = props.lamps || [];

  return (
    <div className="col-span-12 w-full bg-[#2d2d2d] p-5 pt-10 rounded-xl border border-white/5">
      <div className="text-white text-lg font-semibold mb-4">
        Lamps ({lamps.length})
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {lamps.map((lamp: any) => (
          <div key={lamp.uuid} className="flex flex-col gap-3 bg-[#2f2f2f] rounded-lg p-4 border border-white/5">
            <p className="text-2xl text-white font-semibold">{lamp.label ?? lamp.uuid}</p>

            <div className="flex justify-between">
              <span className="text-sm text-white/70">Noise</span>
              <span className="text-sm text-white font-medium">
                {typeof lamp.value === "number" ? `${lamp.value} %` : "—"}
              </span>
            </div>

            <div className="text-xs text-white/50">
              Position: {lamp.x ?? "50%"}, {lamp.y ?? "50%"}
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
