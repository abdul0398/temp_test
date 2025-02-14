import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export const fetchYouTubeData = async (query: string) => {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}`;
  const { data } = await axios.get(url);
  return data;
};
