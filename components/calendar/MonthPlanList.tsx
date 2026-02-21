"use client";

import { Post, PlatformName } from "@/types";
import { format, isToday } from "date-fns";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { ExternalLink, CalendarDays } from "lucide-react";

function ensureAbsoluteUrl(url: string) {
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

const PLATFORM_INFO: Record<
  PlatformName,
  { label: string; icon: React.ReactNode; color: string }
> = {
  instagram: { label: "Instagram", icon: <FaInstagram />, color: "#E1306C" },
  tiktok:    { label: "TikTok",    icon: <FaTiktok />,    color: "#aaaaaa" },
  youtube:   { label: "YouTube",   icon: <FaYoutube />,   color: "#FF0000" },
  facebook:  { label: "Facebook",  icon: <FaFacebook />,  color: "#1877F2" },
  twitter:   { label: "Twitter/X", icon: <FaTwitter />,   color: "#1DA1F2" },
  linkedin:  { label: "LinkedIn",  icon: <FaLinkedin />,  color: "#0A66C2" },
};

interface Props {
  posts: Post[];
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  dark?: boolean;
  readonly?: boolean;
}

export default function MonthPlanList({
  posts,
  currentDate,
  onSelectDate,
  dark = false,
  readonly = false,
}: Props) {
  const sorted = [...posts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div
      className={`mt-4 rounded-2xl overflow-hidden border ${
        dark
          ? "bg-[#111111] border-[#2a2a2a]"
          : "bg-white border-gray-100 shadow-sm"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-5 py-4 border-b ${
          dark ? "border-[#1f1f1f]" : "border-gray-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#E01E1E]" />
          <h3
            className={`text-sm font-semibold ${
              dark ? "text-white" : "text-[#111111]"
            }`}
          >
            Content Plan — {format(currentDate, "MMMM yyyy")}
          </h3>
        </div>
        <span className="rounded-full bg-[#E01E1E]/10 px-2.5 py-0.5 text-xs font-semibold text-[#E01E1E]">
          {sorted.length} post{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarDays
            className={`h-8 w-8 mb-2 ${dark ? "text-gray-800" : "text-gray-200"}`}
          />
          <p className={`text-sm ${dark ? "text-gray-500" : "text-[#6B7280]"}`}>
            No posts planned this month
          </p>
          {!readonly && (
            <p className={`text-xs mt-1 ${dark ? "text-gray-700" : "text-gray-400"}`}>
              Click any date on the calendar to add content
            </p>
          )}
        </div>
      ) : (
        <div className={`divide-y ${dark ? "divide-[#1a1a1a]" : "divide-gray-50"}`}>
          {sorted.map((post) => {
            const postDate = new Date(post.date);
            const isPostToday = isToday(postDate);

            return (
              <div
                key={post.id}
                onClick={() => onSelectDate(postDate)}
                className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors group ${
                  dark ? "hover:bg-[#181818]" : "hover:bg-gray-50/70"
                }`}
              >
                {/* Date badge */}
                <div
                  className={`flex-shrink-0 w-14 flex flex-col items-center justify-center rounded-xl py-2 text-center ${
                    isPostToday
                      ? "bg-[#E01E1E] text-white"
                      : dark
                      ? "bg-[#1a1a1a] text-white border border-[#2a2a2a]"
                      : "bg-gray-100 text-[#111111]"
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wide opacity-60">
                    {format(postDate, "EEE")}
                  </span>
                  <span className="text-lg font-bold leading-tight">
                    {format(postDate, "d")}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {post.description && (
                    <p
                      className={`text-sm line-clamp-2 leading-snug mb-2 ${
                        dark ? "text-gray-200" : "text-[#111111]"
                      }`}
                    >
                      {post.description}
                    </p>
                  )}

                  {post.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.platforms.map((p) => {
                        const info = PLATFORM_INFO[p.name as PlatformName];
                        if (!info) return null;
                        const chipClass = dark
                          ? "bg-[#1f1f1f] border border-[#2a2a2a] hover:border-gray-600"
                          : "bg-gray-100 border border-gray-200 hover:border-gray-300";
                        return p.url ? (
                          <a
                            key={p.id ?? p.name}
                            href={ensureAbsoluteUrl(p.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${chipClass}`}
                            style={{ color: info.color }}
                          >
                            <span className="text-[10px]">{info.icon}</span>
                            {info.label}
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </a>
                        ) : (
                          <span
                            key={p.id ?? p.name}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${chipClass}`}
                            style={{ color: info.color }}
                          >
                            <span className="text-[10px]">{info.icon}</span>
                            {info.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Action hint */}
                <span
                  className={`flex-shrink-0 text-xs transition-colors pt-1 font-medium group-hover:text-[#E01E1E] ${
                    dark ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {readonly ? "View →" : "Edit →"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
