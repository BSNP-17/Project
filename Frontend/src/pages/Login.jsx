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

  // ─── Forgot Password state ────────────────────────────────────────────────
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [fpStep, setFpStep] = useState(1); // 1=Email, 2=OTP, 3=New Password
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpError, setFpError] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpSuccess, setFpSuccess] = useState(false);
  const [fpResendTimer, setFpResendTimer] = useState(0);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ─── Login handler ────────────────────────────────────────────────────────
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

  // ─── Modal open/close ─────────────────────────────────────────────────────
  const openForgotModal = () => {
    setShowForgotModal(true);
    setFpStep(1);
    setFpEmail("");
    setFpOtp("");
    setFpNewPassword("");
    setFpConfirmPassword("");
    setFpError("");
    setFpSuccess(false);
    setFpResendTimer(0);
  };

  const closeForgotModal = () => setShowForgotModal(false);

  // ─── Resend cooldown timer (30s) ──────────────────────────────────────────
  const startResendTimer = () => {
    setFpResendTimer(30);
    const interval = setInterval(() => {
      setFpResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ─── STEP 1: Send OTP ─────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setFpError("");
    if (!fpEmail) { setFpError("Please enter your email address."); return; }
    setFpLoading(true);
    try {
      await authApi.sendOtp(fpEmail);
      setFpStep(2);
      startResendTimer();
    } catch (err) {
      if (err.response?.status === 404) {
        setFpError("No account found with this email address.");
      } else {
        setFpError("Failed to send OTP. Please try again.");
      }
    } finally {
      setFpLoading(false);
    }
  };

  // ─── STEP 1 (Resend OTP) ──────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (fpResendTimer > 0) return;
    setFpError("");
    setFpLoading(true);
    try {
      await authApi.sendOtp(fpEmail);
      setFpOtp("");
      startResendTimer();
    } catch {
      setFpError("Failed to resend OTP. Please try again.");
    } finally {
      setFpLoading(false);
    }
  };

  // ─── STEP 2: Verify OTP ───────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setFpError("");
    if (!fpOtp || fpOtp.length < 6) { setFpError("Please enter the 6-digit OTP."); return; }
    setFpLoading(true);
    try {
      await authApi.verifyOtp({ email: fpEmail, otp: fpOtp });
      setFpStep(3);
    } catch (err) {
      if (err.response?.status === 400) {
        setFpError("Invalid or expired OTP. Please try again.");
      } else {
        setFpError("Server error. Please try again.");
      }
    } finally {
      setFpLoading(false);
    }
  };

  // ─── STEP 3: Reset Password ───────────────────────────────────────────────
  const handleResetPassword = async (e) => {
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
      await authApi.resetPasswordWithOtp({ email: fpEmail, newPassword: fpNewPassword });
      setFpSuccess(true);
    } catch (err) {
      setFpError(err.response?.data || "Failed to reset password. Please try again.");
    } finally {
      setFpLoading(false);
    }
  };

  const stepLabel = ["Enter Email", "Verify OTP", "New Password"];

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

            <div className="forgot-password-row">
              <button type="button" className="forgot-password-link" onClick={openForgotModal}>
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Verifying..." : "Login to TravelEase"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don&apos;t have an account? <Link to="/register">Sign Up</Link></p>
          </div>
        </div>
      </div>

      {/* ─── FORGOT PASSWORD MODAL ────────────────────────────────────────── */}
      {showForgotModal && (
        <div className="fp-modal-overlay" onClick={closeForgotModal}>
          <div className="fp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="fp-modal-close" onClick={closeForgotModal}>✕</button>

            {fpSuccess ? (
              // ─── SUCCESS STATE ───────────────────────────────────────────
              <div className="fp-success">
                <div className="fp-success-icon">✅</div>
                <h3>Password Reset Successful!</h3>
                <p>Your password has been updated. You can now log in with your new password.</p>
                <button className="submit-btn" onClick={closeForgotModal}>Back to Login</button>
              </div>
            ) : (
              <>
                <div className="fp-modal-header">
                  <div className="fp-icon">🔑</div>
                  <h3>Reset Your Password</h3>
                  <p style={{ color: '#888', fontSize: '0.85rem' }}>
                    {fpStep === 1 && "Enter your registered email to receive an OTP."}
                    {fpStep === 2 && `OTP sent to ${fpEmail}`}
                    {fpStep === 3 && `Set a new password for ${fpEmail}`}
                  </p>
                </div>

                {fpError && (
                  <div className="alert-error" style={{ marginBottom: '16px' }}>⚠️ {fpError}</div>
                )}

                {/* Step indicator — 3 steps */}
                <div className="fp-steps">
                  {[1, 2, 3].map((s, i) => (
                    <>
                      <div
                        key={s}
                        className={`fp-step ${fpStep >= s ? 'active' : ''}`}
                        title={stepLabel[i]}
                      >
                        {s}
                      </div>
                      {s < 3 && <div key={`line-${s}`} className="fp-step-line"></div>}
                    </>
                  ))}
                </div>

                {/* ─── STEP 1: Email ──────────────────────────────────────── */}
                {fpStep === 1 && (
                  <form onSubmit={handleSendOtp}>
                    <FloatingInput
                      label="Registered Email Address"
                      type="email"
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      icon="✉️"
                    />
                    <button type="submit" className="submit-btn" disabled={fpLoading}>
                      {fpLoading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </form>
                )}

                {/* ─── STEP 2: OTP ─────────────────────────────────────────── */}
                {fpStep === 2 && (
                  <form onSubmit={handleVerifyOtp}>
                    <div style={{ marginBottom: '8px' }}>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={fpOtp}
                        onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter 6-digit OTP"
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          fontSize: '1.4rem',
                          letterSpacing: '0.5rem',
                          textAlign: 'center',
                          border: '1.5px solid #ddd',
                          borderRadius: '10px',
                          outline: 'none',
                          fontWeight: '700',
                        }}
                        autoFocus
                      />
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '0.82rem', color: '#888' }}>
                      {fpResendTimer > 0
                        ? `Resend OTP in ${fpResendTimer}s`
                        : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={fpLoading}
                            style={{ background: 'none', border: 'none', color: '#8e44ad', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
                          >
                            🔄 Resend OTP
                          </button>
                        )
                      }
                    </div>
                    <button type="submit" className="submit-btn" disabled={fpLoading || fpOtp.length < 6}>
                      {fpLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <button
                      type="button"
                      className="fp-back-btn"
                      onClick={() => { setFpStep(1); setFpError(""); setFpOtp(""); }}
                    >
                      ← Back
                    </button>
                  </form>
                )}

                {/* ─── STEP 3: New Password ────────────────────────────────── */}
                {fpStep === 3 && (
                  <form onSubmit={handleResetPassword}>
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
