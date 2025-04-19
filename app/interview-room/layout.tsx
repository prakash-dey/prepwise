const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="root-layout flex justify-end">
        <div></div>
      {children}
    </div>
  );
}
export default RootLayout;