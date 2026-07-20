import { useState } from "react";
import "../styles/weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    const token = localStorage.getItem("token");

    try {
      const headers = {};
      if (token) {
        headers.Authorization = "Bearer " + token;
      }

      const res = await fetch(
        "http://localhost:5000/api/weather?city=" + encodeURIComponent(city),
        { headers }
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Could not fetch weather.");
        setLoading(false);
        return;
      }

      setWeather(data.weather);
    } catch (err) {
      setError("Server error. Please make sure backend is running.");
    }

    setLoading(false);
  };

  return (
    <section id="weather" className="weather-section">
      <h2>🌦️ Weather-Based Farming Tips</h2>
      <p className="weather-subtitle">
        Check current weather for your area to plan irrigation, spraying, and
        harvesting.
      </p>

      <div className="weather-search">
        <input
          type="text"
          placeholder="Enter city name (e.g. Delhi)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getWeather()}
        />
        <button onClick={getWeather} disabled={loading}>
          {loading ? "Checking..." : "Get Weather"}
        </button>
      </div>

      {error && <p className="weather-error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h3>
            {weather.city}, {weather.country}
          </h3>
          <p className="weather-temp">{weather.temperature}°C</p>
          <p className="weather-desc">{weather.description}</p>

          <div className="weather-details">
            <div>
              <span>💧 Humidity</span>
              <strong>{weather.humidity}%</strong>
            </div>
            <div>
              <span>🌬️ Wind</span>
              <strong>{weather.windSpeed} m/s</strong>
            </div>
            <div>
              <span>☁️ Cloudiness</span>
              <strong>{weather.cloudiness}%</strong>
            </div>
            <div>
              <span>👁️ Visibility</span>
              <strong>{weather.visibility} km</strong>
            </div>
            <div>
              <span>🌅 Sunrise</span>
              <strong>{weather.sunrise}</strong>
            </div>
            <div>
              <span>🌇 Sunset</span>
              <strong>{weather.sunset}</strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Weather;