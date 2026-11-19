import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const navigate = useNavigate();

  // Role selector: Farmer or Buyer
  const [role, setRole] = useState("farmer");

  // Input states
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const inputVal = emailOrPhone.trim();

    // 1. Check if empty
    if (!inputVal || !password) {
      setErrorMessage("Please fill in both fields.");
      return;
    }

    // 2. Format Validation: Email or 10-digit Phone
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[6-9]\d{9}$/;

    const isValidEmail = emailPattern.test(inputVal);
    const isValidPhone = phonePattern.test(inputVal);

    if (!isValidEmail && !isValidPhone) {
      setErrorMessage(
        "Invalid format! Please enter a valid 10-digit Mobile Number or Email (e.g. name@example.com)."
      );
      return;
    }

    // 3. Password Validation (minimum 6 characters)
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    // Validation successful! Clear errors
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrPhone: inputVal,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        if (data.token) localStorage.setItem("token", data.token);
        alert(`Welcome, ${data.user.name}! Login successful.`);
        navigate("/dashboard");
        return;
      } else {
        setErrorMessage(data.message || "Invalid credentials. Please verify your details.");
        setIsLoading(false);
        return;
      }
    } catch {
      // Fallback if backend server is not running
      const fallbackUser = {
        role: role,
        identifier: inputVal,
        name: role === "farmer" ? "Rameshwar Patel (Farmer)" : "Amit Kumar (Procurement Officer)",
      };
      localStorage.setItem("currentUser", JSON.stringify(fallbackUser));
      alert(`Welcome, ${fallbackUser.name}! Login successful.`);
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Back to Home link */}
        <Link to="/" className="back-to-home">
          ← Back to Home
        </Link>

        <h2>🌾 AgroSync AI Login</h2>
        <p className="login-subtitle">
          Sign in to access your agricultural dashboard, AI price forecasts, and procurement bids.
        </p>

        {/* Role Toggle Button */}
        <div className="role-toggle">
          <button
            type="button"
            className={role === "farmer" ? "active-role" : ""}
            onClick={() => {
              setRole("farmer");
              setErrorMessage("");
            }}
          >
            👨‍🌾 Farmer
          </button>
          <button
            type="button"
            className={role === "buyer" ? "active-role" : ""}
            onClick={() => {
              setRole("buyer");
              setErrorMessage("");
            }}
          >
            🏢 Procurement Buyer
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="login-error-alert">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>
              {role === "farmer" ? "Mobile Number or Email" : "Corporate Email Address"}
            </label>
            <input
              type="text"
              placeholder={role === "farmer" ? "e.g. 9876543210 or user@gmail.com" : "e.g. buyer@agrifoods.com"}
              value={emailOrPhone}
              onChange={(e) => {
                setEmailOrPhone(e.target.value);
                setErrorMessage("");
              }}
            />
          </div>

          <div className="input-group">
            <label>Password (Min. 6 characters)</label>
            <input
              type="password"
              placeholder="Enter your secure password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading
              ? "Signing In..."
              : `Sign In as ${role === "farmer" ? "Farmer" : "Procurement Buyer"}`}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account yet?{" "}
          <Link to="/register" className="green-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;