const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const { createShortLink } = require("../utils/shortener");

// create link (auth could be added)
router.post("/", async (req, res) => {
  const { creatorId, originalUrl } = req.body;
  const rec = await createShortLink(creatorId, originalUrl);
  res.json({ short: `${process.env.BASE_SHORT_URL}/${rec.shortCode}`, rec });
});

// get links for creator
router.get("/:creatorId", async (req, res) => {
  const links = await prisma.link.findMany({ where: { creatorId: req.params.creatorId }});
  res.json(links);
});

// redirect handler (public) - add this route in src/index.js if you want
router.get("/r/:code", async (req, res) => {
  const code = req.params.code;
  const link = await prisma.link.findUnique({ where: { shortCode: code }});
  if (!link) return res.status(404).send("Not found");
  await prisma.link.update({ where: { id: link.id }, data: { clickCount: link.clickCount + 1 }});
  await prisma.linkClick.create({ data: { linkId: link.id, userAgent: req.headers["user-agent"] || null, ip: req.ip }});
  res.redirect(302, link.originalUrl);
});

module.exports = router;
