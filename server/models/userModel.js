import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true, 
        unique: true
    },
    email: {    
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        required: true
    },
    firstname: {
        type: String, 
    },
    lastname: {
        type: String,  
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