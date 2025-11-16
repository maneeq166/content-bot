const { nanoid } = require("nanoid");
const prisma = require("../prisma");

async function createShortLink(creatorId, originalUrl) {
  const code = nanoid(8);
  const rec = await prisma.links.create({
    data: { creatorId, originalUrl, shortCode: code }
  });
  return rec;
}

module.exports = { createShortLink };
