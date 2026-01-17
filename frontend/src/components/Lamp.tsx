type LampProps = {
  label: string;
  x: string;
  y: string;
  onMovePx: (label: string, clientX: number, clientY: number) => void;
};

function Lamp({ label, x, y, onMovePx }: LampProps) {
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);

    const onPointerMove = (ev: PointerEvent) => {
      onMovePx(label, ev.clientX, ev.clientY);
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <div
      className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-lg border border-gray-300 cursor-grab active:cursor-grabbing select-none"
      style={{ left: x, top: y, touchAction: "none" }}
      onPointerDown={handlePointerDown}
    >
      {label}
    </div>
  );
}

export default Lamp;
