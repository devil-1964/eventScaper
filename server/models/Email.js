const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  eventUrls: {
    type: [String],
    default: [],
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Email", EmailSchema);
