const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const { fetchYouTubeVideos } = require("../services/youtube");
const { fetchInstagramPosts } = require("../services/instagram");

router.post("/fetch", async (req, res) => {
  const creators = await prisma.creator.findMany();

  for (const c of creators) {
    let posts = [];

    if (c.platform === "youtube") {
      posts = await fetchYouTubeVideos(c.youtubeChannelId);
    } else if (c.platform === "instagram") {
      posts = await fetchInstagramPosts(c.instagramId);
    }

    for (const p of posts) {
      const post = await prisma.post.upsert({
        where: { postUrl: p.postUrl },
        update: {},
        create: {
          creatorId: c.id,
          platform: c.platform,
          postUrl: p.postUrl,
          title: p.title,
          publishedAt: new Date(p.publishedAt)
        }
      });

      await prisma.postMetric.create({
        data: {
          postId: post.id,
          views: p.views
        }
      });
    }
  }

  res.json({ message: "Fetched & stored" });
});

module.exports = router;
