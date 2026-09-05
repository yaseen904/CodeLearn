import { Link } from 'react-router-dom';
import Button from '../components/Button';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav className="landing-navbar">
        <div className="landing-navbar-content">
          <div className="landing-brand">CodeLearn</div>
          <div className="landing-nav-links">
            <Link to="/login" className="landing-nav-link">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Master Coding & Technical Skills</h1>
          <p className="hero-subtitle">
            Practice coding problems, test your knowledge with MCQs, and track your progress
            to ace your technical interviews and placements.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Learning
            </Link>
            <Link to="/practice" className="btn btn-outline btn-lg">
              Explore Curriculum
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="code-editor-preview">
            <div className="editor-header">
              <span className="editor-dot"></span>
              <span className="editor-dot"></span>
              <span className="editor-dot"></span>
            </div>
            <div className="editor-content">
              <div className="editor-line">
                <span className="editor-keyword">function</span>
                <span className="editor-function">solveProblem</span>
                <span className="editor-paren">(</span>
                <span className="editor-param">nums</span>
                <span className="editor-paren">, </span>
                <span className="editor-param">target</span>
                <span className="editor-paren">) {`{`}</span>
              </div>
              <div className="editor-line editor-indent">
                <span className="editor-keyword">const</span>
                <span className="editor-variable"> map </span>
                <span className="editor-operator">=</span>
                <span className="editor-keyword"> new</span>
                <span className="editor-class"> Map</span>
                <span className="editor-paren">()</span>
                <span className="editor-punctuation">;</span>
              </div>
              <div className="editor-line editor-indent">
                <span className="editor-keyword">for</span>
                <span className="editor-paren">(</span>
                <span className="editor-keyword">let</span>
                <span className="editor-variable"> i </span>
                <span className="editor-operator">=</span>
                <span className="editor-number"> 0</span>
                <span className="editor-punctuation">;</span>
                <span className="editor-variable"> i </span>
                <span className="editor-operator">&lt;</span>
                <span className="editor-variable"> nums</span>
                <span className="editor-punctuation">.</span>
                <span className="editor-property">length</span>
                <span className="editor-punctuation">;</span>
                <span className="editor-variable"> i</span>
                <span className="editor-operator">++</span>
                <span className="editor-paren">) {`{`}</span>
              </div>
              <div className="editor-line editor-indent-2">
                <span className="editor-keyword">const</span>
                <span className="editor-variable"> complement </span>
                <span className="editor-operator">=</span>
                <span className="editor-variable"> target</span>
                <span className="editor-operator"> -</span>
                <span className="editor-variable"> nums</span>
                <span className="editor-punctuation">[</span>
                <span className="editor-variable">i</span>
                <span className="editor-punctuation">]</span>
                <span className="editor-punctuation">;</span>
              </div>
              <div className="editor-line editor-indent-2">
                <span className="editor-keyword">if</span>
                <span className="editor-paren">(</span>
                <span className="editor-variable">map</span>
                <span className="editor-punctuation">.</span>
                <span className="editor-function">has</span>
                <span className="editor-paren">(</span>
                <span className="editor-variable">complement</span>
                <span className="editor-paren">)) {`{`}</span>
              </div>
              <div className="editor-line editor-indent-3">
                <span className="editor-keyword">return</span>
                <span className="editor-punctuation">[</span>
                <span className="editor-variable">map</span>
                <span className="editor-punctuation">.</span>
                <span className="editor-function">get</span>
                <span className="editor-paren">(</span>
                <span className="editor-variable">complement</span>
                <span className="editor-paren">)</span>
                <span className="editor-punctuation">,</span>
                <span className="editor-variable"> i</span>
                <span className="editor-punctuation">]</span>
                <span className="editor-punctuation">;</span>
              </div>
              <div className="editor-line editor-indent-2">
                <span className="editor-punctuation">{`}`}</span>
              </div>
              <div className="editor-line editor-indent">
                <span className="editor-variable">map</span>
                <span className="editor-punctuation">.</span>
                <span className="editor-function">set</span>
                <span className="editor-paren">(</span>
                <span className="editor-variable">nums</span>
                <span className="editor-punctuation">[</span>
                <span className="editor-variable">i</span>
                <span className="editor-punctuation">]</span>
                <span className="editor-punctuation">,</span>
                <span className="editor-variable"> i</span>
                <span className="editor-paren">)</span>
                <span className="editor-punctuation">;</span>
              </div>
              <div className="editor-line editor-indent">
                <span className="editor-punctuation">{`}`}</span>
              </div>
              <div className="editor-line">
                <span className="editor-punctuation">{`}`}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Why Choose CodeLearn?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3 className="feature-title">Interactive Coding Practice</h3>
              <p className="feature-description">
                Practice with 1000+ coding problems across various topics and difficulty levels.
                Get instant feedback on your solutions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">Knowledge Checks</h3>
              <p className="feature-description">
                Test your understanding with comprehensive MCQs covering programming fundamentals,
                data structures, algorithms, and more.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Data-Driven Analytics</h3>
              <p className="feature-description">
                Track your progress with detailed analytics. Monitor your learning streak,
                accuracy, and topic-wise performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Coding Problems</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5000+</div>
            <div className="stat-label">MCQ Questions</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Topics Covered</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100K+</div>
            <div className="stat-label">Active Learners</div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">CodeLearn</div>
          <div className="footer-links">
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Contact</a>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
          </div>
          <div className="footer-copyright">
            © 2024 CodeLearn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
