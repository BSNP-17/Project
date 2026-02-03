import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log('Login:', formData);
      setLoading(false);
      navigate('/home');
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-card glass">
        
        <div className="logo-section">
          <h1 className="logo-text">TravelEase</h1>
          <p className="tagline">Book smarter. Travel better.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="field">
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
            />
            <label>Username or Phone</label>
          </div>

          <div className="field">
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <label>Password</label>
          </div>

          <button className="login-btn" disabled={loading}>
            {loading ? 'Signing you in…' : 'Login'}
          </button>

          <p className="signup-link">
            New to TravelEase?{' '}
            <Link to="/register">Create account</Link>
          </p>
        </form>

      </div>
    </div>
  );
};

export default Login;
