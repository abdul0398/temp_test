// components/VideoCard.tsx
import React from "react";
import { Video } from "../app/page";

type VideoCardProps = {
  video: Video;
};

function formatViews(viewCount: number): string {
  if (viewCount >= 1_000_000) {
    return (viewCount / 1_000_000).toFixed(1) + "M"; // Convert to millions
  } else if (viewCount >= 1_000) {
    return (viewCount / 1_000).toFixed(1) + "K"; // Convert to thousands
  }
  return viewCount.toString(); // Keep as-is if less than 1K
}

function convertISO8601ToTime(duration: string) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return "0:00"; // Default to 0:00 format if invalid

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  } else {
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }
}

function timeAgo(date: Date) {
  const now = new Date();
  const secondsAgo = Math.round((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const count = Math.floor(secondsAgo / seconds);
    if (count >= 1) {
      return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
        -count,
        unit as Intl.RelativeTimeFormatUnit
      );
    }
  }

  return "Just now";
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className=" rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      {/* Thumbnail Section */}
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full object-cover aspect-video rounded-[25px] cursor-pointer"
        />
        {/* Overlay for view count */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-0.5 rounded">
          {convertISO8601ToTime(video.duration || "")}
        </div>
      </div>

      {/* Video Details */}
      <div className="p-4">
        <h3 className=" text-white text-sm line-clamp-2 cursor-pointer">
          @{video.title}
        </h3>

        {/* Channel and Publish Date */}
        <div className="items-center mt-3">
          <div className="flex justify-between w-full">
            <p className="text-xs font-medium text-gray-500">
              @{video.channel_name}.
              {formatViews(video.channel_subscribers || 0)}
            </p>
          </div>
          <div className="flex justify-between w-full">
            <p className="text-xs font-medium text-gray-500">
              {formatViews(parseInt(video.view_count))}
            </p>
            <p className="text-xs text-gray-500">
              {timeAgo(new Date(video.published_at))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
