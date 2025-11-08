import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { name, email, phone, password, confirmPassword, role } = formData;

    if (!name || !email || !phone || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      // ✅ Use the correct backend URL (port 30090)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:30090';
      const response = await axios.post(`${API_BASE_URL}/api/user/register`, {
        name,
        email,
        phone,
        password,
        role,
      });

      if (response.data.includes('success')) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        setErrorMessage(response.data);
      }
    } catch (error) {
      setErrorMessage('Failed to register. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-box">
        <h2>Create Your TravelSathi Account</h2>

        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
        
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <button className="btn" onClick={handleRegister} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="switch-text">
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
}

