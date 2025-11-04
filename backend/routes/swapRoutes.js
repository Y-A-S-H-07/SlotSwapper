const express = require("express");
const protect = require("../middleware/auth");
const {
  getSwappableSlots,
  createSwapRequest,
  respondToSwap,
  getIncoming,
  getOutgoing
} = require("../controllers/swapController");

const router = express.Router();

router.get("/", protect, getSwappableSlots);
router.post("/", protect, createSwapRequest);
router.post("/:id/respond", protect, respondToSwap);
router.get("/incoming", protect, getIncoming);
router.get("/outgoing", protect, getOutgoing);

module.exports = router;
