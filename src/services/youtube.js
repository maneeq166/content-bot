const fetch = require("node-fetch");

/**
 * Fetch latest videos for a channel. Returns array of { videoId, title, publishedAt }
 */
async function fetchYouTubeVideos(channelId, apiKey) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`;
  const r = await fetch(searchUrl);
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  const ids = (j.items || []).map(i => i.id.videoId).filter(Boolean);
  if (ids.length === 0) return [];

  const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids.join(",")}&key=${apiKey}`;
  const s = await fetch(statsUrl);
  const sj = await s.json();
  if (sj.error) throw new Error(JSON.stringify(sj.error));

  return (sj.items || []).map(v => ({
    videoId: v.id,
    postUrl: `https://youtu.be/${v.id}`,
    title: v.snippet.title,
    publishedAt: v.snippet.publishedAt,
    views: Number(v.statistics?.viewCount || 0)
  }));
}

module.exports = { fetchYouTubeVideos };
