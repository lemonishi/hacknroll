import allLevels from "./LevelList"

type Props = {
  level: typeof allLevels[number];
  setLevel: (lvl: typeof allLevels[number]) => void;
};

function Navbar({ level, setLevel }: Props) {
  return (
    <div className="w-full bg-[#2b2b2b] rounded-xl border border-white/5 px-6 py-4 flex items-center justify-center">
      <div className="bg-[#1f1f1f] border border-white/10 rounded-full p-1 flex gap-1">
        {
          allLevels.map(levelSelector => (
            <button
              type="button"
              onClick={() => setLevel(levelSelector)}
              className={
                level === levelSelector
                  ? "px-4 py-2 rounded-full text-sm font-semibold bg-[#2d2d2d] text-yellow-300 shadow"
                  : "px-4 py-2 rounded-full text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition"
              }
            >
              Level {levelSelector}
            </button>
          ))
        }
      </div>
    </div>
  );
}

export default Navbar;
