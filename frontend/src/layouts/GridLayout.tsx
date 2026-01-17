function GridLayout({ children }: any) {
  return (
    <div className="grid grid-rows-3 grid-cols-8 gap-4 *:rounded-lg *:p-4">
      {children}
    </div>
  );
}

export default GridLayout;
