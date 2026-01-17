function MainLayout({ children }: any) {
  return (
    <div className="min-h-screen flex flex-col gap-4 bg-[#212121] p-4">
      {children}
    </div>
  );
}

export default MainLayout;
