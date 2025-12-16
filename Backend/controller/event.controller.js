import Event from "../models/event.model.js";
import Group from "../models/group.model.js";

// Create a new event
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, groupId, limit } = req.body;
        const createdBy = req.user._id;

        // Basic validation
        if (!title || !date || !groupId) {
            return res.status(400).json({ error: "Title, date, and group ID are required" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Authorization: must be group member
        if (!group.members.includes(createdBy)) {
            return res.status(403).json({ error: "You must be a member of the group to create an event" });
        }

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            group: groupId,
            createdBy,
            limit: limit || 0,
            attendees: [createdBy], // Creator attends by default
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.log("Error in createEvent", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGroupEvents = async (req, res) => {
    try {
        const { groupId } = req.params;
        const events = await Event.find({ group: groupId }).populate("attendees", "fullname");
        res.status(200).json(events);
    } catch (error) {
        console.log("Error in getGroupEvents", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const requestJoin = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user._id;

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (event.attendees.includes(userId)) {
            return res.status(400).json({ error: "Already joined" });
        }

        if (event.requests.some(r => r.userId.toString() === userId.toString())) {
            return res.status(400).json({ error: "Request already pending" });
        }

        if (event.limit > 0 && event.attendees.length >= event.limit) {
            return res.status(400).json({ error: "Event is full" });
        }

        event.requests.push({ userId, reason });
        await event.save();

        res.status(200).json({ message: "Request sent" });
    } catch (error) {
        console.log("Error in requestJoin", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const handleRequest = async (req, res) => {
    try {
        const { id } = req.params; // Event ID
        const { userId, status } = req.body; // status: 'approved' or 'rejected'
        const adminId = req.user._id;

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (event.createdBy.toString() !== adminId.toString()) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        // Remove request
        event.requests = event.requests.filter(r => r.userId.toString() !== userId.toString());

        if (status === 'approved') {
            if (event.limit > 0 && event.attendees.length >= event.limit) {
                return res.status(400).json({ error: "Event is full" });
            }
            event.attendees.push(userId);
        }

        await event.save();
        res.status(200).json(event);
    } catch (error) {
        console.log("Error in handleRequest", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const joinEvent = async (req, res) => {
    // Deprecated or used for direct join if we want to keep it?
    // Changing logic to just redirect to requestJoin if it needs approval?
    // For now, let's keep requestJoin as the main way or use this for unlimited events?
    // Per requirements, ALL events need permission? "users have to take permission".
    // So this function might not be needed or should be an auto-approve alias.
    // Let's replace with a simple getAllEvents for dashboard first.
    return res.status(400).json({ error: "Use request join" });
};

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("group", "name").populate("attendees", "fullname");
        res.status(200).json(events);
    } catch (error) {
        console.log("Error in getAllEvents", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getEventRequests = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate("requests.userId", "fullname email");
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Check permissions
        if (event.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        res.status(200).json(event.requests);
    } catch (error) {
        console.log("Error in getEventRequests", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
