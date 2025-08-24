import express from "express";
import { 
  signUp, 
  signIn, 
  googleSignIn, 
  getUserById, 
  userCredits, 
  getProfile 
} from "../controllers/UserController.js";
import authUser from "../middlewares/auth.js";

const userRouter = express.Router();

// Authentication routes
userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
userRouter.post("/google-signin", googleSignIn);

// Protected routes
userRouter.get("/profile", authUser, getProfile);
userRouter.get("/credits", authUser, userCredits);

// Get user by ID (public route)
userRouter.get("/:userId", getUserById);

export default userRouter;