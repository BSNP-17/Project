import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/authApi.js";
import useAuth from "../hooks/useAuth.js";
import FloatingInput from "../components/FloatingInput.jsx"; // ✅ Imported your awesome component
import "./Auth.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      
      const token = response.data.token || response.data.jwt; 
      const userData = response.data.user || response.data;

      login(userData, token); 
      
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE - IMAGE BANNER */}
      <div className="auth-banner">
        <div className="banner-content">
          <h1>TravelEase.</h1>
          <p>The smartest way to book your bus tickets across India.</p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue booking.</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div className="alert-error">⚠️ {error}</div>}

            {/* ✅ Using FloatingInput for a premium look */}
            <FloatingInput 
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="✉️"
            />

            <FloatingInput 
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon="🔒"
            />

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Verifying..." : "Login to TravelEase"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;