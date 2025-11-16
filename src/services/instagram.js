const fetch = require("node-fetch");

/**
 * Fetch media list for an IG user (instagram business user id).
 * Returns array of { id, media_type, timestamp, caption, permalink }
 */
async function fetchInstagramMedia(igUserId, accessToken) {
  const url = `https://graph.facebook.com/v17.0/${igUserId}/media?fields=id,media_type,timestamp,caption,permalink&access_token=${accessToken}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.data || [];
}

/**
 * Fetch insights for a single post ID.
 * Returns an object { impressions, reach, engagement, video_views }
 */
async function fetchInstagramInsights(postId, accessToken) {
  const metrics = "impressions,reach,engagement,video_views";
  const url = `https://graph.facebook.com/v17.0/${postId}/insights?metric=${metrics}&access_token=${accessToken}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) throw new Error(JSON.stringify(json.error));

  // Convert array to map
  const map = {};
  if (Array.isArray(json.data)) {
    for (const m of json.data) {
      map[m.name] = (m.values && m.values[0] && m.values[0].value) || 0;
    }
  }
  return map;
}

module.exports = { fetchInstagramMedia, fetchInstagramInsights };
