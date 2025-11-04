const Event = require("../models/Event");

// create new event
exports.createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    if (!title || !startTime || !endTime)
      return res.status(400).json({ message: "Missing fields" });

    const ev = await Event.create({
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      owner: req.userId,
      status: "BUSY", // default status
    });

    res.status(201).json(ev);
  } catch (err) {
    console.error("Create Event Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// get all my events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ owner: req.userId }).sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    console.error("Get Events Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// update event
exports.updateEvent = async (req, res) => {
  try {
    const ev = await Event.findOne({ _id: req.params.id, owner: req.userId });
    if (!ev) return res.status(404).json({ message: "Not found" });

    const { title, startTime, endTime, status } = req.body;
    if (title) ev.title = title;
    if (startTime) ev.startTime = new Date(startTime);
    if (endTime) ev.endTime = new Date(endTime);
    if (status) ev.status = status;

    await ev.save();
    res.json(ev);
  } catch (err) {
    console.error("Update Event Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// delete event
exports.deleteEvent = async (req, res) => {
  try {
    const ev = await Event.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!ev) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete Event Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
