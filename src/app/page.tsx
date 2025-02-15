// app/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VideoCard from "../components/VideoCard";
import SearchBar from "../components/SearchBar";
import { supabase } from "@/lib/supabase";

export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  published_at: string;
  view_count: string;
  median?: string | null;
  multiplier?: string | null;
  channel_name?: string;
  duration?: string;
  channel_subscribers?: number;
};

const fetchVideos = async (): Promise<Video[]> => {
  const { data, error } = await supabase.from("videos").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data as Video[];
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: videos,
    error,
    isLoading,
  } = useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: fetchVideos,
  });

  if (isLoading)
    return <div className="container mx-auto px-4 py-8">Loading videos...</div>;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        Error: {(error as Error).message}
      </div>
    );

  const filteredVideos =
    searchTerm.trim().length > 0
      ? (videos ?? []).filter((v) =>
          v.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
        )
      : videos ?? [];

  return (
    <main className="container mx-auto px-4 py-8">
      <SearchBar onSearch={setSearchTerm} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {filteredVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </main>
  );
}
