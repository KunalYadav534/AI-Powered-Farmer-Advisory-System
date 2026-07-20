# 🌾 AI-Powered Farmer Advisory System

> An intelligent full-stack web application that empowers Indian farmers with AI-driven agricultural advice, real-time weather updates, and personalized farming guidance.

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=for-the-badge&logo=mongodb)
![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-orange?style=for-the-badge&logo=google)

---

## 🚀 Features

- 🤖 **AI Chatbot** — Farming advice powered by Google Gemini 2.5 Flash
- 🌦️ **Weather Updates** — Real-time weather data via OpenWeatherMap API
- 👤 **Authentication** — Secure Login/Register with JWT & bcryptjs
- 📋 **Chat History** — Conversations saved in MongoDB Atlas
- 🧑‍🌾 **Farmer Profile** — Manage name, location & crop type
- 🎤 **Voice Input** — Speak your farming questions (Chrome)
- 📋 **Copy Response** — Easily copy AI answers

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React.js 19, Vite, React Router DOM |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| AI | Google Gemini 2.5 Flash API |
| Weather | OpenWeatherMap API |

---

## ⚙️ Setup

### Backend
```bash
cd backend
npm install
```

Create `.env`:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
OPENWEATHER_API_KEY=your_openweather_key
PORT=5000
```

```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open 👉 `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/chat` | Ask AI question | ✅ |
| GET | `/api/chat/history` | Get chat history | ✅ |
| GET | `/api/weather?city=Delhi` | Get weather | ❌ |
| GET | `/api/profile` | Get profile | ✅ |
| PUT | `/api/profile` | Update profile | ✅ |

---

## 🔮 Future Scope

- 🌐 Multilingual support (Hindi, Punjabi, Tamil)
- 📸 Crop disease detection via image upload
- 📊 Mandi prices integration
- 📱 Mobile app

---

## 👨‍💻 Developed By

Aryan & Kunal Yadav


> Built as an AI-powered agriculture innovation project for helping farmers with smart digital assistance.

⭐ **Star this repo if you found it helpful!**
