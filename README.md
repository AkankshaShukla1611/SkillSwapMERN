<<<<<<< HEAD
# SkillSwap (MERN)

Peer-to-peer skill exchange platform built on a strict MERN stack.

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui + Axios + React Hook Form + Zod + Socket.io-client
- **Backend:** Node.js + Express + MongoDB Atlas + Mongoose + JWT (access + refresh) + Socket.io
- **Media:** Cloudinary
- **Realtime:** Socket.io (chat, typing, read receipts, presence, notifications, WebRTC signaling)
- **Video:** Native WebRTC, no third-party SDK

## Repo Layout
```
skillswap/
├── server/    # Express API + Socket.io
└── client/    # Next.js 15 App Router
```

## Quick Start

### 1. Backend
```bash
cd server
cp .env.example .env   # fill in values
npm install
npm run dev            # http://localhost:5000
```

### 2. Frontend
```bash
cd client
cp .env.example .env.local
npm install
npm run dev            # http://localhost:3000
```

## Environment Variables

### server/.env
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=replace-me
JWT_REFRESH_SECRET=replace-me-too
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:3000
```

### client/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Deployment

| Layer    | Host          |
|----------|---------------|
| Frontend | Vercel        |
| Backend  | Render (Web Service, Node) |
| Database | MongoDB Atlas |
| Media    | Cloudinary    |

### Backend on Render
- Build command: `npm install`
- Start command: `npm start`
- Add all env vars from `server/.env.example`
- Free plan works; upgrade if you need always-on sockets

### Frontend on Vercel
- Root directory: `client`
- Framework preset: Next.js
- Env var: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

After deploy, update backend `CLIENT_URL` to your Vercel URL so CORS allows it.

## Features

- Email/password auth with JWT access + refresh rotation
- Profile CRUD with Cloudinary avatar upload
- Skill-based user search & filters (skill, location, availability)
- Connection requests (send / accept / reject)
- Real-time 1:1 chat with typing indicators, read receipts, unread counts
- Presence (online/offline)
- WebRTC audio + video calls with mute / camera toggle / hang-up
- Notifications (new request, accepted, new message, missed call)
- Security: bcrypt, helmet, CORS, rate limiting, xss-clean, Zod input validation

## API Overview

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

GET    /api/users
GET    /api/users/search?skill=&location=&availability=
GET    /api/users/:id
GET    /api/users/me
PATCH  /api/users/me
POST   /api/users/me/avatar

POST   /api/connections                 # send
PATCH  /api/connections/:id             # accept | reject
GET    /api/connections                 # list mine
DELETE /api/connections/:id

GET    /api/conversations
POST   /api/conversations               # { otherUserId }
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
PATCH  /api/conversations/:id/read

GET    /api/notifications
PATCH  /api/notifications/:id/read
```

## Socket.io Events

| Event              | Direction | Payload |
|--------------------|-----------|---------|
| `presence:online`  | s→c       | `{ userId }` |
| `presence:offline` | s→c       | `{ userId }` |
| `chat:send`        | c→s       | `{ conversationId, body }` |
| `chat:new`         | s→c       | `Message` |
| `chat:typing`      | c↔s       | `{ conversationId, isTyping }` |
| `chat:read`        | c↔s       | `{ conversationId }` |
| `notify:new`       | s→c       | `Notification` |
| `call:invite`      | c↔s       | `{ to, conversationId }` |
| `call:offer`       | c↔s       | `{ to, sdp }` |
| `call:answer`      | c↔s       | `{ to, sdp }` |
| `call:ice`         | c↔s       | `{ to, candidate }` |
| `call:end`         | c↔s       | `{ to }` |

## License
MIT
=======
# SkillSwapMERN
>>>>>>> c111cdaa85bed9bd837225065cb62ff02fe22690
