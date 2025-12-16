import Group from "../models/group.model.js";
import User from "../models/user.model.js";

// Create a new group
export const createGroup = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const admin = req.user._id;

        if (!name) {
            return res.status(400).json({ error: "Group name is required" });
        }

        const existingGroup = await Group.findOne({ name });
        if (existingGroup) {
            return res.status(400).json({ error: "Group name already exists" });
        }

        const newGroup = new Group({
            name,
            description,
            image,
            admin,
            members: [admin], // Admin is automatically a member
        });

        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        console.log("Error in createGroup", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all groups
export const getGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate("admin", "fullname email");
        res.status(200).json(groups);
    } catch (error) {
        console.log("Error in getGroups", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a single group by ID (with members)
export const getGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findById(id).populate("members", "fullname email").populate("admin", "fullname");
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(200).json(group);
    } catch (error) {
        console.log("Error in getGroup", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Join a group
export const joinGroup = async (req, res) => {
    try {
        const { id } = req.params; // Group ID
        const userId = req.user._id;

        const group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ error: "You are already a member of this group" });
        }

        group.members.push(userId);
        await group.save();

        res.status(200).json({ message: "Joined group successfully", group });
    } catch (error) {
        console.log("Error in joinGroup", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get user's groups
export const getMyGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({ members: userId }).populate("admin", "fullname");
        res.status(200).json(groups);
    } catch (error) {
        console.log("Error in getMyGroups", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
