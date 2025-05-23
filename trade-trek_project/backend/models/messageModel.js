const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomId: String,
  sender: String,
  senderName: String, // Sender Name
  text: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
