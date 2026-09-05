import mongoose from 'mongoose';

const codingProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  supportedLanguages: {
    type: [String],
    default: ['Java', 'C++', 'Python', 'JavaScript']
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  testCases: [{
    input: String,
    output: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('CodingProblem', codingProblemSchema);
