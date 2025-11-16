const prisma = require("../prisma");
const { fetchInstagramMedia, fetchInstagramInsights } = require("./instagram");
const { fetchYouTubeVideos } = require("./youtube");

/**
 * Fetch posts/videos for a single creator object and save snapshots.
 * creator object fields: { id, platform, instagramId, youtubeChannelId, ... }
 */
async function fetchCreatorPosts(creator) {
  if (creator.platform === "instagram") {
    // use global token by default; if you store per-creator token in DB use that
    const token = process.env.IG_ACCESS_TOKEN;
    if (!creator.instagramId) return;
    const media = await fetchInstagramMedia(creator.instagramId, token);
    for (const m of media) {
      // upsert post (use postUrl unique in schema; here use permalink)
      const postUrl = m.permalink || `https://instagram.com/p/${m.id}`;
      const post = await prisma.post.upsert({
        where: { postUrl },
        update: {},
        create: {
          id: m.id, // use IG post id as primary id (string)
          creatorId: creator.id,
          platform: "instagram",
          postUrl,
          title: m.caption || null,
          publishedAt: new Date(m.timestamp)
        }
      });
      // fetch insights
      const insights = await fetchInstagramInsights(m.id, token);
      const views = insights.video_views || insights.impressions || 0;
      await prisma.postMetric.create({
        data: { postId: post.id, views: Math.floor(views) }
      });
    }
  } else if (creator.platform === "youtube") {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!creator.youtubeChannelId) return;
    const vids = await fetchYouTubeVideos(creator.youtubeChannelId, apiKey);
    for (const v of vids) {
      const post = await prisma.post.upsert({
        where: { postUrl: v.postUrl },
        update: {},
        create: {
          id: v.videoId, // use video id as primary id
          creatorId: creator.id,
          platform: "youtube",
          postUrl: v.postUrl,
          title: v.title || null,
          publishedAt: new Date(v.publishedAt)
        }
      });
      await prisma.postMetric.create({
        data: { postId: post.id, views: Math.floor(v.views) }
      });
    }
  }
}

module.exports = { fetchCreatorPosts };
