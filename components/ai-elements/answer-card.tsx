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
      <span className="text-[11px] font-medium tracking-[0.2em] text-[#9D0027]/70">
        Responded
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#9D0027]">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9D0027]/40" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#9D0027]" />
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
        "relative overflow-hidden rounded-[32px] border border-gray-200 bg-white p-6 pl-7 shadow-sm",
        className,
      )}
    >

      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#9D0027]/80">
            AirIndiaGuide.AI
          </div>
          <StreamingIndicator isStreaming={isStreaming} />
        </div>
        <div className="rounded-3xl bg-gray-50 px-6 py-4 text-sm leading-relaxed text-[#2A1B1B] shadow-sm">
          {children}
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.5em] text-gray-400">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          curated insight
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-300 to-transparent" />
        </div>
      </div>
    </div>
  );
}

