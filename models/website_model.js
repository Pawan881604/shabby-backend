const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema({
  website_id: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: null,
  },
  discription: {
    type: String,
    default: null,
  },
  uuid: {
    type: String,
    default: null,
  },
  link: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: "Active",
  },
  update_at: {
    type: Date,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Website", websiteSchema);
