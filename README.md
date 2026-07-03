# SkillSwap 🚀

> **Trade Skills. Build Connections. Learn Together.**

<p align="center">
  <b>A production-ready full-stack MERN platform enabling peer-to-peer skill exchange with real-time messaging and WebRTC voice/video calling.</b>
</p>

---

# 🌟 Overview

SkillSwap is a full-stack social learning platform where users can teach what they know and learn what they don't.

Unlike traditional learning platforms, SkillSwap focuses on **mutual learning**. Every user can be both a mentor and a learner.

The project was designed and built as a production-ready MERN application emphasizing authentication, scalability, clean architecture, and real-time communication.

---

# ✨ Highlights

- JWT Authentication
- Refresh Tokens
- Protected APIs
- Skill Discovery
- Connection Requests
- Real-Time Chat
- Online / Offline Presence
- Typing Indicators
- WebRTC Voice Calling
- WebRTC Video Calling
- Camera Toggle
- Microphone Toggle
- Read Receipts
- Responsive UI
- Cloudinary Image Uploads
- MongoDB Atlas
- Socket.IO
- Render Deployment
- Vercel Deployment

---

# 🏗 Architecture

```text
                    Browser

        React + Next.js + TailwindCSS
                    │
             Axios Interceptors
                    │
          JWT Authentication Layer
                    │
             Express REST API
                    │
      Socket.IO Signaling Server
                    │
          WebRTC Peer Connection
                    │
             MongoDB Atlas
                    │
             Cloudinary Storage
```

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React
- Tailwind CSS
- Axios
- Context API
- Socket.IO Client

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- bcrypt

## Deployment

- Vercel
- Render
- MongoDB Atlas
- Cloudinary

---

# 📂 Project Structure

```text
client/
 ├── app/
 ├── components/
 ├── contexts/
 ├── hooks/
 │     └── useWebRTC.ts
 ├── lib/
 └── ui/

server/
 ├── config/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── sockets/
 │     ├── index.js
 │     └── registry.js
 ├── utils/
 └── server.js
```

---

# 🔐 Authentication

- User Registration
- Login
- Access Token
- Refresh Token
- Protected Routes
- Token Refresh
- Password Hashing

---

# 💬 Real-Time Messaging

- Instant Delivery
- Read Receipts
- Typing Indicators
- Online Presence
- Socket Events

---

# 📞 Voice Calling

Powered using **WebRTC**.

Features

- Peer-to-peer audio
- ICE Candidate Exchange
- SDP Negotiation
- Mute / Unmute
- Automatic Cleanup

---

# 🎥 Video Calling

Features

- Camera Sharing
- Audio + Video Streams
- Camera Toggle
- Microphone Toggle
- End Call
- Remote Stream Rendering

---

# 🧠 Engineering Decisions

## Why WebRTC?

To establish encrypted peer-to-peer media communication while using Socket.IO only for signaling.

## Why Socket.IO?

Reliable event-based communication for messaging, typing indicators, presence and signaling.

## Why JWT?

Stateless authentication with scalable API design.

## Why MongoDB?

Flexible document model suitable for conversations, messages and user profiles.

---

# 🐞 Engineering Challenges

## 1. Presence Synchronization

Problem:
Users appeared offline even after authentication.

Root Cause:
Socket registry was not synchronizing authenticated user IDs with active socket IDs.

Solution:
Implemented centralized socket registry and broadcast presence updates.

---

## 2. Video Calling

Problem:
Remote video was never displayed.

Root Cause:
Incorrect signaling lifecycle and media attachment.

Solution:
Fixed signaling flow, remote stream attachment and peer initialization.

---

## 3. Voice Calling

Problem:
Remote audio track existed but no sound was heard.

Root Cause:
Audio stream wasn't attached to an audio element for audio-only calls.

Solution:
Introduced dedicated audio renderer and corrected playback lifecycle.

---

# 🔒 Security

- JWT Authentication
- Refresh Tokens
- Password Hashing
- Protected APIs
- Authorization Middleware
- Environment Variables
- Secure Socket Authentication

---

# ⚡ Performance

- Axios Interceptors
- Socket Cleanup
- WebRTC Resource Cleanup
- Optimized React Rendering
- Efficient Presence Registry

---

# 🚀 Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

Media

- Cloudinary

---

# 📸 Screenshots

Add screenshots here:

- Landing Page
- Dashboard
- Profile
- Chat
- Voice Call
- Video Call
- Mobile View

---

# 🔮 Roadmap

- Group Calls
- Screen Sharing
- AI Skill Recommendations
- Notifications
- Docker
- CI/CD
- Redis
- Testing

---

# 📚 Lessons Learned

Building SkillSwap strengthened my understanding of:

- System Design
- MERN Architecture
- JWT Authentication
- Socket.IO
- WebRTC
- Production Deployment
- Real-time State Synchronization
- Debugging Distributed Systems

---

# 👩‍💻 About the Developer

**Akanksha**

Computer Science Graduate | MERN Stack Developer

I enjoy building scalable web applications, solving real-world engineering problems and continuously improving my software engineering skills. SkillSwap represents my interest in real-time systems, clean architecture and modern web technologies.

---

# 🤝 For Recruiters

Thank you for taking the time to review this project.

SkillSwap was built to deepen my understanding of production-grade full-stack development, real-time communication and scalable application architecture.

I welcome feedback, technical discussions and opportunities where I can contribute while continuing to learn.

---

# 📬 Contact

- GitHub: https://github.com/AkankshaShukla1611


---

If you found this project interesting, consider giving it a ⭐.
