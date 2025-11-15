const fetch = require("node-fetch");

async function fetchInstagramPosts(igUserId) {
  const url =
    `https://graph.facebook.com/v17.0/${igUserId}/media?fields=id,caption,media_type,permalink,timestamp&access_token=${process.env.IG_ACCESS_TOKEN}`;

  const mediaRes = await fetch(url);
  const media = await mediaRes.json();

  const results = [];

  for (const item of media.data) {
    let views = 0;

    if (item.media_type === "VIDEO") {
      const iv =
        `https://graph.facebook.com/v17.0/${item.id}/insights?metric=video_views&access_token=${process.env.IG_ACCESS_TOKEN}`;
      const insights = await (await fetch(iv)).json();
      views = insights.data?.[0]?.values?.[0]?.value || 0;
    }

    results.push({
      postUrl: item.permalink,
      title: item.caption || "",
      publishedAt: item.timestamp,
      views
    });
  }

  return results;
}

module.exports = { fetchInstagramPosts };
