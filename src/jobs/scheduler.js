const cron = require("node-cron");
const prisma = require("../prisma");
const { fetchCreatorPosts } = require("../services/fetchPosts");

function startScheduler() {
  // hourly snapshots
  cron.schedule("*/30 * * * *", async () => {
    try {
      const creators = await prisma.creator.findMany();
      for (const c of creators) {
        await fetchCreatorPosts(c);
      }
      console.log("Scheduled fetch completed:", new Date().toISOString());
    } catch (err) {
      console.error("Scheduler error:", err);
    }
  });
}

module.exports = { startScheduler };
