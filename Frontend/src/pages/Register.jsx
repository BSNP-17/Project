import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/authApi";
import FloatingInput from '../components/FloatingInput';
import SuccessToast from "../components/SuccessToast";
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullname: "", email: "", password: "", phoneNumber: "" });
  const [errors, setErrors] = useState({});
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

  const validate = () => {
    const newErrors = {};

    // Full Name
    if (!form.fullname.trim()) {
      newErrors.fullname = "Full name is required.";
    } else if (form.fullname.trim().length < 3) {
      newErrors.fullname = "Name must be at least 3 characters.";
    }

    // Email — standard format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address (e.g. name@example.com).";
    }

    // Phone Number — Indian standard: exactly 10 digits, starts with 6–9
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (form.phoneNumber.trim().length !== 10) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    } else if (!phoneRegex.test(form.phoneNumber.trim())) {
      newErrors.phoneNumber = "Enter a valid 10-digit Indian mobile number (starts with 6–9).";
    }

    // Password
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      setLoading(true);
      await authApi.register(form);
      setShowToast(true);
    } catch (err) {
      console.error("Registration Error:", err);
      let errorMessage = "Registration failed. Please try again.";
      if (err.response && err.response.data) {
        errorMessage = typeof err.response.data === 'string'
          ? err.response.data
          : (err.response.data.message || err.response.data.error || JSON.stringify(err.response.data));
      }
      setErrors({ server: errorMessage });
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

          <form onSubmit={handleSubmit} noValidate>
            {errors.server && <div className="alert-error">⚠️ {errors.server}</div>}

            <FloatingInput
              label="Full Name"
              name="fullname"
              icon="👤"
              value={form.fullname}
              onChange={(e) => setForm({...form, fullname: e.target.value})}
              error={errors.fullname}
            />

            <FloatingInput
              label="Email Address"
              name="email"
              type="email"
              icon="📧"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              error={errors.email}
            />

            <FloatingInput
              label="Phone Number (10 digits)"
              name="phoneNumber"
              type="tel"
              icon="📱"
              value={form.phoneNumber}
              onChange={(e) => {
                // Allow only digits, max 10
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setForm({...form, phoneNumber: val});
              }}
              error={errors.phoneNumber}
            />

            <FloatingInput
              label="Create Password"
              name="password"
              type="password"
              icon="🔒"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              error={errors.password}
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

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Sign Up Free"}
            </button>
          </form>

          <p className="auth-footer">
            Already a member? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>

      {showToast && (
        <SuccessToast
          message="Successfully Registered! 🎉"
          subtitle="Your account is ready. Please sign in to continue."
          onClose={() => navigate('/login')}
        />
      )}
    </div>
  );
};

export default Register;
