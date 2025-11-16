const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const { fetchCreatorPosts } = require("../services/fetchPosts");

// Trigger full fetch for all creators (protected in production)
router.post("/fetch", async (req, res) => {
  try {
    const creators = await prisma.creator.findMany();
    for (const c of creators) {
      await fetchCreatorPosts(c);
    }
    res.json({ ok: true, message: "Fetched for all creators" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

module.exports = router;
