const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number,
  altText: String,
  title: String,
  caption: String,
  status: {
    type: String,
    default: "Active",
  },
  update_at: {
    type: Date,
    default: null,
  },
  creditat: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Images", imageSchema);
