const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  branch_id: {
    type: String,
    default: null,
  },
  phone_number: {
    type: String,
    default: null,
  },
  link: {
    type: String,
    default: null,
  },
  branch: {
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
  create_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Branch", branchSchema);
