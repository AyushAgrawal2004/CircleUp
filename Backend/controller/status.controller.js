import Status from "../models/status.model.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
} else if (process.env.CLOUDINARY_URL) {
    // Manually parse CLOUDINARY_URL if SDK fails to pick it up
    const uri = process.env.CLOUDINARY_URL;
    const split1 = uri.split('@');
    const cloud_name = split1[1];
    const split2 = split1[0].split('//')[1].split(':');
    const api_key = split2[0];
    const api_secret = split2[1];

    cloudinary.config({
        cloud_name: cloud_name,
        api_key: api_key,
        api_secret: api_secret
    });
}

export const createStatus = async (req, res) => {
    try {
        const { caption, groupId, musicTrack } = req.body;
        const userId = req.user._id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "Media file is required" });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(file.buffer);
        });

        const newStatus = new Status({
            userId,
            groupId,
            mediaUrl: result.secure_url,
            mediaType: result.resource_type === 'video' ? 'video' : 'image',
            caption: caption || "",
            musicTrack: musicTrack || "",
            viewers: [],
        });

        await newStatus.save();
        res.status(201).json(newStatus);
    } catch (error) {
        const logPath = path.join(process.cwd(), "backend_error.log");
        const logData = {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
            env_cloudinary_url_exists: !!process.env.CLOUDINARY_URL,
            body: req.body,
            file_received: !!req.file
        };
        try {
            fs.appendFileSync(logPath, JSON.stringify(logData, null, 2) + "\n---\n");
        } catch (err) {
            console.error("Failed to write to log file", err);
        }

        console.log("Error in createStatus", error);
        res.status(500).json({ error: "Internal server error", details: error.message, stack: error.stack });
    }
};

export const getGroupStatuses = async (req, res) => {
    try {
        const { groupId } = req.params;
        // Find statuses for this group, not expired (handled by TTL anyway)
        // Populate user info
        const statuses = await Status.find({ groupId })
            .populate("userId", "fullname")
            .populate("viewers", "fullname")
            .sort({ createdAt: -1 });

        res.status(200).json(statuses);
    } catch (error) {
        console.log("Error in getGroupStatuses", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const viewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const status = await Status.findById(id);
        if (!status) return res.status(404).json({ error: "Status not found" });

        // Add to viewers if not already viewed
        if (!status.viewers.includes(userId)) {
            status.viewers.push(userId);
            await status.save();
        }

        res.status(200).json({ message: "Status viewed" });
    } catch (error) {
        console.log("Error in viewStatus", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const status = await Status.findById(id);
        if (!status) return res.status(404).json({ error: "Status not found" });

        if (status.userId.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await Status.findByIdAndDelete(id);

        // Optional: Delete from Cloudinary using public_id if stored (omitted for simplicity, TTL cleans up DB)

        res.status(200).json({ message: "Status deleted" });
    } catch (error) {
        console.log("Error in deleteStatus", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
