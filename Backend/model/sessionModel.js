import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Session = mongoose.model("Session", sessionSchema);

export default Session;