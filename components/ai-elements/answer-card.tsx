"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AnswerCardProps = {
  children: ReactNode;
  isStreaming?: boolean;
  className?: string;
};

const StreamingIndicator = ({ isStreaming }: { isStreaming?: boolean }) => {
  if (!isStreaming) {
    return (
      <span className="text-[11px] font-medium tracking-[0.2em] text-[#7A141C]/70">
        Responded
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C7222A]">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C7222A]/40" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#C7222A]" />
      </span>
      Writing live
    </span>
  );
};

export function AnswerCard({
  children,
  isStreaming,
  className,
}: AnswerCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-[#f8bdba]/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(199,34,42,0.12)] backdrop-blur-2xl",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_55%),linear-gradient(145deg,#fff5f4,#ffe1df)] opacity-90"
      />
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#7A141C]/80">
            AirIndiaGuide.AI
          </div>
          <StreamingIndicator isStreaming={isStreaming} />
        </div>
        <div className="rounded-3xl bg-white/50 p-4 text-base leading-relaxed text-[#3D0C12] shadow-inner">
          {children}
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.5em] text-[#7A141C]/60">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#f2a6a1] to-[#7A141C]/50" />
          curated insight
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#f2a6a1] to-[#7A141C]/50" />
        </div>
      </div>
    </div>
  );
}

