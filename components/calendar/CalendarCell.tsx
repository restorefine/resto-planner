"use client";

import { Post, PlatformName } from "@/types";
import { isToday, isSameMonth } from "date-fns";
import { FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const PLATFORM_ICONS: Record<PlatformName, { icon: React.ReactNode; color: string }> = {
  instagram: { icon: <FaInstagram />, color: "#E1306C" },
  tiktok: { icon: <FaTiktok />, color: "#E1306C" },
  youtube: { icon: <FaYoutube />, color: "#FF0000" },
  facebook: { icon: <FaFacebook />, color: "#1877F2" },
  twitter: { icon: <FaTwitter />, color: "#1DA1F2" },
  linkedin: { icon: <FaLinkedin />, color: "#0A66C2" },
};

interface Props {
  date: Date;
  currentMonth: Date;
  post?: Post;
  onClick?: () => void;
  readonly?: boolean;
  dark?: boolean;
  noBorderBottom?: boolean;
  noBorderRight?: boolean;
}

export default function CalendarCell({ date, currentMonth, post, onClick, readonly = false, dark = false, noBorderBottom = false, noBorderRight = false }: Props) {
  const today = isToday(date);
  const inMonth = isSameMonth(date, currentMonth);
  const hasPost = !!post;

  const borderColor = dark ? "border-[#1f1f1f]" : "border-gray-100";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className={[
        "relative flex flex-col min-h-[88px] sm:min-h-[108px] p-2 transition-all duration-150",
        !noBorderBottom && `border-b ${borderColor}`,
        !noBorderRight && `border-r ${borderColor}`,
        onClick && "cursor-pointer",
        // Dark theme backgrounds
        dark
          ? inMonth
            ? today
              ? "bg-[#1a0a0a] hover:bg-[#200d0d]"
              : hasPost
                ? "bg-[#170d0d] hover:bg-[#1e0f0f]"
                : "bg-[#111111] hover:bg-[#181818]"
            : "bg-[#0d0d0d]"
          : // Light theme backgrounds
            inMonth
            ? today
              ? "bg-red-50/50 hover:bg-red-50/70"
              : hasPost
                ? "bg-red-50/30 hover:bg-red-50/50"
                : "bg-white hover:bg-gray-50/50"
            : "bg-gray-50/40",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Top accent — red for today (solid) or any post (subtle) */}
      {today && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#E01E1E]" />}
      {!today && hasPost && inMonth && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#E01E1E]/50" />}

      {/* Date number */}
      <div className="flex items-start justify-end mb-1.5">
        <span className={["flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold", today ? "bg-[#E01E1E] text-white shadow-sm" : dark ? (inMonth ? "text-gray-200" : "text-gray-700") : inMonth ? "text-[#111111]" : "text-gray-300"].join(" ")}>{date.getDate()}</span>
      </div>

      {/* Post content */}
      {post && (
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {post.platforms.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.platforms.map((p) => {
                const info = PLATFORM_ICONS[p.name as PlatformName];
                if (!info) return null;
                return (
                  <span key={p.id ?? p.name} className={`inline-flex items-center justify-center h-5 w-5 rounded-md text-[10px] shadow-sm flex-shrink-0 ${dark ? "bg-[#2a2a2a]" : "text-white"}`} style={dark ? { color: info.color } : { backgroundColor: info.color, color: "#fff" }}>
                    {info.icon}
                  </span>
                );
              })}
            </div>
          )}

          {post.description && <p className={`text-[10px] leading-snug line-clamp-2 break-words ${dark ? "text-gray-500" : "text-[#6B7280]"}`}>{post.description}</p>}
        </div>
      )}
    </div>
  );
}
