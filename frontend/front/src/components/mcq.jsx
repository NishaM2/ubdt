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
    <div className="mcq-container bg-white p-6 rounded-lg shadow-md">
      <div className="question-box">
        <h3 className="question text-lg font-semibold mb-4 text-gray-800">
          {mcq.questionNumber}. {mcq.question}
        </h3>
  
        <div className="options-group space-y-3">
          {mcq.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition 
                          ${
                            selectedOption === option
                              ? "bg-green-100 border-green-500"
                              : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                          }`}
            >
              <input
                type="radio"
                id={`${mcq._id}-option${index}`}
                name={`mcq-${mcq._id}`}
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
                className="hidden"
              />
              <span
                className={`w-5 h-5 flex items-center justify-center border-2 rounded-full
                            ${
                              selectedOption === option
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-gray-400"
                            }`}
              >
                {selectedOption === option && "✓"}
              </span>
              <span className="text-gray-700">{option}</span>
            </label>
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
