import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Local Authentication - Sign Up
const signUp = async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      firstname: firstname || '',
      lastname: lastname || '',
      creditBalance: 10
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = {
      _id: newUser._id,
      email: newUser.email,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      photo: newUser.photo,
      creditBalance: newUser.creditBalance,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userResponse,
      token
    });

  } catch (error) {
    console.error("Error in signUp:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create user",
      error: error.message 
    });
  }
};

// Local Authentication - Sign In
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Check if user has password (local user)
    if (!user.password) {
      return res.status(401).json({ 
        success: false, 
        message: "This account was created with Google. Please use Google Sign In." 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      photo: user.photo,
      creditBalance: user.creditBalance,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: "Sign in successful",
      user: userResponse,
      token
    });

  } catch (error) {
    console.error("Error in signIn:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to sign in",
      error: error.message 
    });
  }
};

// Google OAuth Authentication
const googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ 
        success: false, 
        message: "Google ID token is required" 
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await userModel.findOne({ 
      $or: [{ email }, { googleId }] 
    });

    if (user) {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.photo = picture;
        if (!user.firstname && !user.lastname) {
          const nameParts = name.split(' ');
          user.firstname = nameParts[0] || '';
          user.lastname = nameParts.slice(1).join(' ') || '';
        }
        await user.save();
      }
    } else {
      // Create new user
      const nameParts = name.split(' ');
      user = await userModel.create({
        email,
        googleId,
        photo: picture,
        firstname: nameParts[0] || '',
        lastname: nameParts.slice(1).join(' ') || '',
        creditBalance: 10
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      photo: user.photo,
      creditBalance: user.creditBalance,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: "Google sign in successful",
      user: userResponse,
      token
    });

  } catch (error) {
    console.error("Error in googleSignIn:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to authenticate with Google",
      error: error.message 
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("🔍 Looking for user with userId:", userId);
    
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
      console.log("❌ User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }
    
    console.log("✅ User found:", user);
    return res.status(200).json({ user });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Get user credits
const userCredits = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
    
    const userData = await userModel.findById(userId).select('creditBalance');
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, credits: userData.creditBalance });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to get profile",
      error: error.message 
    });
  }
};

export { 
  signUp, 
  signIn, 
  googleSignIn, 
  getUserById, 
  userCredits, 
  getProfile 
};