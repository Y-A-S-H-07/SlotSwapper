const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requestedSlot: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  offeredSlot: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  status: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING" }
}, { timestamps: true });

module.exports = mongoose.model("SwapRequest", swapRequestSchema);
