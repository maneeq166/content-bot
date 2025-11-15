const fetch = require("node-fetch");

async function fetchYouTubeVideos(channelId) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet,id&channelId=${channelId}&key=${process.env.YOUTUBE_API_KEY}&maxResults=10&type=video`;

  const searchRes = await fetch(url);
  const searchData = await searchRes.json();

  const ids = searchData.items.map(v => v.id.videoId).join(",");

  const statsUrl =
    `https://www.googleapis.com/youtube/v3/videos?` +
    `part=snippet,statistics&id=${ids}&key=${process.env.YOUTUBE_API_KEY}`;

  const statsRes = await fetch(statsUrl);
  const statsData = await statsRes.json();

  return statsData.items.map(v => ({
    postUrl: `https://youtu.be/${v.id}`,
    title: v.snippet.title,
    publishedAt: v.snippet.publishedAt,
    views: Number(v.statistics.viewCount)
  }));
}

module.exports = { fetchYouTubeVideos };
