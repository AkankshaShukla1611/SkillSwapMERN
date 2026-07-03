# 🚀 SkillSwap

> A full-stack peer-to-peer skill exchange platform that enables users to connect, learn, and teach skills through real-time messaging, voice calling, and video calling.

![License](https://img.shields.io/badge/License-MIT-green)
![React](https://img.shields.io/badge/React-19-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-black)
![WebRTC](https://img.shields.io/badge/WebRTC-Video%20Calling-blueviolet)

---

## 📌 Overview

SkillSwap is a modern full-stack web application where users can exchange skills, discover learning opportunities, communicate in real time, and collaborate through secure voice and video calls.

The application demonstrates real-world software engineering concepts including authentication, REST APIs, real-time communication, WebRTC signaling, deployment, and scalable application architecture.

---

## ✨ Features

### 👤 Authentication

- JWT Authentication
- Refresh Tokens
- Secure Protected Routes
- Persistent Login

---

### 👥 User Profiles

- Create Profile
- Update Profile
- Skills Offered
- Skills Wanted
- Avatar Upload

---

### 🤝 Connections

- Send Connection Requests
- Accept / Reject Requests
- Manage Connections

---

### 💬 Real-Time Chat

- One-to-One Messaging
- Typing Indicator
- Read Receipts
- Live Message Updates

Powered by Socket.io.

---

### 📞 Voice Calling

- Real-time Voice Calls
- Mute / Unmute
- Call Accept / Reject
- Call End

Built using WebRTC.

---

### 🎥 Video Calling

- HD Video Calls
- Camera Toggle
- Microphone Toggle
- Local Preview
- Remote Stream

Built using WebRTC.

---

### 🟢 Presence System

- Online / Offline Status
- Live Presence Updates
- Automatic Disconnect Handling

---

## 🏗 Architecture

```
Next.js Frontend
        │
        │ REST API
        ▼
Express.js Backend
        │
        │
 MongoDB Atlas
        │
        │
Socket.io
        │
        │
     WebRTC
```

---

## 🛠 Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Socket.io Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.io

### Real-Time

- Socket.io
- WebRTC
- STUN Server

### Deployment

- Vercel
- Render
- MongoDB Atlas

---

## 📂 Project Structure

```
client/
├── app/
├── components/
├── contexts/
├── hooks/
├── lib/
└── styles/

server/
├── controllers/
├── middleware/
├── models/
├── routes/
├── sockets/
├── utils/
└── config/
```

---

## 🚀 Live Demo

Frontend

https://skill-swap-mern-pi.vercel.app

Backend

https://skillswap-backend-bq4.onrender.com

---

## 📷 Screenshots

### Home

(Add screenshot)

### Profile

(Add screenshot)

### Chat

(Add screenshot)

### Voice Call

(Add screenshot)

### Video Call

(Add screenshot)

---

## 🔐 Authentication Flow

```
User Login
      │
      ▼
Access Token
      │
      ▼
Protected APIs
      │
      ▼
401 ?
      │
      ▼
Refresh Token
      │
      ▼
Generate New Access Token
```

---

## 📡 Real-Time Communication

```
User A
   │
Socket.io
   │
Server
   │
Socket.io
   │
User B
```

---

## 🎥 Video Calling Flow

```
Caller
   │
Offer
   ▼
Socket.io
   │
Receiver
   │
Answer
   ▼
ICE Candidates
   ▼
Peer Connection
   ▼
Media Stream
```

---

## 🧪 Installation

### Clone

```bash
git clone https://github.com/AkankshaShukla1611/SkillSwapMERN.git
```

### Install

```bash
cd client
npm install

cd ../server
npm install
```

### Environment Variables

Server

```env
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=
```

Client

```env
NEXT_PUBLIC_API_URL=
```

---

## ▶ Run

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

## 📈 Future Improvements

- Group Chat
- Screen Sharing
- File Sharing
- Push Notifications
- Call Recording
- AI Skill Recommendations
- Search Filters

---

## 👩‍💻 Author

**Akanksha Shukla**

Computer Science Engineer

GitHub

https://github.com/AkankshaShukla1611

LinkedIn

(Add your LinkedIn)

---

⭐ If you found this project helpful, consider giving it a star.
