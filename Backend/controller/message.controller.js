import { getReceiverSocketId, io } from "../SocketIO/server.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const { isGroup } = req.query; // Check if sending to a group
    const senderId = req.user._id;

    let newMessage;

    if (isGroup === "true") {
      // Group Message
      newMessage = new Message({
        senderId,
        groupId: receiverId,
        message,
      });
      await newMessage.save();
      await newMessage.populate("senderId", "fullname email");

      // Emit to all users in the room (socket room = groupId)
      io.to(receiverId).emit("newMessage", newMessage);

    } else {
      // Direct Message (Existing logic)
      let conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      });
      if (!conversation) {
        conversation = await Conversation.create({
          members: [senderId, receiverId],
        });
      }
      newMessage = new Message({
        senderId,
        receiverId,
        message,
      });
      if (newMessage) {
        conversation.messages.push(newMessage._id);
      }
      await Promise.all([conversation.save(), newMessage.save()]);

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const { isGroup } = req.query;
    const senderId = req.user._id;

    console.log("getMessage request:", { chatUser, isGroup });

    if (isGroup === "true") {
      const messages = await Message.find({ groupId: chatUser }).populate("senderId", "fullname email");
      console.log("Group Messages Populated:", JSON.stringify(messages, null, 2));
      return res.status(200).json(messages);
    }

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, chatUser] },
    }).populate("messages");
    if (!conversation) {
      return res.status(200).json([]);
    }
    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
