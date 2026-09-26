"use client";

import { useEffect, useState } from "react";

interface XmbHeaderProps {
  name?: string;
  tagline?: string;
}

export function XmbHeader({ name = "AFFAN KHAN", tagline = "Software Engineer" }: XmbHeaderProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTimeStr(`${month}/${day}  ${time}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="absolute top-6 left-8 right-8 flex items-center justify-between z-30 select-none">
      {/* Branding Name Card in top left */}
      <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-lg shadow-2xl">
        <div className="w-8 h-8 rounded bg-white text-black font-black flex items-center justify-center text-sm tracking-tighter">
          AK
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-widest text-white uppercase">{name}</span>
          <span className="text-[10px] tracking-widest text-white/50 uppercase font-mono">{tagline}</span>
        </div>
      </div>

      {/* PSP Style System Clock / Battery Indicator in top right */}
      {timeStr && (
        <div className="flex items-center gap-3 text-xs tracking-widest font-mono text-white/40 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full">
          <span>{timeStr}</span>
          <div className="w-4 h-2 border border-white/40 rounded-sm p-[1px] flex items-center">
            <div className="h-full w-3/4 bg-white/70 rounded-xs" />
          </div>
        </div>
      )}
    </header>
  );
}
