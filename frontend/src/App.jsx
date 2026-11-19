import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import "./App.css";

// 1. Landing Page (Aapka pehle wala Hero + Features)
function Home() {
  return (
    <>
      {/* Live Mandi Ticker Ribbon */}
      <div className="dash-mandi-ticker" style={{ borderRadius: 0, margin: 0, padding: "9px 8%" }}>
        <div className="mandi-ticker-label">
          <span className="live-dot"></span> Live Mandi Rates
        </div>
        <div className="mandi-ticker-items">
          <div className="ticker-item">
            <span>🌾 Wheat (Sharbati):</span>
            <span className="ticker-rate">₹2,850/Qtl</span>
            <span className="ticker-change">↑ 4.2%</span>
          </div>
          <div className="ticker-item">
            <span>🌱 Soybean (JS-335):</span>
            <span className="ticker-rate">₹4,800/Qtl</span>
            <span className="ticker-change">↑ 2.8%</span>
          </div>
          <div className="ticker-item">
            <span>🌼 Mustard:</span>
            <span className="ticker-rate">₹5,650/Qtl</span>
            <span className="ticker-change">↑ 5.1%</span>
          </div>
          <div className="ticker-item">
            <span>🌸 Cotton:</span>
            <span className="ticker-rate">₹6,200/Qtl</span>
            <span className="ticker-change">↔ 0.0%</span>
          </div>
          <div className="ticker-item">
            <span>🌿 Chana (Gram):</span>
            <span className="ticker-rate">₹5,400/Qtl</span>
            <span className="ticker-change">↑ 1.5%</span>
          </div>
          <div className="ticker-item">
            <span>🍚 Basmati Rice:</span>
            <span className="ticker-rate">₹3,450/Qtl</span>
            <span className="ticker-change">↑ 3.2%</span>
          </div>
        </div>
      </div>

      <main className="hero" id="home">
        <div className="hero-content">
          <p className="tag">AI-Powered Agriculture Platform</p>

          <h1>
            Smart Farming.
            <br />
            Better Procurement.
          </h1>

          <p className="hero-text">
            AgroSync AI helps farmers manage crop information,
            understand procurement opportunities, and receive
            AI-powered agricultural insights.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Get Started
            </Link>

            <a href="#features" className="secondary-btn">
              Explore Features
            </a>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-icon">🌱</div>

          <h2>AI Agriculture Insights</h2>

          <p>
            Analyze crop data and get smart predictions
            for better farming decisions.
          </p>

          <div className="stats">
            <div>
              <strong>24/7</strong>
              <span>AI Support</span>
            </div>

            <div>
              <strong>Smart</strong>
              <span>Insights</span>
            </div>
          </div>
        </div>
      </main>

      <section className="features" id="features">
        <h2>How AgroSync AI Helps</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🌾</div>
            <h3>Farmer Management</h3>
            <p>
              Manage farmer profiles and agricultural produce listings in real-time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌾</div>
            <h3>Direct Procurement</h3>
            <p>
              Connect verified farmers directly with corporate bulk buyers and mills without middlemen.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Predictions & Advisory</h3>
            <p>
              AI-driven mandi price forecasts, MSP benchmarks, and seasonal agronomy insights.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌤️</div>
            <h3>Krishi Mausam & Weather AI</h3>
            <p>
              Hyperlocal agricultural weather forecasting with real-time agronomic alerts for harvesting and irrigation.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="features" id="about" style={{ background: "#f0fdf4", borderTop: "1px solid #e5e7eb" }}>
        <h2>About AgroSync AI</h2>
        <div style={{ maxWidth: "750px", margin: "0 auto", textAlign: "center", color: "#4b5563", fontSize: "16px", lineHeight: "1.8" }}>
          <p>
            <strong>AgroSync AI</strong> is a modern agricultural management and direct procurement ecosystem. It empowers farmers with real-time market insights, fair price discovery, and transparent connections to corporate procurement buyers.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col brand-col">
            <h3>🌾 AgroSync AI</h3>
            <p>Empowering Indian agriculture with AI-driven market intelligence and direct procurement deals.</p>
            <div className="footer-helpline">
              📞 Kisan Helpline: <strong>1800-180-1551</strong> (Toll Free)
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Navigation</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><a href="#features">Platform Features</a></li>
              <li><a href="#about">About AgroSync</a></li>
              <li><Link to="/dashboard">Farmer Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get Started</h4>
            <ul>
              <li><Link to="/login">Farmer / Buyer Login</Link></li>
              <li><Link to="/register">Create New Account</Link></li>
              <li><Link to="/dashboard">Check Mandi Rates</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AgroSync AI Platform. Built with dedication for Indian Agriculture.</p>
        </div>
      </footer>
    </>
  );
}

// 2. Dynamic Navigation Bar (Checks Login Status)
function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2>🌾 AgroSync AI</h2>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <a href="/#features">Features</a>
        <a href="/#about">About</a>

        {currentUser ? (
          <>
            <Link to="/dashboard" style={{ fontWeight: "700", color: "#166534" }}>
              📊 Dashboard
            </Link>
            <span style={{ fontSize: "14px", color: "#374151", fontWeight: "600", padding: "0 6px" }}>
              👤 {currentUser.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                border: "1px solid #fca5a5",
                padding: "7px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Dashboard</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// 3. Protected Route Component
function ProtectedRoute({ children }) {
  const user = localStorage.getItem("currentUser");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// 4. Main App
function App() {
  return (
    <Router>
      <div className="app">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;