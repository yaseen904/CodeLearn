# CodeLearn Setup Guide

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `backend` directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codelearn
JWT_SECRET=codelearn_secret_key_2024_secure
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

**Note:** The `GEMINI_API_KEY` is optional and only needed if you want to use AI-generated MCQs. Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
mongod
```

### 4. Seed the Database

```bash
cd backend
npm run seed
```

This will populate the database with:
- 20 coding problems
- 40 MCQ questions

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

Open your browser and navigate to: `http://localhost:5173`

## Default User

No default user is created. You need to register a new account through the application.

1. Click "Get Started" on the landing page
2. Fill in your details
3. Submit the registration form
4. Login with your credentials

## Troubleshooting

### MongoDB Connection Error

If you see a MongoDB connection error:
- Make sure MongoDB is running
- Check the MONGODB_URI in your .env file
- Verify MongoDB is installed correctly

### Port Already in Use

If port 5000 is already in use:
- Change the PORT in backend/.env
- Or stop the process using port 5000

If port 5173 is already in use:
- Vite will automatically suggest an alternative port
- Or stop the process using port 5173

### CORS Errors

If you encounter CORS errors:
- Make sure the backend is running
- Check the proxy configuration in frontend/vite.config.js

### Import Errors

If you see import errors:
- Make sure all dependencies are installed
- Check that node_modules exists in both frontend and backend
- Try deleting node_modules and reinstalling

## Development

### Backend Development

```bash
cd backend
npm run dev
```

The server will automatically restart on file changes.

### Frontend Development

```bash
cd frontend
npm run dev
```

The frontend will automatically reload on file changes.

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

## Features to Test

1. **User Registration & Login**
   - Register a new account
   - Login with credentials
   - Verify JWT authentication

2. **Dashboard**
   - View statistics
   - Check learning progress
   - View recent activity

3. **Coding Practice**
   - Browse problems
   - Filter by topic/difficulty
   - Search problems

4. **Code Editor**
   - Open a problem
   - Write code in Monaco Editor
   - Switch languages
   - Run and submit code

5. **MCQ Practice**
   - Configure quiz settings
   - Take timed quizzes
   - View results

6. **Progress Analytics**
   - View charts and statistics
   - Check topic performance
   - Review weekly activity

7. **Profile & Settings**
   - Update profile
   - Change password
   - Modify preferences

## Database Models

### User
- name, email, password, avatar, createdAt

### CodingProblem
- title, description, topic, difficulty, examples, constraints, testCases

### Submission
- userId, problemId, language, code, status, runtime, memory

### MCQQuestion
- question, options, correctAnswer, explanation, topic, difficulty

### QuizAttempt
- userId, topic, difficulty, questions, score, accuracy, timeTaken

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Problems
- GET /api/problems
- GET /api/problems/:id

### Submissions
- POST /api/submissions
- GET /api/submissions

### MCQs
- GET /api/mcqs

### Quizzes
- POST /api/quizzes
- GET /api/quizzes/history

### Dashboard
- GET /api/dashboard

### Progress
- GET /api/progress

### Users
- PUT /api/users/profile
- PUT /api/users/password

## Support

For issues or questions, refer to the main README.md file.
