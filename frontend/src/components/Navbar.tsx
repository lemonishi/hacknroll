type Props = {
  level: 1 | 2;
  setLevel: (lvl: 1 | 2) => void;
};

function Navbar({ level, setLevel }: Props) {
  return (
    <div className="w-full bg-[#2b2b2b] rounded-xl border border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="HushLight" className="h-8 w-8" />
        <span className="font-semibold text-white">HushLight</span>
      </div>
      <div className="bg-[#1f1f1f] border border-white/10 justify-center rounded-full p-1 flex gap-1">
        <button
          type="button"
          onClick={() => setLevel(1)}
          className={
            level === 1
              ? "px-4 py-2 rounded-full text-sm font-semibold bg-[#2d2d2d] text-yellow-300 shadow"
              : "px-4 py-2 rounded-full text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition"
          }
        >
          Level 1
        </button>
        <button
          type="button"
          onClick={() => setLevel(2)}
          className={
            level === 2
              ? "px-4 py-2 rounded-full text-sm font-semibold bg-[#2d2d2d] text-yellow-300 shadow"
              : "px-4 py-2 rounded-full text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition"
          }
        >
          Level 2
        </button>
      </div>
    </div>
  );
}

export default Navbar;
