const Signinpagelayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen">
      {/* Left side with Background Image */}
      <div className="w-7/12 relative flex justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/media/images/Gaming_Background.png')" }}
        />
        <div className="absolute top-0 inset-1 w-full h-full bg-white opacity-50"></div>
        <div className="absolute top-0 inset-0 w-full h-full bg-black opacity-80"></div>

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome to Tygame</h1>
          <p className="text-2xl text-center">- Share your experience about gaming -</p>
        </div>
      </div>

      {/* Right side */}
      <div className="w-5/12 flex items-center justify-center bg-white p-8">
        {children}
      </div>
    </div>
  );
};

export default Signinpagelayout;
