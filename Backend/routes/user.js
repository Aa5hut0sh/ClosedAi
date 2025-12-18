const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Account = require("../models/accounModel");
const { authMiddleware } = require("../middleware"); 


const signupSchema = zod.object({
  email: zod.string().email(),
  firstname: zod.string().min(1),
  lastname: zod.string().min(1),
  password: zod.string().min(6),
});


router.post("/signup", async (req, res) => {
  const body = req.body;

  const { success } = signupSchema.safeParse(body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid input data",
    });
  }

  const existingUser = await User.findOne({ email: body.email });
  if (existingUser) {
    return res.status(400).json({
      message: "Email already taken",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(body.password, salt);

  const newUser = await User.create({
    ...body,
    password: hash,
  });


    await Account.create({
        userId:newUser._id,
        balance: 1 + Math.random() * 10000
    })

  const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

  res.json({
    message: "User created successfully",
    token,
  });
});


router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  res.json({
    message: "Signin successful",
    token,
  });
});


router.put("/update", authMiddleware, async (req, res) => {
  const updates = req.body;
  if (updates.password) delete updates.password;

  const updatedUser = await User.findByIdAndUpdate(
    req.userId,
    updates,
    { new: true }
  );

  res.json({
    message: "User updated successfully",
    user: updatedUser,
  });
});

router.delete("/delete", authMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.userId);
  res.json({
    message: "User deleted successfully",
  });
});



router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstname: { $regex: filter, $options: "i" },
      },
      {
        lastname: { $regex: filter, $options: "i" },
      },
    ],
  });

  res.json({
    users: users.map((user) => ({
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      _id: user._id,
      streak:user.streak
    })),
  });
});


router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/logout", authMiddleware, (req, res) => {
  return res.json({ message: "Logged out successfully" });
});


router.post("/activity", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lastDate = user.lastActiveDate;
    if (lastDate) {
      lastDate = new Date(lastDate);
      lastDate.setHours(0, 0, 0, 0);
    }

    if (!lastDate) {
      // First time ever
      user.streak = 1;
    } else {
      const diffDays =
        (today - lastDate) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        // Continued streak
        user.streak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        user.streak = 1;
      }
      // diffDays === 0 → same day → do nothing
    }

    user.lastActiveDate = today;
    await user.save();

    res.json({
      streak: user.streak,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update streak" });
  }
});


module.exports = router;
