import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/Signup.css";

export default function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", { name, email, password });
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Signup error");
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="main-btn" type="submit">Sign Up</button>
        </form>

        <p className="bottom-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
