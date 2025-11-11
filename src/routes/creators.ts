import { Router } from "express";
import { prisma } from "../prisma";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Auth middleware
function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Add creator
router.post("/", auth, async (req, res) => {
  const { name, platform, handle, youtubeChannelId, instagramId } = req.body;
  const creator = await prisma.creator.create({
    data: { name, platform, handle, youtubeChannelId, instagramId },
  });
  res.json(creator);
});

// Get all creators
router.get("/", auth, async (req, res) => {
  const creators = await prisma.creator.findMany({ orderBy: { createdAt: "desc" } });
  res.json(creators);
});

export default router;
