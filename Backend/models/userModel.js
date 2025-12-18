const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    default: "",
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  streak: {
    type: Number,
    default: 1,
  },

  lastActiveDate: {
    type: Date,
    default: null,
  },

  wellnessScore: {
    type: Number,
    default: 50,
  },

  assessmentsCompleted: {
    type: Number,
    default: 0,
  },

  moods: [
    {
      value: Number,
      label: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  activities: [
    {
      title: String,
      icon: String,
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  sessions: [
    {
      counselor: String,
      date: String,
      time: String,
      status: {
        type: String,
        default: "pending",
      },
    },
  ],

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },

  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
