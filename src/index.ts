import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prisma";
import authRoutes from "./routes/auth";
import creatorRoutes from "./routes/creators";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/creators", creatorRoutes);

app.get("/", (req, res) => res.send("Creator Tracking API is running"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
