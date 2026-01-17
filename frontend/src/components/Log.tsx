type LogItem = {
  ts: string; // e.g. "12:41:09"
  lamp: string; // e.g. "Lamp 2"
  msg: string; // e.g. "Noise spike: 78%"
  level?: "info" | "warn" | "alert";
};

function pillColor(level?: LogItem["level"]) {
  if (level === "alert") return "bg-red-500/20 text-red-200 border-red-500/30";
  if (level === "warn") return "bg-yellow-500/20 text-yellow-200 border-yellow-500/30";
  return "bg-sky-500/20 text-sky-200 border-sky-500/30";
}

function Log(props: { logs?: LogItem[] }) {
  const logs =
    props.logs ??
    [
      { ts: "12:41:09", lamp: "Lamp 2", msg: "Noise spike: 78%", level: "warn" },
      { ts: "12:41:03", lamp: "Lamp 1", msg: "Back to normal: 22%", level: "info" },
    ];

  return (
    <div className="col-span-12 lg:col-span-4 lg:row-span-2 w-full bg-[#2d2d2d] rounded-xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">Logs</h2>
        <span className="text-white/60 text-xs">{logs.length} events</span>
      </div>

      <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
        {logs.map((l, i) => (
          <div
            key={i}
            className="bg-[#2f2f2f] rounded-lg border border-white/5 p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">{l.ts}</span>
              <span className={`text-xs px-2 py-1 rounded-full border ${pillColor(l.level)}`}>
                {l.level ?? "info"}
              </span>
            </div>
            <div className="mt-2 text-white font-medium">{l.lamp}</div>
            <div className="text-white/80 text-sm">{l.msg}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Log;
