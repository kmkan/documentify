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

// --- START: MODIFIED CORS CONFIGURATION ---

// Define allowed origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL, // For your deployed app
  'http://localhost:3000'  // For local development
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH'],
};

const io = new Server(server, {
  cors: corsOptions
});

app.use(cors(corsOptions));

// --- END: MODIFIED CORS CONFIGURATION ---


const PORT = process.env.PORT || 5000;

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

    const users = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    io.to(roomId).emit('user-count', users);
  });

  socket.on('send-changes', ({ roomId, document }) => {
    socket.to(roomId).emit('receive-changes', document);
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((roomId) => {
      if (roomId !== socket.id) { 
        setTimeout(() => { 
          const users = io.sockets.adapter.rooms.get(roomId)?.size || 0;
          io.to(roomId).emit('user-count', users);
        }, 0);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});