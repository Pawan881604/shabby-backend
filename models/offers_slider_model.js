const mongoose = require("mongoose");

const offersliderSchema = new mongoose.Schema({
  slider_id: {
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
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Images",
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

module.exports = mongoose.model("Offer_slider", offersliderSchema);
