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

router.post("/", auth, async (req, res) => {
  const creator = await prisma.creator.create({
    data: req.body
  });
  res.json(creator);
});

router.get("/", auth, async (req, res) => {
  const creators = await prisma.creator.findMany({
    orderBy: { createdAt: "desc" }
  });
  res.json(creators);
});

module.exports = router;
