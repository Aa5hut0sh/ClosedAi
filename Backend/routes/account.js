const express = require("express");
const router = express.Router();
const Account = require("../models/accounModel");
const { authMiddleware } = require("../middleware");
const mongoose = require("mongoose");

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({ balance: account.balance });
  } catch (error) {
    console.error("Balance error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let { amount, to } = req.body;
    console.log("Incoming transfer request:", { amount, to, userId: req.userId });

    amount = Number(amount);
    if (!amount || amount <= 0) {
      console.log("Invalid amount");
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({ message: "Invalid transfer amount" });
    }

    const fromAccount = await Account.findOne({ userId: req.userId }).session(session);
    console.log("Sender account found:", fromAccount);

    if (!fromAccount) {
      console.log("Sender account not found");
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: "Sender account not found" });
    }

    if (fromAccount.balance < amount) {
      console.log("Insufficient balance");
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);
    console.log("Receiver account found:", toAccount);

    if (!toAccount) {
      console.log("Invalid recipient account");
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({ message: "Invalid recipient account" });
    }

    console.log(`Transferring ₹${amount} from ${req.userId} → ${to}`);

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();
    await session.endSession();

    console.log("Transfer successful");
    res.json({ message: "Transfer successful" });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.error("Transfer failed:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


module.exports = router;
