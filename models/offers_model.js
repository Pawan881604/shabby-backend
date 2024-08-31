const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  offer_id: {
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
  valid_date: {
    type: Date,
    default: null,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Images",
  },
  applicable_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: 'All',
    },
  ],
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

module.exports = mongoose.model("Offers", offerSchema);
