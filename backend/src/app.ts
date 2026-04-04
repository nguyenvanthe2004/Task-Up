import "dotenv/config";
import express from "express";
import { connectMySQL } from "./config/db";

export const startServer = async () => {
  try {
    const app = express();

    app.use(express.json());

    await connectMySQL();

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
