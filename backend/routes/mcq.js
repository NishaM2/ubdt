const express = require('express');
const router = express.Router();
const MCQ = require('../models/mcq');
const { generateMCQ } = require('../ai/generator');

// Generate new MCQ
router.post('/generate', async (req, res) => {
  try {
    const { userId, subject } = req.body;

    if (!userId || !subject) {
      return res.status(400).json({ message: 'User ID and subject are required' });
    }

    // Generate MCQ using AI
    const generatedMCQ = await generateMCQ(subject);

    // Create new MCQ with user ID
    const mcq = new MCQ({
      userId,
      subject,
      question: generatedMCQ.question,
      options: generatedMCQ.options,
      answer: generatedMCQ.answer,
      explanation: generatedMCQ.explanation
    });

    await mcq.save();

    res.status(201).json(mcq);
  } catch (error) {
    console.error('Generate MCQ error:', error);
    res.status(500).json({ message: 'Error generating MCQ' });
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
