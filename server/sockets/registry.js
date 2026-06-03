// Tracks which sockets belong to which user, lets controllers emit to a userId.
const userSockets = new Map(); // userId -> Set<socketId>
let ioRef = null;

function bind(io) {
  ioRef = io;
}
function add(userId, socketId) {
  if (!userSockets.has(userId)) userSockets.set(userId, new Set());
  userSockets.get(userId).add(socketId);
}
function remove(userId, socketId) {
  const set = userSockets.get(userId);
  if (!set) return;
  set.delete(socketId);
  if (set.size === 0) userSockets.delete(userId);
}
function isOnline(userId) {
  return userSockets.has(userId);
}
function emitToUser(userId, event, payload) {
  if (!ioRef) return;
  const set = userSockets.get(String(userId));
  if (!set) return;
  for (const sid of set) ioRef.to(sid).emit(event, payload);
}

module.exports = { bind, add, remove, isOnline, emitToUser };
