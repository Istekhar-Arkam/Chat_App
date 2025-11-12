import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { io, userSocketMap } from "../app.js";
import cloudinary from "../utils/cloudinary.js";

// get all user except the logged user

export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // count number of message not seen by the logged user

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.status(200).json({ filteredUsers, unseenMessages });
  } catch (error) {
    throw new ApiError(
      401,
      "something went wrong in count number of message section"
    );
  }
};

// get all messages for selected user

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.status(200).json(messages);
  } catch (error) {
    throw new ApiError(
      401,
      "something went wrong in selecting message section"
    );
  }
};

// api to mark message as seen using message id

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.status(200).json({ message: "message marked as seen" });
  } catch (error) {
    throw new ApiError(401, "something went wrong in mark message section");
  }
};

// send message to selected to user

export const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;
    const { text, image } = req.body;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    // emit the new message to the receiver's socket if online

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.json(newMessage);
  } catch (error) {
    throw new ApiError(
      401,
      "something went wrong in message to selected user in message section"
    );
  }
};
