"use client";

import { useEffect, useState } from "react";

const roles = [
  "Vibe Coder",
  "Software Engineer",
  "AI Consultant",
] as const;

interface XmbHeaderProps {
  name?: string;
}

export function XmbHeader({ name = "AFFAN KHAN" }: XmbHeaderProps) {
  const [timeStr, setTimeStr] = useState<string>("");
  const [role, setRole] = useState<string>(roles[0]);

  useEffect(() => {
    const roleTimeout = window.setTimeout(() => {
      setRole(roles[Math.floor(Math.random() * roles.length)]);
    }, 0);

    const updateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
      const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
      setTimeStr(`${date}  ${time}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => {
      window.clearTimeout(roleTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="absolute left-8 right-8 top-6 z-30 flex select-none items-start justify-between">
      <div className="flex flex-col items-start">
        <span className="text-2xl font-black uppercase tracking-[0.22em] text-white drop-shadow-md">{name}</span>
        <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">{role}</span>
      </div>

      {timeStr && (
        <div className="flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 font-mono text-xs tracking-widest text-white/45 backdrop-blur-md">
          <span>{timeStr}</span>
          <div className="flex h-2 w-4 items-center rounded-sm border border-white/40 p-[1px]">
            <div className="h-full w-3/4 rounded-xs bg-white/70" />
          </div>
        </div>
      )}
    </header>
  );
}
