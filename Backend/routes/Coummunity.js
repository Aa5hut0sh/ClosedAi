const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Chat = require("../models/ChatModel");
const { authMiddleware } = require("../middleware");

// =====================================================================
// GET FRIEND REQUESTS
// =====================================================================
router.get("/requests", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("friendRequests", "firstname lastname email");

    res.json({ requests: user.friendRequests || [] });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: "Error fetching friend requests" });
  }
});

// =====================================================================
// SEND FRIEND REQUEST
// =====================================================================
router.post("/send-request/:id", authMiddleware, async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.userId;

    if (receiverId === senderId)
      return res.status(400).json({ message: "Cannot send request to yourself" });

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) return res.status(404).json({ message: "User not found" });

    // Already friends?
    if (sender.friends.includes(receiverId))
      return res.status(400).json({ message: "Already friends" });

    // Already sent?
    if (sender.sentRequests.includes(receiverId))
      return res.status(400).json({ message: "Already sent request" });

    // Already received?
    if (sender.friendRequests.includes(receiverId))
      return res.status(400).json({ message: "They already sent you a request" });

    // Push request
    sender.sentRequests.push(receiverId);
    receiver.friendRequests.push(senderId);

    await sender.save();
    await receiver.save();

    res.json({ message: "Friend request sent successfully" });

  } catch (err) {
    console.error("Send Request Error:", err);
    res.status(500).json({ message: "Error sending request" });
  }
});

// =====================================================================
// ACCEPT FRIEND REQUEST
// =====================================================================
router.post("/accept-request/:id", authMiddleware, async (req, res) => {
  try {
    const senderId = req.params.id;
    const receiverId = req.userId;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver)
      return res.status(404).json({ message: "User not found" });

    // If not requested
    if (!receiver.friendRequests.includes(senderId))
      return res.status(400).json({ message: "No request from this user" });

    // Add friends
    receiver.friends.push(senderId);
    sender.friends.push(receiverId);

    // Remove pending request
    receiver.friendRequests = receiver.friendRequests.filter(
      (id) => id.toString() !== senderId
    );

    sender.sentRequests = sender.sentRequests.filter(
      (id) => id.toString() !== receiverId
    );

    await receiver.save();
    await sender.save();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Accept Request Error:", err);
    res.status(500).json({ message: "Error accepting request" });
  }
});

// =====================================================================
// GET ALL USERS (excluding friends + requests)
// =====================================================================
router.get("/all-users", authMiddleware, async (req, res) => {
  try {
    const me = await User.findById(req.userId);

    const excludeUsers = [
      req.userId,
      ...me.friends,
      ...me.friendRequests,
      ...me.sentRequests
    ];

    const users = await User.find({
      _id: { $nin: excludeUsers }
    }).select("firstname lastname email");

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// =====================================================================
// FRIEND LIST
// =====================================================================
router.get("/friends", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("friends", "firstname lastname email");

    res.json({ friends: user.friends || [] });
  } catch (err) {
    res.status(500).json({ message: "Error loading friends" });
  }
});

// =====================================================================
// GET CHAT
// =====================================================================
router.get("/chat/:id", authMiddleware, async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.params.id;

    let chat = await Chat.findOne({
      users: { $all: [user1, user2] }
    }).populate("messages.sender", "firstname lastname");

    if (!chat) return res.json({ messages: [] });

    // FORMAT MESSAGES FOR FRONTEND
    const formatted = chat.messages.map(m => ({
      sender: m.sender._id.toString(),   // STRING ONLY
      text: m.text,
      timestamp: m.timestamp,
      senderName: m.sender.firstname
    }));

    res.json({ messages: formatted });
  } catch (err) {
    console.error("Chat Load Error:", err);
    res.status(500).json({ message: "Error loading chat" });
  }
});


// =====================================================================
// SEND MESSAGE
// =====================================================================
router.post("/chat/:id", authMiddleware, async (req, res) => {
  try {
    const sender = req.userId;
    const receiver = req.params.id;
    const { text } = req.body;

    if (!text.trim()) return res.json({ message: "Empty message" });

    let chat = await Chat.findOne({
      users: { $all: [sender, receiver] }
    });

    const msg = { sender, text, timestamp: new Date() };

    if (!chat) {
      chat = await Chat.create({
        users: [sender, receiver],
        messages: [msg]
      });
    } else {
      chat.messages.push(msg);
      await chat.save();
    }

    res.json({ message: "sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message" });
  }
});

module.exports = router;
