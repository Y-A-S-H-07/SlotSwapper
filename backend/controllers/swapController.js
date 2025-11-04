const mongoose = require("mongoose");
const Event = require("../models/Event");
const SwapRequest = require("../models/SwapRequest");

exports.getSwappableSlots = async (req, res) => {
  try {
    const slots = await Event.find({ status: "SWAPPABLE", owner: { $ne: req.userId } }).populate("owner", "name email");
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createSwapRequest = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId) return res.status(400).json({ message: "Missing fields" });

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const mySlot = await Event.findOne({ _id: mySlotId }).session(session);
      const theirSlot = await Event.findOne({ _id: theirSlotId }).session(session);

      if (!mySlot || !theirSlot) throw new Error("Slots not found");
      if (mySlot.owner.toString() !== req.userId) throw new Error("Not owner of mySlot");
      if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE") throw new Error("Slots must be SWAPPABLE");
      if (theirSlot.owner.toString() === req.userId) throw new Error("Cannot request your own slot");

      mySlot.status = "SWAP_PENDING";
      theirSlot.status = "SWAP_PENDING";
      await mySlot.save({ session });
      await theirSlot.save({ session });

      const swap = await SwapRequest.create([{
        requester: req.userId,
        requestedSlot: theirSlot._id,
        offeredSlot: mySlot._id
      }], { session });

      res.status(201).json(swap[0]);
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Failed to create swap" });
  } finally {
    session.endSession();
  }
};

exports.getIncoming = async (req, res) => {
  try {
    // incoming: swap requests where the requestedSlot owner is current user
    const swaps = await SwapRequest.find()
      .populate("requester", "name email")
      .populate({
        path: "requestedSlot",
        populate: { path: "owner", select: "name email" }
      })
      .populate("offeredSlot");
    // filter on server to only incoming/outgoing to reduce client logic
    const incoming = swaps.filter(s => s.requestedSlot?.owner?._id?.toString() === req.userId);
    res.json(incoming);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOutgoing = async (req, res) => {
  try {
    const outgoing = await SwapRequest.find({ requester: req.userId })
      .populate("requester", "name email")
      .populate("requestedSlot")
      .populate("offeredSlot");
    res.json(outgoing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.respondToSwap = async (req, res) => {
  const { accept } = req.body;
  const swapId = req.params.id;

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const swap = await SwapRequest.findById(swapId).session(session)
        .populate("requestedSlot")
        .populate("offeredSlot");

      if (!swap) throw new Error("Swap not found");
      if (swap.status !== "PENDING") throw new Error("Swap not pending");

      // make sure current user owns requested slot
      if (swap.requestedSlot.owner.toString() !== req.userId)
        throw new Error("Not authorized");

      // if rejected
      if (!accept) {
        swap.status = "REJECTED";
        swap.requestedSlot.status = "SWAPPABLE";
        swap.offeredSlot.status = "SWAPPABLE";
        await swap.requestedSlot.save({ session });
        await swap.offeredSlot.save({ session });
        await swap.save({ session });
        return res.json({ message: "Swap rejected" });
      }

      // if accepted → swap only the time slots
      const tempStart = swap.requestedSlot.startTime;
      const tempEnd = swap.requestedSlot.endTime;

      swap.requestedSlot.startTime = swap.offeredSlot.startTime;
      swap.requestedSlot.endTime = swap.offeredSlot.endTime;

      swap.offeredSlot.startTime = tempStart;
      swap.offeredSlot.endTime = tempEnd;

      // set both to BUSY
      swap.requestedSlot.status = "BUSY";
      swap.offeredSlot.status = "BUSY";

      swap.status = "ACCEPTED";

      await swap.requestedSlot.save({ session });
      await swap.offeredSlot.save({ session });
      await swap.save({ session });

      res.json({ message: "Swap accepted — time swapped, titles unchanged" });
    });
  } catch (err) {
    console.error("Swap response error:", err);
    res.status(400).json({ message: err.message || "Failed to respond" });
  } finally {
    session.endSession();
  }
};
