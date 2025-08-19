import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js"; // ✅ must include .js extension in ESM

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
