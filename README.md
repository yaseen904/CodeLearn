# CodeLearn - Full-Stack E-Learning Platform

A complete coding practice and e-learning platform for students preparing for technical interviews and placements.

## Features

- **User Authentication**: Registration, login, and JWT-based authentication
- **Coding Practice**: 20+ coding problems with filters by topic and difficulty
- **Code Editor**: Monaco Editor integration with support for Java, C++, Python, and JavaScript
- **MCQ System**: 40+ multiple choice questions across various topics
- **AI-Powered MCQ Generation**: Generate custom MCQs using Google Gemini API
- **Quiz System**: Timed quizzes with instant feedback and detailed results
- **Progress Tracking**: Comprehensive analytics and performance visualization
- **User Profile**: Profile management and settings
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- Monaco Editor
- Recharts
- CSS (custom dark theme)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (installed and running)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd "Code Learn"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codelearn
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Seed the Database

```bash
cd backend
npm run seed
```

This will populate the database with 20 coding problems and 40 MCQ questions.

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows
net start MongoDB

# On Mac/Linux
sudo systemctl start mongod
# or
mongod
```

### Start Backend

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Click "Get Started" to register a new account
3. Fill in your details and create an account
4. Login with your credentials
5. Explore the dashboard and start practicing!

## Features Overview

### Landing Page
- Modern hero section with code editor preview
- Feature highlights
- Statistics section
- Professional dark theme

### Dashboard
- Welcome message with streak counter
- Statistics cards (problems solved, accuracy, quizzes)
- Learning progress visualization
- Recent activity timeline
- Recommended practice problems
- Daily challenge card

### Coding Practice
- Problem listing with filters (topic, difficulty, search)
- Problem cards with acceptance rates
- Difficulty badges (Easy, Medium, Hard)
- Session progress tracking

### Coding Problem Page
- Problem description with examples and constraints
- Monaco code editor with syntax highlighting
- Language selector (Java, C++, Python, JavaScript)
- Run and Submit buttons
- Test case results display

### MCQ Practice
- Topic and difficulty selection
- Configurable question count
- Quiz features overview
- **AI-powered MCQ generation** (optional feature)

### Quiz System
- Timed quizzes with countdown timer
- Question navigation
- Progress tracking
- Submit and review functionality

### Quiz Results
- Score and accuracy display
- Performance breakdown (correct, incorrect, unanswered)
- Answer review with explanations
- Retry option

### Progress & Analytics
- Overall statistics
- Weekly activity chart
- Topic-wise performance
- Difficulty distribution
- Recent submissions and quizzes

### Profile
- Profile information management
- Avatar upload (via URL)
- Learning statistics
- Skills visualization
- Account details

### Settings
- Password change
- Theme preference
- Notification settings
- Logout functionality

## Project Structure

```
Code Learn/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── CodingProblem.js
│   │   ├── Submission.js
│   │   ├── MCQQuestion.js
│   │   └── QuizAttempt.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── problems.js
│   │   ├── submissions.js
│   │   ├── mcqs.js
│   │   ├── quizzes.js
│   │   ├── dashboard.js
│   │   ├── progress.js
│   │   └── users.js
│   ├── seed/
│   │   └── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ProblemCard.jsx
│   │   │   ├── MCQCard.jsx
│   │   │   ├── QuizTimer.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CodingPractice.jsx
│   │   │   ├── CodingProblem.jsx
│   │   │   ├── SubmissionResult.jsx
│   │   │   ├── MCQPractice.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── QuizResult.jsx
│   │   │   ├── Progress.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Problems
- `GET /api/problems` - Get all problems (with filters)
- `GET /api/problems/:id` - Get specific problem

### Submissions
- `POST /api/submissions` - Submit code
- `GET /api/submissions` - Get user submissions

### MCQs
- `GET /api/mcqs` - Get MCQ questions (with filters)
- `POST /api/mcq/generate` - Generate MCQs using AI (requires GEMINI_API_KEY)

### Quizzes
- `POST /api/quizzes` - Submit quiz attempt
- `GET /api/quizzes/history` - Get quiz history

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Progress
- `GET /api/progress` - Get progress analytics

### Users
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password

## Design System

The application uses a premium dark developer theme:

- **Background**: Deep navy (#0a0e1a)
- **Cards**: Dark blue-gray (#1e293b)
- **Primary Accent**: Purple/Indigo (#6366f1)
- **Secondary Accent**: Violet (#8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)
- **Info**: Blue (#3b82f6)

## AI-Powered MCQ Generation

The application includes integration with Google Gemini API for generating custom MCQs:

### Setup

1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add `GEMINI_API_KEY=your_key_here` to `backend/.env`
3. The backend will automatically use Gemini when you call the generation endpoint

### Usage

```bash
POST /api/mcq/generate
Content-Type: application/json

{
  "topic": "DSA",
  "difficulty": "Medium",
  "count": 10
}
```

**Response:**
```json
{
  "message": "Successfully generated 10 MCQs for DSA",
  "questions": [
    {
      "question": "What is the time complexity of binary search?",
      "options": ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
      "correctAnswer": 1,
      "explanation": "Binary search halves the search space each iteration...",
      "topic": "DSA",
      "difficulty": "Medium"
    }
  ]
}
```

### Features

- Generates exactly the requested number of questions
- Each question has exactly 4 options
- Includes correct answer index and explanation
- Automatically saves generated questions to database
- Validates input parameters
- Graceful error handling

**Note:** This feature is optional. The application works perfectly without it using the pre-seeded questions.

## Future Enhancements

- Real code execution using Judge0 or similar service
- More coding problems and MCQ questions
- Leaderboard system
- Discussion forums
- Video tutorials integration
- Certificate generation
- Social sharing features

## License

This project is for educational purposes.

## Support

For issues or questions, please refer to the code documentation or create an issue in the repository.
