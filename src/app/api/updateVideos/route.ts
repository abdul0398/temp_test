import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const videoIds = [
  "---AOnslvBo",
  "---Hnqef64k",
  "---JLbBz6Ls",
  "---KIj04zPQ",
  "---XjA38-uo",
  "---eDafFBhg",
  "---k1vFBbWw",
  "---kL8ZiM7g",
  "---n0WDScf8",
  "--01APk266U",
  "--02D71FV0g",
  "--0FinuLhug",
  "--0PHPuKyVU",
  "--0TYFEyz0c",
  "--0bCF-iK2E",
  "--0r21x1q1g",
  "--10rdVLy1U",
  "--11m37rCFQ",
  "--14w5SOEUs",
  "--1AXfq-Nl0",
  "--1GL5dLrYI",
  "--1IpIrEU1k",
  "--1PlF2VNP4",
  "--1eOrPughU",
  "--1kZDOLC9Q",
  "--1lSmtuyUg",
  "--1tPAtBOmM",
  "--1yBpF537M",
  "--28BBjBQLU",
  "--2N2QdRVs0",
  "--2SnbjKklM",
  "--2TdkJFZ2A",
  "--2VKlyOXGw",
  "--2YkuFG3b4",
  "--2eG2F7LHI",
  "--2oRD1ifBs",
  "--2pJasAQFY",
  "--2r8Pn0jT8",
  "--3-beh8d9Q",
  "--300uf_82g",
  "--35JjRdKv8",
  "--3B0KgX-Ug",
  "--3Hn6OK9EE",
];
export async function POST() {
  const youtubeApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!youtubeApiKey) {
    return NextResponse.error();
  }

  // Fetch video data from YouTube API
  const ids = videoIds.join(",");
  const youtubeResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids}&key=${youtubeApiKey}`
  );

  if (!youtubeResponse.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from YouTube" },
      { status: 500 }
    );
  }

  const data = await youtubeResponse.json();
  const videos = data.items;

  for (const video of videos) {
    const video_id = video.id;
    const snippet = video.snippet;
    const statistics = video.statistics || {};
    const contentDetails = video.contentDetails;

    const title = snippet.title;
    const description = snippet.description;
    const thumbnail = snippet.thumbnails?.high?.url;
    const published_at = snippet.publishedAt;

    const median = null;
    const multiplier = null;

    // Channel details
    const channel_id = snippet.channelId;
    const channel_name = snippet.channelTitle;

    // Video duration (ISO 8601 format)
    const duration = contentDetails.duration;

    // Fetch channel details (subscribers)
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channel_id}&key=${youtubeApiKey}`
    );

    let subscriber_count = null;
    if (channelResponse.ok) {
      const channelData = await channelResponse.json();
      subscriber_count =
        channelData.items?.[0]?.statistics?.subscriberCount || null;
    }

    // Upsert channel with subscriber count
    const { error: channelError } = await supabase
      .from("channels")
      .upsert({ id: channel_id, name: channel_name, subscriber_count });
    if (channelError) {
      console.error(`Error upserting channel ${channel_id}:`, channelError);
    }

    // Upsert video record with channel name and duration
    const { error: videoError } = await supabase.from("videos").upsert({
      id: video_id,
      title,
      description,
      thumbnail,
      published_at,
      view_count: statistics.viewCount,
      median,
      multiplier,
      channel_id,
      channel_name, // Storing channel_name in videos table
      duration, // Storing duration
      channel_subscribers: subscriber_count,
    });

    if (videoError) {
      console.error(`Error upserting video ${video_id}:`, videoError);
    }
  }

  return NextResponse.json({ success: true });
}
