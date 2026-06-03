const { Server } = require('socket.io');
const { verifyAccess } = require('../utils/jwt');
const registry = require('./registry');

module.exports = function initSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: (process.env.CLIENT_URL || 'http://localhost:3000').split(','),
      credentials: true,
    },
  });
  registry.bind(io);

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers.authorization || '').replace('Bearer ', '');
      if (!token) return next(new Error('Missing token'));
      const decoded = verifyAccess(token);
      socket.userId = decoded.sub;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const uid = socket.userId;
    registry.add(uid, socket.id);
    io.emit('presence:online', { userId: uid });

    socket.on('chat:typing', ({ conversationId, isTyping, to }) => {
      if (to) registry.emitToUser(to, 'chat:typing', { conversationId, isTyping, from: uid });
    });

    // WebRTC signaling — server only relays, never inspects payloads.
    for (const event of ['call:invite', 'call:offer', 'call:answer', 'call:ice', 'call:end']) {
      socket.on(event, (payload) => {
        if (!payload?.to) return;
        registry.emitToUser(payload.to, event, { ...payload, from: uid });
      });
    }

    socket.on('disconnect', () => {
      registry.remove(uid, socket.id);
      if (!registry.isOnline(uid)) io.emit('presence:offline', { userId: uid });
    });
  });

  return io;
};
