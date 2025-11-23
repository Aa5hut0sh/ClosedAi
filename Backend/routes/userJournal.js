const express = require("express");
const router = express.Router();
const Journal = require("../models/journalModel");
const { authMiddleware } = require("../middleware");

// Create a journal entry
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, mood, imageUrl } = req.body;
    if (!content) return res.status(400).json({ message: "Content required" });

    const journal = await Journal.create({
      userId: req.userId,
      title,
      content,
      mood,
      imageUrl,
    });

    res.json({ message: "Journal created", journal });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all journals of user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ journals });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single journal
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!journal) return res.status(404).json({ message: "Not found" });

    res.json({ journal });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete journal
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
