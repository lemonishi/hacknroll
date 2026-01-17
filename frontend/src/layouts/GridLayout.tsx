function GridLayout({ children }: any) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {children}
    </div>
  );
}

export default GridLayout;
