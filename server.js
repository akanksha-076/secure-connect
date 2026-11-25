require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

const server = http.createServer(app);
const io = new Server(server);

// Authenticate every socket connection using the JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token provided'));
  try {
    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
  });

  socket.on('chatMessage', ({ room, message }) => {
    console.log(`[${room}] ${socket.user.username}: ${message}`);
    io.to(room).emit('chatMessage', {
      user: socket.user.username,
      message,
      time: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () =>
      console.log(`[server] listening on http://localhost:${process.env.PORT}`));
  })
  .catch(err => console.error('MongoDB connection failed:', err.message));