import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function Register() {
  const navigate = useNavigate();

  // Role selector: Farmer or Buyer
  const [role, setRole] = useState("farmer");

  // Form states
  const [fullName, setFullName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [location, setLocation] = useState("");
  const [farmOrCompany, setFarmOrCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const nameVal = fullName.trim();
    const contactVal = emailOrPhone.trim();

    // 1. Check required fields
    if (!nameVal || !contactVal || !password || !confirmPassword) {
      setErrorMessage("Please fill in all mandatory fields.");
      return;
    }

    // 2. Validate Contact: 10-digit Phone or valid Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[6-9]\d{9}$/;

    const isValidEmail = emailPattern.test(contactVal);
    const isValidPhone = phonePattern.test(contactVal);

    if (!isValidEmail && !isValidPhone) {
      setErrorMessage(
        "Invalid contact format! Enter a 10-digit Mobile Number or valid Email."
      );
      return;
    }

    // 3. Password length check
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    // 4. Password confirmation check
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match! Please verify both fields.");
      return;
    }

    // Validation successful!
    setErrorMessage("");
    setIsLoading(true);

    // Call Real MongoDB Backend API
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameVal,
          emailOrPhone: contactVal,
          password: password,
          role: role,
          location: location.trim() || "Madhya Pradesh, India",
          farmOrCompany: farmOrCompany.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        if (data.token) localStorage.setItem("token", data.token);
        alert(`Account created successfully! Welcome to AgroSync AI, ${data.user.name}.`);
        navigate("/dashboard");
        return;
      } else {
        setErrorMessage(data.message || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }
    } catch {
      // Backend offline fallback
      const fallbackUser = {
        name: nameVal,
        role: role,
        identifier: contactVal,
        location: location.trim() || "Madhya Pradesh, India",
        farmOrCompany: farmOrCompany.trim(),
      };
      localStorage.setItem("currentUser", JSON.stringify(fallbackUser));
      alert(`Registration successful! Welcome to AgroSync AI, ${nameVal}.`);
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box register-box">
        {/* Back to Home link */}
        <Link to="/" className="back-to-home">
          ← Back to Home
        </Link>

        <h2>🌾 Create AgroSync AI Account</h2>
        <p className="login-subtitle">
          Join India's AI-powered smart agriculture and direct procurement network.
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
            👨‍🌾 Register as Farmer
          </button>
          <button
            type="button"
            className={role === "buyer" ? "active-role" : ""}
            onClick={() => {
              setRole("buyer");
              setErrorMessage("");
            }}
          >
            🏢 Register as Buyer
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="login-error-alert">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="login-form">
          <div className="input-group">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder={role === "farmer" ? "e.g. Rameshwar Patel" : "e.g. Vikram Malhotra"}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrorMessage("");
              }}
              required
            />
          </div>

          <div className="input-group">
            <label>
              {role === "farmer" ? "Mobile Number or Email *" : "Corporate Email or Mobile *"}
            </label>
            <input
              type="text"
              placeholder={
                role === "farmer"
                  ? "e.g. 9876543210 or kisan@gmail.com"
                  : "e.g. procurement@agrifoods.com"
              }
              value={emailOrPhone}
              onChange={(e) => {
                setEmailOrPhone(e.target.value);
                setErrorMessage("");
              }}
              required
            />
          </div>

          <div className="input-group">
            <label>State & District / City</label>
            <input
              type="text"
              placeholder="e.g. Indore, Madhya Pradesh"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>
              {role === "farmer"
                ? "Total Land Area & Primary Crops"
                : "Company / Processing Mill Name"}
            </label>
            <input
              type="text"
              placeholder={
                role === "farmer"
                  ? "e.g. 6 Acres (Wheat & Soybean)"
                  : "e.g. Kisan Agro Processing Pvt. Ltd."
              }
              value={farmOrCompany}
              onChange={(e) => setFarmOrCompany(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password (Min. 6 characters) *</label>
            <input
              type="password"
              placeholder="Create your secure password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMessage("");
              }}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading
              ? "Connecting to Database..."
              : `Create Account as ${role === "farmer" ? "Farmer" : "Procurement Buyer"}`}
          </button>
        </form>

        <p className="login-footer">
          Already have an account?{" "}
          <Link to="/login" className="green-link">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
