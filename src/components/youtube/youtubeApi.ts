import { YoutubeResponse } from "../../commons/commonsData";

const API_KEY = "AIzaSyAixYk4aBWtUwcUS_hyPAPzeXiNmn2M5zk";

export const youtubeApi = async (keyword: string): Promise<YoutubeResponse> => {
  const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=28&q=${keyword}&type=video&key=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Youtube API error');
  }
  return response.json();
}