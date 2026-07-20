import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header>
      <h1>🌾 KrishiAI</h1>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#weather">Weather</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><Link to="/chat">💬 Chat</Link></li>
          <li><Link to="/login">👤 Login</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar