import "dotenv/config";
import express from "express";

export const startServer = async () => {
  try {
    const app = express();

    app.use(express.json());

    app.get("/api", (req, res) => {
      res.send("API is working 🚀");
    });

    const port = process.env.PORT || 4000;

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};