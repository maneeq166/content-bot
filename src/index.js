const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const creatorRoutes = require("./routes/creators");
const postsRoutes = require("./routes/posts");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/creators", creatorRoutes);
app.use("/posts", postsRoutes);

app.get("/", (req, res) => {
  res.send("Creator Tracking API running (JS version)");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
