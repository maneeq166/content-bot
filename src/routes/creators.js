const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid" });
  }
}

// create creator
router.post("/", auth, async (req, res) => {
  const { name, platform, handle, youtubeChannelId, instagramId } = req.body;
  const creator = await prisma.creator.create({
    data: { name, platform, handle, youtubeChannelId, instagramId }
  });
  res.json(creator);
});

// list creators
router.get("/", auth, async (req, res) => {
  const creators = await prisma.creator.findMany({ orderBy: { createdAt: "desc" } });
  res.json(creators);
});

module.exports = router;
