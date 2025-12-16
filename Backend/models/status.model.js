import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    mediaUrl: {
        type: String,
        required: true,
    },
    mediaType: {
        type: String, // 'image' or 'video'
        enum: ['image', 'video'],
        default: 'image',
    },
    caption: {
        type: String,
        default: "",
    },
    musicTrack: {
        type: String,
        default: "", // Path or identifier for the music file
    },
    viewers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // MongoDB TTL: deletes after 24 hours (86400 seconds)
    }
}, { timestamps: true });

const Status = mongoose.model("Status", statusSchema);

export default Status;
