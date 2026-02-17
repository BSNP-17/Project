import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/authApi";
import FloatingInput from '../components/FloatingInput'; // Fixed capitalization
import SuccessToast from "../components/SuccessToast";
import './Auth.css'; 

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    let score = 0;
    if (form.password.length > 5) score += 40;
    if (/[A-Z]/.test(form.password)) score += 30;
    if (/[0-9]/.test(form.password)) score += 30;
    setPasswordStrength(score);
  }, [form.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authApi.register(form);
      setShowToast(true);
    } catch (err) {
      console.error("Registration Error:", err);
      // ✅ FIX: Handle both String and Object error responses
      let errorMessage = "Registration failed. Please try again.";
      if (err.response && err.response.data) {
          errorMessage = typeof err.response.data === 'string' 
              ? err.response.data 
              : (err.response.data.message || err.response.data.error || JSON.stringify(err.response.data));
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-banner" style={{backgroundImage: "url('https://images.unsplash.com/photo-1626606011853-e153a992d966?w=1600')"}}>
        <div className="banner-content">
          <h1>Join the Community 🚀</h1>
          <p>Get exclusive discounts on your first bus trip.</p>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>It takes less than a minute.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <FloatingInput
              label="Full Name"
              name="fullname"
              icon="👤"
              value={form.fullname}
              onChange={(e) => setForm({...form, fullname: e.target.value})}
            />

            <FloatingInput
              label="Email Address"
              name="email"
              type="email"
              icon="📧"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
            />

            <FloatingInput
              label="Create Password"
              name="password"
              type="password"
              icon="🔒"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
            />

            {form.password && (
              <div className="strength-bar-container">
                <div 
                  className="strength-fill" 
                  style={{
                    width: `${passwordStrength}%`, 
                    backgroundColor: passwordStrength < 50 ? '#ef4444' : passwordStrength < 80 ? '#f59e0b' : '#22c55e'
                  }}
                ></div>
                <span className="strength-text">
                  {passwordStrength < 50 ? "Weak" : passwordStrength < 80 ? "Medium" : "Strong 💪"}
                </span>
              </div>
            )}

            <button className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Sign Up Free"}
            </button>
          </form>

          <p className="auth-footer">
            Already a member? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
      
      {showToast && <SuccessToast onClose={() => navigate('/login')} />}
    </div>
  );
};

export default Register;