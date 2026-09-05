import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import leetcodeRoutes from './routes/leetcode.js';

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CodeLearn API Server' });
});


// ==========================================
// ROUTES
// ==========================================

import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problems.js';
import submissionRoutes from './routes/submissions.js';
import mcqRoutes from './routes/mcqs.js';
import quizRoutes from './routes/quizzes.js';
import dashboardRoutes from './routes/dashboard.js';
import progressRoutes from './routes/progress.js';
import userRoutes from './routes/users.js';
import codeExecutionRoutes from './routes/codeExecution.js';

import errorHandler from './middleware/errorHandler.js';
app.use('/api/leetcode', leetcodeRoutes);


// ==========================================
// API ROUTES
// ==========================================

app.use('/api/auth', authRoutes);

app.use('/api/problems', problemRoutes);

app.use('/api/submissions', submissionRoutes);

app.use('/api/mcqs', mcqRoutes);

app.use('/api/quizzes', quizRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.use('/api/progress', progressRoutes);

app.use('/api/users', userRoutes);


// ==========================================
// CODE EXECUTION
// ==========================================

app.use('/api/code', codeExecutionRoutes);


// ==========================================
// ERROR HANDLER
// ==========================================

app.use(errorHandler);


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

