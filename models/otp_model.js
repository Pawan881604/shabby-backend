const mongoose = require("mongoose");

const Otp_schema = new mongoose.Schema({
  uuid: {
    type: String,
    default: null,
  },
  otp_id: {
    type: String,
    default: null,
  },
  otp: {
    type: Number,
    default: null,
  },
  user_id: {
    type: String,
    default: null,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  update_at: {
    type: Date,
    default: null,
  },
  otp_status: {
    type: String,
    default: "Active",
  },
});

module.exports = mongoose.model("Otp", Otp_schema);
