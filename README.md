# SkillSwap 🚀

SkillSwap is a full-stack peer-to-peer skill exchange platform that enables users to connect, learn, and teach skills through real-time communication.

## 🌟 Features

* User Authentication (JWT Access & Refresh Tokens)
* Secure Registration & Login
* User Profiles
* Skill Matching System
* Real-time Chat using Socket.io
* Notifications
* Connection Requests
* Responsive UI
* Protected Routes
* MongoDB Database Integration

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Axios
* React Hook Form
* Zod

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.io
* JWT Authentication
* Express Middleware

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📂 Project Structure

```bash
SkillSwap/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables

### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

### Backend (.env)

```env
PORT=1000

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

CLIENT_URL=https://your-frontend-url.vercel.app
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/AkankshaShukla1611/SkillSwapMERN.git

cd SkillSwapMERN
```

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

### Backend Setup

```bash
cd server

npm install

npm run dev
```

---

## 🔗 Live Demo

Frontend:
https://skill-swap-mern-pi.vercel.app

Backend:
https://skillswap-backend-bqg4.onrender.com

---



