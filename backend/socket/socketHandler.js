const jwt = require('jsonwebtoken');

// Authenticates the socket handshake using the same JWT issued by /login,
// then joins the socket to a per-user room so events only reach that user's
// connected clients (multiple tabs/devices stay in sync in real time).
function initSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error: no token'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error: invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.userId}`);
    console.log(`Socket connected: user ${socket.userId} (${socket.id})`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: user ${socket.userId} (${socket.id})`);
    });
  });
}

module.exports = initSocket;
