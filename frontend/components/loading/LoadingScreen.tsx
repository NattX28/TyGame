"use client";

import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#151515] z-50">
      <div className="relative flex flex-col items-center gap-8">
        {/* Main loading animation */}
        <div className="relative w-24 h-24">
          {/* Outer ring with dot */}
          <div className="absolute w-full h-full animate-spin">
            <div className="w-4 h-4 bg-third rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Inner ring with dots */}
          <div className="absolute w-full h-full animate-[spin_3s_linear_infinite]">
            <div className="absolute w-2 h-2 bg-third rounded-full top-0 left-1/2 -translate-x-1/2 opacity-70" />
            <div className="absolute w-2 h-2 bg-third rounded-full top-1/2 right-0 translate-y-1/2 opacity-70" />
            <div className="absolute w-2 h-2 bg-third rounded-full bottom-0 left-1/2 -translate-x-1/2 opacity-70" />
            <div className="absolute w-2 h-2 bg-third rounded-full top-1/2 left-0 -translate-y-1/2 opacity-70" />
          </div>

          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 bg-second rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-third rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-second rounded-full overflow-hidden">
          <div className="h-full bg-third rounded-full animate-[pulse_2s_ease-in-out_infinite] origin-left" />
        </div>

        {/* Loading text */}
        <div className="text-[#ce1212] font-light tracking-widest uppercase text-sm flex items-center">
          Loading
          <span className="flex ml-2 space-x-2">
            <span className="animate-bounce text-4xl leading-none">.</span>
            <span className="animate-bounce delay-150 text-4xl leading-none">
              .
            </span>
            <span className="animate-bounce delay-300 text-4xl leading-none">
              .
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
