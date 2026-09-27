"use client";

import { useEffect, useState } from "react";

const playfulRoles = [
  "Vibe Coder",
  "Bug Negotiator",
  "Professional Tab Opener",
  "Pixel Wrangler",
  "Chief Button Officer",
  "Console Log Archaeologist",
  "Full-Stack Overflow Developer",
  "Works on My Machine Engineer",
] as const;

interface XmbHeaderProps {
  name?: string;
}

export function XmbHeader({ name = "AFFAN KHAN" }: XmbHeaderProps) {
  const [timeStr, setTimeStr] = useState<string>("");
  const [role, setRole] = useState<string>(playfulRoles[0]);

  useEffect(() => {
    const roleTimeout = window.setTimeout(() => {
      setRole(playfulRoles[Math.floor(Math.random() * playfulRoles.length)]);
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
      <div className="flex flex-col items-start rounded-xl border border-white/10 bg-white/5 px-5 py-3 shadow-2xl backdrop-blur-md">
        <span className="text-xl font-bold uppercase tracking-[0.2em] text-white drop-shadow-md">{name}</span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{role}</span>
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
