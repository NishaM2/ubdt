const express = require('express');
const router = express.Router();
const MCQ = require('../models/mcq');
const { generateMCQ } = require('../ai/generator');


// Generate batch of 10 MCQs

// Submit batch of answers and get score
router.post('/submit-batch', async (req, res) => {
  try {
    const { userId, answers } = req.body;

    // Validate request
    if (!userId || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ 
        message: 'User ID and answers array are required' 
      });
    }

    // Debug log
    console.log('Received answers:', answers);

    // Check all answers
    const results = await Promise.all(
      answers.map(async ({ mcqId, selectedAnswer }) => {
        // Debug log
        console.log('Processing mcqId:', mcqId);
        
        // Find MCQ without userId filter first
        const mcq = await MCQ.findById(mcqId);
        
        if (!mcq) {
          console.log('MCQ not found for id:', mcqId);
          return {
            mcqId,
            error: 'MCQ not found'
          };
        }

        const isCorrect = mcq.answer === selectedAnswer;
        return {
          mcqId,
          questionNumber: mcq.questionNumber,
          question: mcq.question,
          yourAnswer: selectedAnswer,
          correctAnswer: mcq.answer,
          isCorrect,
          explanation: mcq.explanation
        };
      })
    );

    // Filter out errors and calculate score
    const validResults = results.filter(r => !r.error);
    
    // Debug log
    console.log('Valid results:', validResults.length);
    console.log('Correct answers:', validResults.filter(r => r.isCorrect).length);

    // Prevent division by zero
    const percentage = validResults.length > 0 
      ? Math.round((validResults.filter(r => r.isCorrect).length / validResults.length) * 100)
      : 0;

    const score = {
      total: validResults.length,
      correct: validResults.filter(r => r.isCorrect).length,
      percentage
    };

    // Add grade
    let grade = 'F';
    if (score.percentage >= 90) grade = 'A';
    else if (score.percentage >= 80) grade = 'B';
    else if (score.percentage >= 70) grade = 'C';
    else if (score.percentage >= 60) grade = 'D';

    res.json({
      score: {
        ...score,
        grade
      },
      results: validResults.sort((a, b) => a.questionNumber - b.questionNumber)
    });

  } catch (error) {
    console.error('Submit batch answers error:', error);
    res.status(500).json({ 
      message: 'Error processing answers',
      error: error.message 
    });
  }
});

// Generate 10 MCQs
router.post('/generate', async (req, res) => {
  try {
    const { userId, subject } = req.body;

    if (!userId || !subject) {
      return res.status(400).json({ message: 'User ID and subject are required' });
    }

    // Generate 10 MCQs
    const mcqs = [];
    for (let i = 0; i < 10; i++) {
      // Generate MCQ using AI
      const generatedMCQ = await generateMCQ(subject);

      // Create new MCQ with user ID and question number
      const mcq = new MCQ({
        userId,
        subject,
        question: generatedMCQ.question,
        options: generatedMCQ.options,
        answer: generatedMCQ.answer,
        explanation: generatedMCQ.explanation,
        questionNumber: i + 1  // Add question number for tracking
      });

      await mcq.save();
      
      // Add to array without the answer for security
      mcqs.push({
        _id: mcq._id,
        question: mcq.question,
        options: mcq.options,
        questionNumber: mcq.questionNumber
      });
    }

    // Return array of MCQs without answers
    res.status(201).json({
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz`,
      subject,
      totalQuestions: mcqs.length,
      mcqs
    });
  } catch (error) {
    console.error('Generate MCQs error:', error);
    res.status(500).json({ message: 'Error generating MCQs' });
  }
});

// Submit answer and check correctness
router.post('/submit', async (req, res) => {
  try {
    const { mcqId, answer } = req.body;

    if (!mcqId || !answer) {
      return res.status(400).json({ message: 'MCQ ID and answer are required' });
    }

    // Find MCQ
    const mcq = await MCQ.findById(mcqId);
    if (!mcq) {
      return res.status(404).json({ message: 'MCQ not found' });
    }

    // Check answer
    const isCorrect = mcq.answer === answer;

    res.json({
      isCorrect,
      explanation: mcq.explanation,
      correctAnswer: mcq.answer
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ message: 'Error checking answer' });
  }
});

// Get MCQ history for a user
router.get('/history', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find all MCQs for the user
    const mcqs = await MCQ.find({ userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('-answer'); // Exclude answer from results

    res.json(mcqs);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Error fetching MCQ history' });
  }
});

module.exports = router;
