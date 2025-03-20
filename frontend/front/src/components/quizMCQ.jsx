import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './QuizMCQ.css';  // Make sure to create this CSS file

function QuizMCQ() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNext, setShowNext] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Fetch questions when component mounts
  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    const fetchQuestions = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/mcq/generate-batch', {
          userId,
          subject: 'math' // or get this from props/state
        });
        
        if (response.data && response.data.mcqs) {
          setQuestions(response.data.mcqs);
        } else {
          setError('Invalid response format');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [userId, navigate]);

  const handleAnswerSelect = (option) => {
    if (!showNext) {
      setSelectedAnswer(option);
      setError(''); // Clear any previous errors
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      setError('Please select an answer');
      return;
    }

    const newAnswers = [...answers, {
      mcqId: questions[currentIndex]._id,
      answer: selectedAnswer
    }];
    setAnswers(newAnswers);
    setShowNext(true);
  };

  const handleNextQuestion = async () => {
    if (currentIndex === questions.length - 1) {
      try {
        const response = await axios.post('http://localhost:3000/api/mcq/submit-batch', {
          answers: [...answers, {
            mcqId: questions[currentIndex]._id,
            answer: selectedAnswer
          }]
        });
        setQuizResults(response.data);
        setQuizComplete(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to submit quiz');
      }
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowNext(false);
    }
  };

  if (loading) {
    return <div className="quiz-container">Loading questions...</div>;
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error-message">{error}</div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (quizComplete && quizResults) {
    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <h2>Quiz Complete!</h2>
          <div className="score-card">
            <h3>Your Score: {quizResults.score.percentage}%</h3>
            <h4>Grade: {quizResults.score.grade}</h4>
            <p>Correct Answers: {quizResults.score.correct} out of {quizResults.score.total}</p>
          </div>

          <div className="results-breakdown">
            {quizResults.results.map((result, index) => (
              <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                <p>Question {result.questionNumber}: {result.question}</p>
                <p>Your Answer: {result.yourAnswer}</p>
                <p>Correct Answer: {result.correctAnswer}</p>
                <p className="explanation">{result.explanation}</p>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return <div className="quiz-container">No questions available</div>;
  }

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        Question {currentIndex + 1} of {questions.length}
      </div>

      <div className="question-box">
        <h3>{questions[currentIndex].question}</h3>

        <div className="options-group">
          {questions[currentIndex].options.map((option, idx) => (
            <div key={idx} className="option-item">
              <input
                type="radio"
                id={`option${idx}`}
                name="mcq-option"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => handleAnswerSelect(option)}
                disabled={showNext}
              />
              <label htmlFor={`option${idx}`}>{option}</label>
            </div>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        {!showNext ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
          >
            Submit Answer
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={handleNextQuestion}
          >
            {currentIndex === questions.length - 1 ? 'Show Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizMCQ;