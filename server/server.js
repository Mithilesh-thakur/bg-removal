import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js"; // ✅ must include .js extension in ESM
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

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

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    mongodb: "Connected" // You can add actual connection status check here
  });
});

app.use('/api/user',userRouter);
app.use('/api/image',imageRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
