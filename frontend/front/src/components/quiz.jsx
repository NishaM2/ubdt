import React, { useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import MCQ from './mcq';

function Quiz({ mcqs }) {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = ({ mcqId, selectedAnswer }) => {
    setAnswers(prev => ({
      ...prev,
      [mcqId]: selectedAnswer
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length !== mcqs.length) {
      setError('Please answer all questions before submitting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([mcqId, selectedAnswer]) => ({
        mcqId,
        selectedAnswer
      }));

      const response = await axios.post('http://localhost:3000/api/mcq/submit-batch', {
        userId,
        answers: formattedAnswers
      });

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  if (results) {
    return (
      <div className="quiz-results">
        <h2>Quiz Complete!</h2>
        <div className="score-card">
          <h3>Your Score: {results.score.percentage}%</h3>
          <h4>Grade: {results.score.grade}</h4>
          <p>
            You got {results.score.correct} out of {results.score.total} correct!
          </p>
        </div>

        <div className="results-breakdown">
          {results.results.map((result) => (
            <div 
              key={result.mcqId}
              className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}
            >
              <h4>Question {result.questionNumber}</h4>
              <p>{result.question}</p>
              <p>Your Answer: {result.yourAnswer}</p>
              <p>Correct Answer: {result.correctAnswer}</p>
              <p className="explanation">{result.explanation}</p>
            </div>
          ))}
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {mcqs.map((mcq, index) => (
        <div key={mcq._id} className="question-wrapper">
          <div className="question-number">
            Question {index + 1} of {mcqs.length}
          </div>
          <MCQ
            mcq={mcq}
            onAnswerChange={handleAnswerChange}
          />
        </div>
      ))}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <button
        className="btn btn-primary submit-quiz"
        onClick={handleSubmit}
        disabled={loading || Object.keys(answers).length !== mcqs.length}
      >
        {loading ? 'Submitting...' : 'Submit Quiz'}
      </button>
    </div>
  );
}

Quiz.propTypes = {
  mcqs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      questionNumber: PropTypes.number.isRequired,
      question: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired
};

export default Quiz;