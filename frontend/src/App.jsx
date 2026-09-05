import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CodingPractice from './pages/CodingPractice';
import CodingProblem from './pages/CodingProblem';
import SubmissionResult from './pages/SubmissionResult';
import MCQPractice from './pages/MCQPractice';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';


// ======================================================
// PROTECTED ROUTE
// ======================================================

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  return user
    ? children
    : <Navigate to="/login" />;
};


// ======================================================
// PUBLIC ROUTE
// ======================================================

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  return !user
    ? children
    : <Navigate to="/dashboard" />;
};


// ======================================================
// LAYOUT
// ======================================================

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="app-layout">

      {user && <Sidebar />}

      <div className="main-content">

        {user && <Navbar />}

        {children}

      </div>

    </div>
  );
};


// ======================================================
// APP
// ======================================================

function App() {

  return (
    <AuthProvider>

      <Router>

        <Routes>


          {/* ==================================================
              PUBLIC ROUTES
          ================================================== */}

          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />


          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />


          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />


          {/* ==================================================
              DASHBOARD
          ================================================== */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              CODING PRACTICE
          ================================================== */}

          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <Layout>
                  <CodingPractice />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              NORMAL CODING PROBLEM
          ================================================== */}

          <Route
            path="/problem/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <CodingProblem />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              AI GENERATED CODING PROBLEM
          ================================================== */}

          <Route
            path="/coding-problem/ai"
            element={
              <ProtectedRoute>
                <Layout>
                  <CodingProblem />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              SUBMISSION RESULT
          ================================================== */}

          <Route
            path="/submission/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <SubmissionResult />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              MCQ PRACTICE
          ================================================== */}

          <Route
            path="/mcq"
            element={
              <ProtectedRoute>
                <Layout>
                  <MCQPractice />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              QUIZ
          ================================================== */}

          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Layout>
                  <Quiz />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              QUIZ RESULT
          ================================================== */}

          <Route
            path="/quiz-result/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <QuizResult />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              PROGRESS
          ================================================== */}

          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Layout>
                  <Progress />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              PROFILE
          ================================================== */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              SETTINGS
          ================================================== */}

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              404
          ================================================== */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </Router>

    </AuthProvider>
  );
}

export default App;