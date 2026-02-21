import { Post } from "@/types";

interface Props {
  posts: Post[];
  dark?: boolean;
}

export default function MonthStats({ posts, dark = false }: Props) {
  const totalPosts = posts.length;

  const videos = posts.filter((p) => p.platforms.some((pl) => pl.name === "youtube" || pl.name === "tiktok")).length;

  const instagramPosts = posts.filter((p) => p.platforms.some((pl) => pl.name === "instagram")).length;

  const tiktokPosts = posts.filter((p) => p.platforms.some((pl) => pl.name === "tiktok")).length;

  const platformSet = new Set(posts.flatMap((p) => p.platforms.map((pl) => pl.name)));
  const platformsActive = platformSet.size;
  const daysPlanned = posts.length;

  const stats = [
    { label: "Total Posts", value: totalPosts },
    { label: "Videos", value: videos },
    { label: "Instagram", value: instagramPosts },
    { label: "TikTok", value: tiktokPosts },
    { label: "Platforms", value: platformsActive },
    { label: "Days Planned", value: daysPlanned },
  ];

  return (
    <div className={`mt-4 rounded-2xl border p-4 ${dark ? "bg-[#111111] border-[#2a2a2a]" : "bg-white border-gray-100 shadow-sm"}`}>
      <p className={`mb-3 text-[10px] font-semibold uppercase tracking-widest ${dark ? "text-gray-600" : "text-[#6B7280]"}`}>Month Overview</p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {stats.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span className={`text-2xl font-bold ${dark ? (value > 0 ? "text-white" : "text-gray-700") : "text-[#111111]"}`}>{value}</span>
            <span className={`text-center text-[10px] leading-tight ${dark ? "text-gray-600" : "text-[#6B7280]"}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
