require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const creatorRoutes = require("./routes/creators");
const postsRoutes = require("./routes/posts");
const leaderboardRoutes = require("./routes/leaderboard");
const linksRoutes = require("./routes/links");
const { startScheduler } = require("./jobs/scheduler");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/creators", creatorRoutes);
app.use("/posts", postsRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/links", linksRoutes);

app.get("/", (req, res) => res.send("Creator Tracking API running"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  startScheduler();
});
