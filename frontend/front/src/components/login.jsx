import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', formData);
      
      if (response.data.userId) {
        localStorage.setItem('userId', response.data.userId);
        navigate('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="auth-form bg-white/20 backdrop-blur-lg shadow-lg p-8 rounded-lg w-full max-w-md">
        <h2 className="text-white text-2xl font-bold text-center mb-6">Login to MCQ Platform</h2>
  
        {error && (
          <div className="error-message bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="username" className="text-white font-medium">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              disabled={loading}
              className="w-full p-3 bg-white/70 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-200"
            />
          </div>
  
          <div className="form-group">
            <label htmlFor="password" className="text-white font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
              className="w-full p-3 bg-white/70 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-200"
            />
          </div>
  
          <button
            type="submit"
            className="btn w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
  
        <div className="auth-links mt-4 text-center text-white">
          <p>
            Don't have an account? <Link to="/signup" className="underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}  
  export default Login;