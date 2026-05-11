import React from "react";

interface NightlogLogoProps {
  className?: string;
}

export function NightlogLogo({ className = "" }: NightlogLogoProps) {
  return (
    <div className={`flex items-center text-[22px] font-bold tracking-tight ${className}`}>
      <span className="text-white">night</span>
      <span style={{ color: "#a78bfa" }}>log</span>
    </div>
  );
}
