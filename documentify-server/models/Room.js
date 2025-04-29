import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  document: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Room', RoomSchema);
