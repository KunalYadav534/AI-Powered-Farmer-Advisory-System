import heroBg from "../assets/HeroBackgound.png"
import farmerImg from "../assets/farmer.png"
import { Link } from "react-router-dom"

function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="hero-content">
        <div className="hero-text">
          <h1>🌾 Smart Farming Starts Here</h1>
          <p>
            Get instant AI-powered advice on crops, fertilizers, weather,
            and pest control — anytime, anywhere.
          </p>
          <div className="buttons">
            <Link to="/chat" className="btn">💬 Start Chatting</Link>
            <a href="#weather" className="btn btn-outline">🌦️ Check Weather</a>
          </div>
        </div>

        <div className="hero-image">
          <div className="farmer-quote">
            "Empowering every farmer with AI"
          </div>
          <img src={farmerImg} alt="Farmer with crops" />
        </div>
      </div>
    </section>
  )
}

export default Hero