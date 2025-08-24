import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {    
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false // Not required for Google OAuth users
    },
    photo: {
        type: String,
        required: false,
        default: 'https://via.placeholder.com/150'
    },
    firstname: {
        type: String, 
        required: false
    },
    lastname: {
        type: String,  
        required: false
    },
    googleId: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    creditBalance: {
        type: Number,
        default: 10 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.model.user || mongoose.model("user", userSchema);

export default userModel;