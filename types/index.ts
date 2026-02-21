export type PlatformName =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "twitter"
  | "linkedin";

export interface PlatformData {
  id?: string;
  name: PlatformName;
  url: string;
}

export interface Post {
  id: string;
  workspaceId: string;
  date: string; // ISO string
  description: string;
  platforms: PlatformData[];
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  clientName: string;
  shareToken: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface MonthStats {
  totalPosts: number;
  videos: number;
  instagramPosts: number;
  tiktokPosts: number;
  platformsActive: number;
  daysPlanned: number;
}
