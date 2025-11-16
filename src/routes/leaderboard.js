const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

/**
 * Leaderboard by 48-hour growth and total views.
 */
router.get("/", async (req, res) => {
  try {
    const creators = await prisma.creator.findMany({
      include: {
        posts: {
          include: { metrics: true }
        }
      }
    });

    const now = Date.now();
    const cutoff = now - 48 * 60 * 60 * 1000;

    const out = creators.map(c => {
      let total = 0;
      let delta48 = 0;

      for (const p of c.posts) {
        // latest snapshot (max capturedAt)
        const snapshots = p.metrics.sort((a,b) => new Date(a.capturedAt) - new Date(b.capturedAt));
        if (snapshots.length === 0) continue;
        const latest = snapshots[snapshots.length - 1].views;
        total += latest;

        // find earliest snapshot within last 48h
        const within = snapshots.filter(s => new Date(s.capturedAt).getTime() >= cutoff);
        if (within.length > 0) {
          const baseline = within[0].views;
          delta48 += Math.max(0, latest - baseline);
        } else {
          // if no snapshot within 48h, try to find the most recent snapshot before cutoff
          const beforeCut = snapshots.filter(s => new Date(s.capturedAt).getTime() < cutoff);
          if (beforeCut.length > 0) {
            const base = beforeCut[beforeCut.length - 1].views;
            delta48 += Math.max(0, latest - base);
          } else {
            // no baseline; skip
          }
        }
      }

      return {
        creatorId: c.id,
        name: c.name,
        platform: c.platform,
        views_48h: delta48,
        views_total: total
      };
    });

    // two leaderboards
    const by48 = [...out].sort((a,b) => b.views_48h - a.views_48h);
    const byTotal = [...out].sort((a,b) => b.views_total - a.views_total);

    res.json({ by48: by48.slice(0,50), byTotal: byTotal.slice(0,50) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

module.exports = router;
