# 🤖 G-Chatbot

G-Chatbot is a web-based AI chatbot built as a full-stack project. It provides a simple conversational interface where users can interact with Google's Gemini AI through a Node.js and Express backend.

The project started as a basic chatbot and was gradually improved with conversation context, a personality quiz, responsive UI, and better user interaction features.

## 🚀 Features

- 💬 AI-powered chat using Gemini
- 🧠 Conversation context for follow-up questions
- 🧩 MBTI personality quiz using `/mbti`
- ⌨️ Typing animation while waiting for a response
- 📋 Copy AI responses
- 🕒 Message timestamps
- 🗑️ Clear chat functionality
- 📱 Responsive interface
- ⚠️ Basic API and error handling
- 🔐 API key kept on the backend using environment variables

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- CORS
- dotenv

### AI
- Google Gemini API

## 📁 Project Structure

```text
G-chatbot/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── GV-ai-logo.jpg
│   ├── imageicon.svg
│   ├── submit.svg
│   └── Mbtiimages/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
