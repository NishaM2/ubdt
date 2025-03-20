import React, { useState } from 'react';
import PropTypes from 'prop-types';

function MCQ({ mcq, onAnswerChange }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    
    // Call the parent callback with mcqId and selected answer
    onAnswerChange({
      mcqId: mcq._id,
      selectedAnswer: value
    });
  };

  return (
    <div className="mcq-container">
      <div className="question-box">
        <h3 className="question">
          {mcq.questionNumber}. {mcq.question}
        </h3>

        <div className="options-group">
          {mcq.options.map((option, index) => (
            <div key={index} className="option-item">
              <input
                type="radio"
                id={`${mcq._id}-option${index}`}
                name={`mcq-${mcq._id}`}
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
              />
              <label htmlFor={`${mcq._id}-option${index}`}>
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

MCQ.propTypes = {
  mcq: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    questionNumber: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  onAnswerChange: PropTypes.func.isRequired
};

export default MCQ;
