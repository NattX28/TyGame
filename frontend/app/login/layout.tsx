const Loginpagelayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* Left side */}
      <div className="w-4/6 bg-main flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Tygame</h1>
        <p className="text-xl text-center">
          - Share your experience about gaming -
        </p>
      </div>
      <div className="w-2/6 flex items-center justify-center bg-white p-8">
        {children}
      </div>
    </div>
  );
};

export default Loginpagelayout;
