# CodeLearn - AI-Powered Coding & Learning Platform

CodeLearn is a full-stack e-learning platform designed for students preparing for coding interviews and technical placements.

It combines coding practice, AI-generated MCQ quizzes, LeetCode problem integration, progress tracking, and real-time code execution in one platform.

## 🚀 Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes

### 💻 Coding Practice
- Coding problems with topic and difficulty filters
- Monaco code editor
- Java, C++, Python, and JavaScript support
- Real-time code execution using Docker
- Custom input support
- Run and Submit functionality

### 🤖 AI-Powered Learning
- Generate MCQs dynamically using Google Gemini API
- Select topic, difficulty, and number of questions
- Four-option multiple choice questions
- Correct answer and explanation
- AI-generated coding challenges

### 🧩 LeetCode Integration
- Search LeetCode problems by name or problem number
- Open actual LeetCode problem statements
- Load LeetCode starter code
- Run coding solutions
- Submit solutions against example test cases

### 📊 Progress Tracking
- Coding problems solved
- Submission statistics
- Coding accuracy
- Quiz attempts
- Quiz accuracy
- Activity and progress tracking
- Daily coding streak

### 👤 Profile & Settings
- User profile
- Account settings
- Learning progress
- Responsive interface

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- Monaco Editor
- Recharts
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

### AI
- Google Gemini API

### Code Execution
- Docker
- Java 21
- Python
- C++
- Node.js

### External Integration
- LeetCode GraphQL API

## 🏗️ Project Structure

```text
CodeLearn/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── seed/
│   ├── .env.example
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── vite.config.js
│
├── README.md
├── SETUP.md
└── .gitignore