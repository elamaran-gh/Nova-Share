import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import fileRoutes from "./routes/file.routes.js";
import userRoutes from "./routes/user.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import path from "path";
import express from "express";
import { File } from "./models/file.models.js";

const __dirname = path.resolve();
dotenv.config();

const PORT = process.env.PORT || 5600;

const startServer = async () => {
  try {
    await connectDB();

    app.use("/api/files", fileRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/ai", aiRoutes);

    app.use(express.static(path.join(__dirname, "/client")));

    app.get("/f/:shortCode", async (req, res) => {
      const { shortCode } = req.params;
      if (!shortCode) return res.status(400).send("Short code is required");
      try {
        const file = await File.findOne({ shortUrl: `${process.env.BASE_URL}/f/${shortCode}` });
        if (!file) return res.status(404).send("File not found");
        res.json(file);
      } catch (error) {
        console.error("Error fetching file:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`? Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("? Error starting server:", error);
  }
};

startServer();
