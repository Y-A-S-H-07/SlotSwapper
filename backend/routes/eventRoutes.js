const express = require("express");
const protect = require("../middleware/auth");
const { createEvent, getMyEvents, updateEvent, deleteEvent } = require("../controllers/eventController");
const router = express.Router();

router.post("/", protect, createEvent);
router.get("/", protect, getMyEvents);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;
