import dotenv from 'dotenv';
import mongoose from 'mongoose';
import CodingProblem from '../models/CodingProblem.js';
import MCQQuestion from '../models/MCQQuestion.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    // Remove old static coding problems
    await CodingProblem.deleteMany({});

    // Remove old static MCQ questions
    await MCQQuestion.deleteMany({});

    console.log('Old coding problems deleted');
    console.log('Old MCQ questions deleted');
    console.log('Database cleaned successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  }
};

seedDatabase();