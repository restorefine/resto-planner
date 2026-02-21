"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { X, ExternalLink } from "lucide-react";
import { Post, PlatformName } from "@/types";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

const PLATFORM_INFO: Record<
  PlatformName,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  instagram: {
    label: "Instagram",
    icon: <FaInstagram />,
    color: "#E1306C",
    bg: "#fce7f3",
  },
  tiktok: {
    label: "TikTok",
    icon: <FaTiktok />,
    color: "#010101",
    bg: "#f3f4f6",
  },
  youtube: {
    label: "YouTube",
    icon: <FaYoutube />,
    color: "#FF0000",
    bg: "#fee2e2",
  },
  facebook: {
    label: "Facebook",
    icon: <FaFacebook />,
    color: "#1877F2",
    bg: "#dbeafe",
  },
  twitter: {
    label: "Twitter/X",
    icon: <FaTwitter />,
    color: "#1DA1F2",
    bg: "#e0f2fe",
  },
  linkedin: {
    label: "LinkedIn",
    icon: <FaLinkedin />,
    color: "#0A66C2",
    bg: "#dbeafe",
  },
};

interface Props {
  date: Date | null;
  post?: Post;
  onClose: () => void;
}

function ensureAbsoluteUrl(url: string) {
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function PostViewDialog({ date, post, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!date) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-white shadow-xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#E01E1E]">
              Content Plan
            </p>
            <h2 className="font-bold text-[#111111]">
              {format(date, "EEEE, d MMMM yyyy")}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          {!post ? (
            <p className="text-center text-[#6B7280] py-6">
              No content planned for this day.
            </p>
          ) : (
            <>
              {/* Description */}
              {post.description && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Description
                  </p>
                  <p className="text-sm leading-relaxed text-[#111111] bg-gray-50 rounded-xl px-4 py-3">
                    {post.description}
                  </p>
                </div>
              )}

              {/* Platform links */}
              {post.platforms.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    View on Platforms
                  </p>
                  <div className="flex flex-col gap-2">
                    {post.platforms.map((p) => {
                      const info = PLATFORM_INFO[p.name as PlatformName];
                      if (!info) return null;
                      return (
                        <a
                          key={p.id ?? p.name}
                          href={ensureAbsoluteUrl(p.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 hover:shadow-sm transition-all group"
                          style={{ backgroundColor: info.bg }}
                        >
                          <span
                            className="text-lg flex-shrink-0"
                            style={{ color: info.color }}
                          >
                            {info.icon}
                          </span>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: info.color }}
                          >
                            {info.label}
                          </span>
                          {p.url && (
                            <span className="ml-auto flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                              View post
                              <ExternalLink className="h-3 w-3" />
                            </span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
