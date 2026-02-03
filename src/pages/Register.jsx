
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Register.css";
import SuccessToast from "./SuccessToast";


export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }


    setTimeout(() => {
      console.log("Form Submitted:", form);
      

      setShowToast(true);
      setLoading(false);
      
      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    }, 1500);
  };

  const closeToast = () => {
    setShowToast(false);
    navigate('/login'); 
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create Your Account</h2>
        <p className="register-subtitle">
          Join Travel-Ease and book your bus tickets instantly 🚍
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="9876543210"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="register-btn"
            disabled={loading}  
          >
            {loading ? "Creating Account..." : "Create Account"}  // ✅ Loading text
          </button>

          <p className="login-text">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>


      {showToast && (
        <SuccessToast 
          message="Account Created Successfully! ✨" 
          onClose={closeToast}
        />
      )}
    </div>
  );
}
