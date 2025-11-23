const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    text: String,
    timestamp: { type: Date, default: Date.now }
  }]
});


module.exports = mongoose.model("chat", ChatSchema);