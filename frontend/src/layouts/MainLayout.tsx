function MainLayout({ children }: any) {
  return (
    <div className="flex flex-col gap-4 bg-[#212121] p-4 h-full">
      {children}
    </div>
  );
}

export default MainLayout;
