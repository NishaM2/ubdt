import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function MCQ({ mcq }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [feedback, setFeedback] = useState({
    show: false,
    isCorrect: false,
    explanation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    // Reset feedback when new option is selected
    setFeedback({ show: false, isCorrect: false, explanation: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedOption) {
      setError('Please select an answer');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/mcq/submit', {
        mcqId: mcq._id,
        answer: selectedOption
      });

      setFeedback({
        show: true,
        isCorrect: response.data.isCorrect,
        explanation: response.data.explanation
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mcq-container">
      <div className="question-box">
        <h3 className="question">{mcq.question}</h3>

        <form onSubmit={handleSubmit}>
          <div className="options-group">
            {mcq.options.map((option, index) => (
              <div key={index} className="option-item">
                <input
                  type="radio"
                  id={`option${index}`}
                  name="mcq-option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                  disabled={loading || feedback.show}
                />
                <label htmlFor={`option${index}`}>{option}</label>
              </div>
            ))}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {feedback.show ? (
            <div className={`feedback-box ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
              <p className="feedback-result">
                {feedback.isCorrect ? '✓ Correct!' : '✗ Incorrect!'}
              </p>
              <p className="feedback-explanation">
                {feedback.explanation}
              </p>
            </div>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !selectedOption}
            >
              {loading ? 'Submitting...' : 'Submit Answer'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

MCQ.propTypes = {
  mcq: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    answer: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired
  }).isRequired
};

export default MCQ;
