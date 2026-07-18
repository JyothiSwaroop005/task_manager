const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

// Initializes Socket.io, authenticates each connection with the JWT,
// and joins the socket to a per-user room so events stay private.
const initSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication error: token missing'));

      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error: invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user_${socket.userId}`);
    console.log(`🔌 Socket connected: user_${socket.userId}`);

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: user_${socket.userId}`);
    });
  });
};

module.exports = initSocket;
