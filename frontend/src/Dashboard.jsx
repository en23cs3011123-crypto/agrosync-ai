import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API_BASE = "http://localhost:5000/api";

function Dashboard() {
  const navigate = useNavigate();

  // 1. Current User State (validated from localStorage)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // 2. Crops List State (with clean initial demo data)
  const [crops, setCrops] = useState([
    {
      id: "1",
      name: "Wheat (Sharbati)",
      quantity: 50,
      price: 2850,
      location: "Indore, MP",
      aiAdvice: "High procurement demand. Recommended to sell within 2 weeks.",
    },
    {
      id: "2",
      name: "Soybean (JS-335)",
      quantity: 35,
      price: 4800,
      location: "Ujjain, MP",
      aiAdvice: "Oil mills actively buying. Current spot rates are favorable.",
    },
    {
      id: "3",
      name: "Mustard",
      quantity: 20,
      price: 5650,
      location: "Kota, Rajasthan",
      aiAdvice: "Peak seasonal demand. Edible oil market sentiment is bullish.",
    },
  ]);

  // 3. Add Crop Form Inputs
  const [cropName, setCropName] = useState("Wheat (Sharbati)");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  // 4. Live Krishi Mausam (Weather) & AI Advisory State
  const [selectedCity, setSelectedCity] = useState("Indore");
  const [weather, setWeather] = useState({
    city: "Indore, MP",
    temp: 29,
    condition: "Sunny & Dry",
    icon: "☀️",
    humidity: "38%",
    wind: "12 km/h",
    rainChance: "5%",
    airQuality: "Good (AQI 65)",
    aiAdvisory: "☀️ Dry & sunny weather prevailing. Ideal 48-hour window for crop harvesting, grain threshing, and open-air drying.",
    forecast: [
      { day: "Today", temp: "29°C / 16°C", icon: "☀️", condition: "Sunny", advice: "Ideal for harvest & transport" },
      { day: "Tomorrow", temp: "28°C / 16°C", icon: "🌤️", condition: "Clear", advice: "Safe for field spraying" },
      { day: "Day After", temp: "27°C / 17°C", icon: "⛅", condition: "Partly Cloudy", advice: "Light morning irrigation" },
    ],
  });

  // 5. Interactive Kisan AI Assistant State
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("Namaste! Click a quick prompt below or type any crop, weather, or price question.");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Weather Fetch Function
  const fetchWeather = (city) => {
    setSelectedCity(city);
    fetch(`${API_BASE}/ai/weather?city=${city}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setWeather(data.data);
        }
      })
      .catch(() => {
        const fallbacks = {
          Indore: {
            city: "Indore, MP",
            temp: 29,
            condition: "Sunny & Dry",
            icon: "☀️",
            humidity: "38%",
            wind: "12 km/h",
            rainChance: "5%",
            airQuality: "Good (AQI 65)",
            aiAdvisory: "☀️ Dry & sunny weather prevailing. Ideal 48-hour window for crop harvesting, grain threshing, and open-air drying.",
            forecast: [
              { day: "Today", temp: "29°C / 16°C", icon: "☀️", condition: "Sunny", advice: "Ideal for harvest & transport" },
              { day: "Tomorrow", temp: "28°C / 16°C", icon: "🌤️", condition: "Clear", advice: "Safe for field spraying" },
              { day: "Day After", temp: "27°C / 17°C", icon: "⛅", condition: "Partly Cloudy", advice: "Light morning irrigation" },
            ],
          },
          Bhopal: {
            city: "Bhopal, MP",
            temp: 28,
            condition: "Clear Sky",
            icon: "🌤️",
            humidity: "44%",
            wind: "14 km/h",
            rainChance: "10%",
            airQuality: "Moderate (AQI 78)",
            aiAdvisory: "🌤️ Mild climate with low humidity. Favorable for winter Rabi crop sowing and scheduled light irrigation.",
            forecast: [
              { day: "Today", temp: "28°C / 15°C", icon: "🌤️", condition: "Clear", advice: "Suitable for field prep" },
              { day: "Tomorrow", temp: "27°C / 16°C", icon: "☀️", condition: "Sunny", advice: "Best for pesticide spray" },
              { day: "Day After", temp: "26°C / 15°C", icon: "⛅", condition: "Passing Clouds", advice: "Optimal soil moisture" },
            ],
          },
          Ujjain: {
            city: "Ujjain, MP",
            temp: 30,
            condition: "Sunny & Warm",
            icon: "☀️",
            humidity: "35%",
            wind: "11 km/h",
            rainChance: "0%",
            airQuality: "Good (AQI 58)",
            aiAdvisory: "🌾 Zero precipitation risk. Perfect for transporting harvest to APMC mandis without moisture damage.",
            forecast: [
              { day: "Today", temp: "30°C / 17°C", icon: "☀️", condition: "Sunny", advice: "Mandi transit safe" },
              { day: "Tomorrow", temp: "29°C / 17°C", icon: "☀️", condition: "Clear", advice: "Threshing recommended" },
              { day: "Day After", temp: "28°C / 16°C", icon: "🌤️", condition: "Pleasant", advice: "Field tillage" },
            ],
          },
          Jaipur: {
            city: "Jaipur, Rajasthan",
            temp: 27,
            condition: "Dry & Crisp",
            icon: "☀️",
            humidity: "32%",
            wind: "10 km/h",
            rainChance: "0%",
            airQuality: "Moderate (AQI 85)",
            aiAdvisory: "☀️ Dry winds observed. Light morning irrigation recommended for Mustard and Gram (Chana) fields.",
            forecast: [
              { day: "Today", temp: "27°C / 14°C", icon: "☀️", condition: "Sunny", advice: "Light canal irrigation" },
              { day: "Tomorrow", temp: "26°C / 13°C", icon: "🌤️", condition: "Clear", advice: "Weeding and hoing" },
              { day: "Day After", temp: "26°C / 14°C", icon: "☀️", condition: "Sunny", advice: "Apply micronutrients" },
            ],
          },
          Kota: {
            city: "Kota, Rajasthan",
            temp: 29,
            condition: "Sunny",
            icon: "☀️",
            humidity: "36%",
            wind: "13 km/h",
            rainChance: "5%",
            airQuality: "Good (AQI 60)",
            aiAdvisory: "🌱 Low humidity and bright sunshine. Excellent conditions for soybean crushing and mandi deliveries.",
            forecast: [
              { day: "Today", temp: "29°C / 16°C", icon: "☀️", condition: "Sunny", advice: "Direct loading safe" },
              { day: "Tomorrow", temp: "28°C / 15°C", icon: "🌤️", condition: "Clear", advice: "Seed storage checks" },
              { day: "Day After", temp: "27°C / 15°C", icon: "☀️", condition: "Sunny", advice: "Irrigation cycle" },
            ],
          },
        };
        if (fallbacks[city]) {
          setWeather(fallbacks[city]);
        }
      });
  };

  // AI Assistant Ask Function
  const handleAskAi = async (customQ) => {
    const q = customQ || aiQuestion;
    if (!q || !q.trim()) return;
    setIsAiLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAiAnswer(data.answer);
      }
    } catch {
      const lq = q.toLowerCase();
      if (lq.includes("wheat") || lq.includes("rate") || lq.includes("price") || lq.includes("bhav")) {
        setAiAnswer("🌾 Wheat rates in Central mandis are strong at ₹2,800-₹2,950/Qtl (well above MSP ₹2,275). Recommended selling window: next 10-14 days.");
      } else if (lq.includes("fertilizer") || lq.includes("khad")) {
        setAiAnswer("🧪 Maintain 4:2:1 N:P:K ratio. Apply Zinc Sulfate (25 kg/ha) during basal dressing for higher grain yield.");
      } else if (lq.includes("pest") || lq.includes("keeda")) {
        setAiAnswer("🐛 For aphid and pod borer control, spray Neem-based oil (1500 ppm) or Bio-fungicides during dry morning hours.");
      } else {
        setAiAnswer("🚜 AgroSync AI Advisory: Direct procurement orders from flour mills are active. List your harvest on the dashboard to receive direct buyer bids!");
      }
    } finally {
      setIsAiLoading(false);
      if (!customQ) setAiQuestion("");
    }
  };

  // 6. Load User Session and Fetch Crops
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) {
      alert("⚠️ Access Restricted: Please login or register first to access your personalized Farmer Dashboard!");
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (err) {
      console.error("Session parse error", err);
      navigate("/login");
      return;
    }

    // Try fetching from Express Backend
    fetch(`${API_BASE}/crops`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setCrops(data.data);
        }
      })
      .catch(() => {
        // Backend offline fallback - keep local data
      });

    // Initial weather fetch
    fetchWeather("Indore");
  }, [navigate]);

  // 7. Logout Function
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Helper: Crop-specific dynamic AI market insights
  const getAiAdvice = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("wheat")) {
      return "AI Market Trend: Bullish (+4.2%). Recommended MSP benchmark is ₹2,275/Qtl. Best selling window: Next 10 days.";
    }
    if (n.includes("soybean")) {
      return "AI Market Trend: High spot demand from regional oil extraction mills. Expected price band ₹4,700 - ₹5,100.";
    }
    if (n.includes("mustard")) {
      return "AI Market Trend: Seasonal peak demand. Wholesale prices steady across North & Central mandis.";
    }
    if (n.includes("cotton")) {
      return "AI Market Trend: Textile mill inquiries up 12%. Maintain moisture under 8% for grade-A premium.";
    }
    if (n.includes("chickpea") || n.includes("chana")) {
      return "AI Market Trend: Government buffer procurement active. Wholesale rates stabilizing above MSP.";
    }
    if (n.includes("paddy") || n.includes("rice")) {
      return "AI Market Trend: Basmati export demand strong. Milling orders active for immediate delivery.";
    }
    return "AI Market Trend: Balanced supply-demand ratio. Favorable procurement opportunity.";
  };

  // 8. Add Crop Function
  const handleAddCrop = async (e) => {
    e.preventDefault();

    if (!quantity || !price) {
      alert("Please enter both Quantity and Price!");
      return;
    }

    const advice = getAiAdvice(cropName);

    const newCrop = {
      id: String(Date.now()),
      name: cropName,
      quantity: Number(quantity),
      price: Number(price),
      location: location.trim() || user.location || "Madhya Pradesh, India",
      aiAdvice: advice,
    };

    // Try saving to Backend MongoDB
    try {
      await fetch(`${API_BASE}/crops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCrop),
      });
    } catch {
      // Backend offline: continue with local state
    }

    // Add to state
    setCrops([newCrop, ...crops]);

    // Reset Form
    setQuantity("");
    setPrice("");
    setLocation("");
    alert("New crop successfully listed on AgroSync AI!");
  };

  // 7. Delete Crop Function
  const handleDeleteCrop = async (id) => {
    try {
      await fetch(`${API_BASE}/crops/${id}`, { method: "DELETE" });
    } catch {
      // Offline fallback
    }
    setCrops(crops.filter((c) => (c._id || c.id) !== id));
  };

  // 8. Dynamic Metrics Calculation
  const totalVolume = crops.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalValue = crops.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", background: "#f7faf7", minHeight: "80vh" }}>
        <h2>🔒 Access Restricted</h2>
        <p style={{ color: "#6b7280", margin: "12px 0 24px" }}>
          Please login or register to access your personalized Farmer Dashboard.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="primary-btn"
          style={{ padding: "10px 24px" }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="simple-dashboard">
      {/* Top Welcome Header */}
      <div className="dash-header">
        <div>
          <h2>🌾 Welcome, {user.name}!</h2>
          <p>
            AgroSync AI • {user.role === "buyer" ? "Corporate Procurement Portal" : "Farmer Management Dashboard"}
          </p>
        </div>
        <button onClick={handleLogout} className="dash-logout-btn">
          Sign Out
        </button>
      </div>

      {/* 1. Mandi Rates Live Ticker */}
      <div className="dash-mandi-ticker">
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

      {/* 2. Krishi Mausam & AI Farming Advisory Card */}
      <div className="dash-weather-box">
        <div className="weather-header">
          <div className="weather-header-left">
            <h3>🌤️ Real-Time Krishi Mausam & AI Advisory</h3>
            <p>Live regional weather forecast, soil humidity, and AI agronomy guidance</p>
          </div>
          <select
            value={selectedCity}
            onChange={(e) => fetchWeather(e.target.value)}
            className="weather-city-select"
          >
            <option value="Indore">Indore (Madhya Pradesh)</option>
            <option value="Bhopal">Bhopal (Madhya Pradesh)</option>
            <option value="Ujjain">Ujjain (Madhya Pradesh)</option>
            <option value="Jaipur">Jaipur (Rajasthan)</option>
            <option value="Kota">Kota (Rajasthan)</option>
          </select>
        </div>

        {/* Current Weather Grid */}
        <div className="weather-current-grid">
          <div className="weather-temp-main">
            <span className="weather-icon-large">{weather.icon}</span>
            <div>
              <h2>{weather.temp}°C</h2>
              <span>{weather.condition} • {weather.city}</span>
            </div>
          </div>

          <div className="weather-metrics-row">
            <div className="weather-metric-pill">
              <span>💧 Humidity</span>
              <strong>{weather.humidity}</strong>
            </div>
            <div className="weather-metric-pill">
              <span>💨 Wind Speed</span>
              <strong>{weather.wind}</strong>
            </div>
            <div className="weather-metric-pill">
              <span>🌧️ Rain Chance</span>
              <strong>{weather.rainChance}</strong>
            </div>
            <div className="weather-metric-pill">
              <span>🍃 Air Quality</span>
              <strong>{weather.airQuality}</strong>
            </div>
          </div>
        </div>

        {/* AI Agronomy Alert Banner */}
        <div className="weather-ai-alert">
          💡 <strong>AI Farming Alert:</strong> {weather.aiAdvisory}
        </div>

        {/* 3-Day Forecast */}
        <div className="weather-forecast-list">
          {weather.forecast &&
            weather.forecast.map((f, idx) => (
              <div key={idx} className="forecast-card">
                <div className="forecast-card-top">
                  <strong>{f.day}</strong>
                  <span>{f.icon}</span>
                </div>
                <div className="forecast-temp">{f.temp}</div>
                <div className="forecast-action">🚜 {f.advice}</div>
              </div>
            ))}
        </div>
      </div>

      {/* 3. Four Summary Stats Cards */}
      <div className="dash-stats">
        <div className="dash-stat-box">
          <span>Total Listed Batches</span>
          <h3>{crops.length} Batches</h3>
        </div>

        <div className="dash-stat-box">
          <span>Total Harvest Volume</span>
          <h3>{totalVolume} Quintals</h3>
        </div>

        <div className="dash-stat-box">
          <span>Estimated Value</span>
          <h3>₹{totalValue.toLocaleString("en-IN")}</h3>
        </div>

        <div className="dash-stat-box">
          <span>AI Market Sentiment</span>
          <h3 className="trend-green">Bullish (↑ 6%)</h3>
        </div>
      </div>

      {/* 4. Main Grid: Form & Assistant (Left), Listings (Right) */}
      <div className="dash-content">
        {/* Left Column */}
        <div className="dash-left-column">
          {/* Add Crop Form */}
          <div className="dash-form-box">
            <h3>➕ Add New Crop Batch</h3>
            <p className="form-subtitle">List your produce to receive AI price guidance and buyer bids</p>

            <form onSubmit={handleAddCrop}>
              <div className="input-group">
                <label>Crop Variety</label>
                <select value={cropName} onChange={(e) => setCropName(e.target.value)}>
                  <option value="Wheat (Sharbati)">Wheat (Sharbati)</option>
                  <option value="Wheat (Lokwan)">Wheat (Lokwan)</option>
                  <option value="Soybean (JS-335)">Soybean (JS-335)</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Chickpeas / Chana">Chickpeas / Chana</option>
                  <option value="Cotton (Medium Staple)">Cotton (Medium Staple)</option>
                  <option value="Paddy / Rice (Basmati)">Paddy / Rice (Basmati)</option>
                </select>
              </div>

              <div className="input-group">
                <label>Quantity (in Quintals)</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Target Price (₹ per Quintal)</label>
                <input
                  type="number"
                  placeholder="e.g. 2900"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Location / Farm Yard</label>
                <input
                  type="text"
                  placeholder="e.g. Indore, Madhya Pradesh"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <button type="submit" className="add-crop-submit-btn">
                List Crop & Get AI Insights
              </button>
            </form>
          </div>

          {/* Kisan AI Assistant Box */}
          <div className="dash-ai-assistant-box">
            <h3>🤖 Kisan AI Assistant</h3>
            <p className="form-subtitle">Instant answers for crop rates, pest remedies, & fertilizers</p>

            <div className="quick-prompts-row">
              <button
                type="button"
                className="quick-prompt-btn"
                onClick={() => handleAskAi("Wheat price trend")}
              >
                🌾 Wheat Rate Trend
              </button>
              <button
                type="button"
                className="quick-prompt-btn"
                onClick={() => handleAskAi("Fertilizer tips")}
              >
                🧪 Fertilizer Tips
              </button>
              <button
                type="button"
                className="quick-prompt-btn"
                onClick={() => handleAskAi("Pest control")}
              >
                🐛 Pest Remedy
              </button>
              <button
                type="button"
                className="quick-prompt-btn"
                onClick={() => handleAskAi("Direct procurement")}
              >
                🚜 Bulk Buyer Bids
              </button>
            </div>

            <div className="ai-answer-card">
              {isAiLoading ? (
                <span>Thinking... Analyzing agricultural dataset...</span>
              ) : (
                aiAnswer
              )}
            </div>

            <div className="ai-ask-input-row">
              <input
                type="text"
                placeholder="Ask Kisan AI anything..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAi()}
              />
              <button type="button" onClick={() => handleAskAi()}>
                Ask
              </button>
            </div>
          </div>
        </div>

        {/* Right: Active Crop Listings */}
        <div className="dash-table-box">
          <h3>🌱 Your Active Crop Listings ({crops.length})</h3>
          <p className="form-subtitle">Manage your inventory, review AI recommendations, and track orders</p>

          <div className="crop-cards-list">
            {crops.map((crop) => {
              const cropId = crop._id || crop.id;
              return (
                <div key={cropId} className="crop-item-card">
                  <div className="crop-item-header">
                    <h4>{crop.name}</h4>
                    <span className="badge-available">Available</span>
                  </div>

                  <div className="crop-item-body">
                    <p><strong>Quantity:</strong> {crop.quantity} Quintals</p>
                    <p><strong>Target Rate:</strong> ₹{crop.price} / Qtl</p>
                    <p><strong>Location:</strong> {crop.location || "Madhya Pradesh"}</p>
                  </div>

                  <div className="crop-ai-insight">
                    🤖 <strong>AI Advice:</strong> {crop.aiAdvice || getAiAdvice(crop.name)}
                  </div>

                  <div className="crop-item-footer">
                    <button
                      type="button"
                      className="btn-delete-crop"
                      onClick={() => handleDeleteCrop(cropId)}
                    >
                      🗑️ Remove Batch
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

