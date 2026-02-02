# 💬 Real-Time Chat Application with AI Integration

A modern, full-stack chat application built with the MERN stack, featuring real-time messaging powered by Socket.IO and AI-powered chat assistance using Google's Gemini API.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based authentication with HTTP-only cookies
- 💬 **Real-Time Messaging** - Instant message delivery using Socket.IO
- 🤖 **AI Chat Assistant** - Integrated Google Gemini AI for intelligent conversations
- 👥 **Group Chats** - Create and manage group conversations
- 🖼️ **Media Sharing** - Share images with Cloudinary integration
- ✅ **Type Safety** - End-to-end type safety with TypeScript and Zod validation
- 📱 **Responsive Design** - Optimized for desktop and mobile devices
- 🔔 **Real-Time Notifications** - Get notified of new messages instantly
- 👀 **Online Status** - See who's currently online
- 💾 **Message History** - Persistent chat history with MongoDB

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Real-Time:** Socket.IO for WebSocket connections
- **Authentication:** JWT + Passport.js
- **Validation:** Zod schemas
- **AI Integration:** Google Gemini API (via Vercel AI SDK)
- **File Storage:** Cloudinary
- **Security:** Helmet.js, bcrypt for password hashing

### Frontend

- **Framework:** React.js
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Google AI Studio API key

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/Jojoarm/chat-app.git
cd chat-app
```

2. **Install dependencies**

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. **Environment Variables**

Create a `.env` file in the `server` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Frontend URL
FRONTEND_ORIGIN=http://localhost:5173
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

4. **Run the application**

```bash
# Run backend (from server directory)
npm run dev

# Run frontend (from client directory)
npm run dev
```

## 🏗️ Project Structure

```
chat-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── lib/           # Socket.IO setup
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── package.json
│
└── README.md
```

## 🚀 API Endpoints

### Authentication

```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
POST   /api/auth/logout       # Logout user
GET    /api/auth/me           # Get current user
```

### Chats

```
POST   /api/chats             # Create new chat
GET    /api/chats             # Get user's chats
GET    /api/chats/:id         # Get single chat with messages
```

### Messages

```
POST   /api/messages          # Send message
```

### AI Chat

```
POST   /api/ai/chat           # Chat with AI assistant
```

## 🔌 Socket.IO Events

### Client → Server

```javascript
'chat:join'; // Join a chat room
'chat:leave'; // Leave a chat room
```

### Server → Client

```javascript
'online:users'; // Broadcast online users
'chat:new'; // New chat created
'chat:update'; // Chat updated (new message preview)
'message:new'; // New message in chat room
```

## 🧪 Testing

```bash
# Run tests (to be implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🎯 Roadmap

- [x] Basic authentication
- [x] Real-time messaging
- [x] AI chat integration
- [x] Group chats
- [x] Image sharing
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Voice messages
- [ ] Video calls
- [ ] Message search
- [ ] User profiles
- [ ] Dark mode
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Your Name**

- GitHub: [@Jojoarm](https://github.com/Jojoarm)
- LinkedIn: [George Ofogba](https://linkedin.com/in/george-ofogba-075ba6203)
- Portfolio: [meetgeorge.vercel.app](https://meetgeorge.vercel.app)

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Vercel AI SDK](https://sdk.vercel.ai/) for AI integration
- [Cloudinary](https://cloudinary.com/) for media management
- Inspired by modern chat applications like WhatsApp and Telegram

<div align="center">
  <p>Built with ❤️ using the MERN stack</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
