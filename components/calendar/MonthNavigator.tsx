"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface Props {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  dark?: boolean;
}

export default function MonthNavigator({ currentDate, onPrev, onNext, dark = false }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrev}
        aria-label="Previous month"
        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
          dark
            ? "border-[#2a2a2a] bg-[#111111] text-gray-400 hover:bg-[#1f1f1f] hover:text-white"
            : "border-gray-200 bg-white text-[#6B7280] hover:bg-gray-50 hover:text-[#111111]"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <h2
        className={`min-w-[160px] text-center text-lg font-bold ${
          dark ? "text-white" : "text-[#111111]"
        }`}
      >
        {format(currentDate, "MMMM yyyy")}
      </h2>

      <button
        onClick={onNext}
        aria-label="Next month"
        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
          dark
            ? "border-[#2a2a2a] bg-[#111111] text-gray-400 hover:bg-[#1f1f1f] hover:text-white"
            : "border-gray-200 bg-white text-[#6B7280] hover:bg-gray-50 hover:text-[#111111]"
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
