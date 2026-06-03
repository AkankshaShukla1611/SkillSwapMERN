require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const initSockets = require('./sockets');

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB(process.env.MONGODB_URI);
  const server = http.createServer(app);
  initSockets(server);
  server.listen(PORT, () => {
    console.log(`[skillswap] API + sockets listening on :${PORT}`);
  });
})().catch((e) => {
  console.error('Fatal boot error:', e);
  process.exit(1);
});
