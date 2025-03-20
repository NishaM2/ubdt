import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Quiz from '../components/quiz';

function Dashboard() {
  const [subject, setSubject] = useState('');
  const [quizMCQs, setQuizMCQs] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');

  // Check authentication
  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleGenerateQuiz = async () => {
    if (!subject) {
      setError('Please select a subject');
      return;
    }

    setLoading(true);
    setError('');
    setShowHistory(false);
    setQuizMCQs(null);

    try {
      const response = await axios.post('http://localhost:3000/api/mcq/generate', {
        userId,
        subject
      });

      // The response includes title, subject, totalQuestions, and mcqs array
      setQuizMCQs(response.data.mcqs);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = async () => {
    setLoading(true);
    setError('');
    setQuizMCQs(null);

    try {
      const response = await axios.get(`http://localhost:3000/api/mcq/history?userId=${userId}`);
      setHistory(response.data);
      setShowHistory(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>MCQ Quiz Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <div className="controls-section">
        <div className="subject-select">
          <label htmlFor="subject">Select Subject:</label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={loading}
          >
            <option value="">Choose a subject</option>
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
          </select>
        </div>

        <div className="button-group">
          <button
            onClick={handleGenerateQuiz}
            className="btn btn-primary"
            disabled={loading || !subject}
          >
            {loading ? 'Generating Quiz...' : 'Generate Quiz'}
          </button>
          <button
            onClick={handleViewHistory}
            className="btn btn-secondary"
            disabled={loading}
          >
            View History
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="content-section">
        {quizMCQs && !showHistory && (
          <Quiz mcqs={quizMCQs} />
        )}

        {showHistory && (
          <div className="history-section">
            <h2>Your Quiz History</h2>
            {history.length === 0 ? (
              <p>No quizzes attempted yet</p>
            ) : (
              <div className="history-list">
                {history.map((mcq) => (
                  <div key={mcq._id} className="history-item">
                    <h3>{mcq.subject}</h3>
                    <p className="question">{mcq.question}</p>
                    <small className="timestamp">
                      Attempted on: {new Date(mcq.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
