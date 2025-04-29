import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import roomRoutes from './routes/roomRoutes.js';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST', 'PATCH']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/rooms', roomRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('send-changes', ({ roomId, document }) => {
    socket.to(roomId).emit('receive-changes', document);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});