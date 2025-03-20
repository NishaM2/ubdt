import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
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

    // Basic validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', formData);
      
      if (response.data.userId) {
        // Signup successful, redirect to login page
        navigate('/', { state: { message: 'Signup successful! Please login.' } });
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container flex items-center justify-center min-h-screen bg-gray-100">
      <div className="auth-form bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Create an Account
        </h2>
  
        {error && (
          <div className="error-message bg-red-100 text-red-700 p-3 rounded-md mb-3 text-sm">
            {error}
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="block font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              minLength="3"
              disabled={loading}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            />
          </div>
  
          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="block font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a password"
              required
              minLength="6"
              disabled={loading}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            />
            <small className="text-gray-500 text-sm">Password must be at least 6 characters long</small>
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
  
        {/* Login Link */}
        <div className="auth-links text-center mt-4 text-gray-600">
          <p>
            Already have an account? <Link to="/" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}  

export default Signup;
