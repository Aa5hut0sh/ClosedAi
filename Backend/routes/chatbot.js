const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
const ChatMessage = require("../models/chatBotModel");
const { authMiddleware } = require("../middleware");

const ai = new GoogleGenAI({});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    await ChatMessage.create({
      userId: req.userId,
      role: "user",
      text: message,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a calm, empathetic mental wellness assistant.
Do NOT provide medical diagnosis.
Be supportive and concise.

User message:
"${message}"
              `,
            },
          ],
        },
      ],
    });

    const reply = response.text;

    await ChatMessage.create({
      userId: req.userId,
      role: "bot",
      text: reply,
    });

    res.json({ reply });
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.userId })
      .sort({ createdAt: 1 })
      .lean();

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to load history" });
  }
});

module.exports = router;
