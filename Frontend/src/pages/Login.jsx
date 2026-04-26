import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/authApi.js";
import useAuth from "../hooks/useAuth.js";
import FloatingInput from "../components/FloatingInput.jsx";
import SuccessToast from "../components/SuccessToast.jsx";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Forgot Password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [fpStep, setFpStep] = useState(1); // 1 = enter email, 2 = set new password
  const [fpEmail, setFpEmail] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpError, setFpError] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpSuccess, setFpSuccess] = useState(false);

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
      setShowToast(true);
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

  const openForgotModal = () => {
    setShowForgotModal(true);
    setFpStep(1);
    setFpEmail("");
    setFpNewPassword("");
    setFpConfirmPassword("");
    setFpError("");
    setFpSuccess(false);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
  };

  const handleFpVerifyEmail = async (e) => {
    e.preventDefault();
    setFpError("");
    if (!fpEmail) { setFpError("Please enter your email address."); return; }
    setFpLoading(true);
    try {
      await authApi.verifyEmailExists(fpEmail);
      setFpStep(2);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setFpError("No account found with this email address.");
      } else {
        setFpError("Server error. Please try again later.");
      }
    } finally {
      setFpLoading(false);
    }
  };

  const handleFpResetPassword = async (e) => {
    e.preventDefault();
    setFpError("");
    if (!fpNewPassword || fpNewPassword.length < 6) {
      setFpError("Password must be at least 6 characters."); return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      setFpError("Passwords do not match."); return;
    }
    setFpLoading(true);
    try {
      await authApi.resetPassword({ email: fpEmail, newPassword: fpNewPassword });
      setFpSuccess(true);
    } catch (err) {
      setFpError("Failed to reset password. Please try again.");
    } finally {
      setFpLoading(false);
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

            {/* Forgot Password Link */}
            <div className="forgot-password-row">
              <button
                type="button"
                className="forgot-password-link"
                onClick={openForgotModal}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Verifying..." : "Login to TravelEase"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don&apos;t have an account? <Link to="/register">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fp-modal-overlay" onClick={closeForgotModal}>
          <div className="fp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="fp-modal-close" onClick={closeForgotModal}>✕</button>

            {fpSuccess ? (
              <div className="fp-success">
                <div className="fp-success-icon">✅</div>
                <h3>Password Reset Successful!</h3>
                <p>Your password has been updated. You can now log in with your new password.</p>
                <button
                  className="submit-btn"
                  onClick={() => { closeForgotModal(); }}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <>
                <div className="fp-modal-header">
                  <div className="fp-icon">🔑</div>
                  <h3>Reset Your Password</h3>
                  <p>
                    {fpStep === 1
                      ? "Enter your registered email address."
                      : `Setting new password for ${fpEmail}`}
                  </p>
                </div>

                {fpError && (
                  <div className="alert-error" style={{ marginBottom: "16px" }}>⚠️ {fpError}</div>
                )}

                {/* Step indicator */}
                <div className="fp-steps">
                  <div className={`fp-step ${fpStep >= 1 ? "active" : ""}`}>1</div>
                  <div className="fp-step-line"></div>
                  <div className={`fp-step ${fpStep >= 2 ? "active" : ""}`}>2</div>
                </div>

                {fpStep === 1 ? (
                  <form onSubmit={handleFpVerifyEmail}>
                    <FloatingInput
                      label="Registered Email Address"
                      type="email"
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      icon="✉️"
                    />
                    <button type="submit" className="submit-btn" disabled={fpLoading}>
                      {fpLoading ? "Verifying..." : "Continue"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleFpResetPassword}>
                    <FloatingInput
                      label="New Password"
                      type="password"
                      value={fpNewPassword}
                      onChange={(e) => setFpNewPassword(e.target.value)}
                      icon="🔒"
                    />
                    <FloatingInput
                      label="Confirm New Password"
                      type="password"
                      value={fpConfirmPassword}
                      onChange={(e) => setFpConfirmPassword(e.target.value)}
                      icon="🔒"
                    />
                    <button type="submit" className="submit-btn" disabled={fpLoading}>
                      {fpLoading ? "Resetting..." : "Reset Password"}
                    </button>
                    <button
                      type="button"
                      className="fp-back-btn"
                      onClick={() => { setFpStep(1); setFpError(""); }}
                    >
                      ← Back
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showToast && (
        <SuccessToast
          message="Login Successful! 🎉"
          subtitle="Welcome back to TravelEase! Ready to explore?"
          onClose={() => navigate("/home")}
        />
      )}
    </div>
  );
};

export default Login;
