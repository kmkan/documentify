import Room from '../models/Room.js';

export const createRoom = async (req, res) => {
  const { roomId } = req.body;
  try {
    const room = new Room({ roomId });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  const { roomId } = req.params;
  const { document } = req.body;
  try {
    const room = await Room.findOneAndUpdate(
      { roomId },
      { document },
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
