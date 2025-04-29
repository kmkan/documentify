import Room from '../models/Room.js';
import slugify from 'slugify';

export const createRoom = async (req, res) => {
  const { roomName } = req.body; 
  try {
    const slug = slugify(roomName, { lower: true });

    let existingRoom = await Room.findOne({ roomId: slug });
    if (existingRoom) {
      return res.status(200).json(existingRoom); 
    }

    const room = new Room({ roomId: slug });
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