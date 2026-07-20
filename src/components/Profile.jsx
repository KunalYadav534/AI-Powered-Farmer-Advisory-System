import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    cropType: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to load profile.");
        setLoading(false);
        return;
      }

      setProfile(data.profile);
      setFormData({
        name: data.profile.name || "",
        location: data.profile.location || "",
        cropType: data.profile.cropType || "",
      });
    } catch (err) {
      setError("Server error. Please make sure backend is running.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || (data.errors && data.errors[0]) || "Update failed.");
        setSaving(false);
        return;
      }

      setProfile(data.profile);

      const storedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, name: data.profile.name })
      );

      setMessage("Profile updated successfully! ✅");
    } catch (err) {
      setError("Server error. Please try again.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <p style={{ color: "#9bb89f" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>👤 Farmer Profile</h2>
        <p className="profile-subtitle">Manage your account information</p>

        <p className="profile-email">📧 {profile?.email}</p>

        <form onSubmit={handleSave}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Bulandshahr, UP"
          />

          <label>Primary Crop</label>
          <input
            type="text"
            name="cropType"
            value={formData.cropType}
            onChange={handleChange}
            placeholder="e.g. Wheat, Rice, Sugarcane"
          />

          {message && <p className="profile-success">{message}</p>}
          {error && <p className="profile-error">{error}</p>}

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <button className="back-btn" onClick={() => navigate("/chat")}>
          ← Back to Chat
        </button>
      </div>
    </div>
  );
}

export default Profile;