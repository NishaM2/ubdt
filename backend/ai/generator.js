// Mock MCQ data for different subjects
const mockMCQs = {
  math: [
    {
      question: 'What is 5 + 3?',
      options: ['6', '7', '8', '9'],
      answer: '8',
      explanation: '5 + 3 = 8'
    },
    {
      question: 'What is the square root of 16?',
      options: ['2', '3', '4', '5'],
      answer: '4',
      explanation: '4 × 4 = 16, therefore √16 = 4'
    },
    {
      question: 'If x + 5 = 10, what is x?',
      options: ['3', '4', '5', '6'],
      answer: '5',
      explanation: 'x + 5 = 10, therefore x = 10 - 5 = 5'
    }
  ],
  science: [
    {
      question: 'What is the chemical symbol for water?',
      options: ['H2O', 'CO2', 'O2', 'N2'],
      answer: 'H2O',
      explanation: 'Water is composed of two hydrogen atoms and one oxygen atom'
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      answer: 'Mars',
      explanation: 'Mars appears red due to iron oxide (rust) on its surface'
    },
    {
      question: 'What is the hardest natural substance?',
      options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
      answer: 'Diamond',
      explanation: 'Diamond is the hardest known natural material on the Mohs scale'
    }
  ]
};

/**
 * Generates a random MCQ for the given subject
 * @param {string} subject - The subject to generate an MCQ for ('math' or 'science')
 * @returns {Object} An MCQ object with question, options, answer, and explanation
 */
const generateMCQ = (subject) => {
  // Convert subject to lowercase for case-insensitive matching
  const subjectKey = subject.toLowerCase();

  // Check if subject is supported
  if (!mockMCQs[subjectKey]) {
    throw new Error('Unsupported subject. Please use "math" or "science"');
  }

  // Get random MCQ from the subject's array
  const mcqs = mockMCQs[subjectKey];
  const randomIndex = Math.floor(Math.random() * mcqs.length);
  
  return mcqs[randomIndex];
};

const generateQuiz = (subject, count = 10) => {
  // ... quiz generation logic ..
  router.post('/generate-batch', async (req, res) => {
  try {
    const { userId, subject } = req.body;

    if (!userId || !subject) {
      return res.status(400).json({ message: 'User ID and subject are required' });
    }

    // Generate quiz with 10 questions
    const quiz = generateQuiz(subject, 10);

    // Save all MCQs to database
    const savedMCQs = await Promise.all(
      quiz.mcqs.map(async (mcq) => {
        const newMCQ = new MCQ({
          userId,
          subject,
          question: mcq.question,
          options: mcq.options,
          answer: mcq.answer,
          explanation: mcq.explanation,
          questionNumber: mcq.questionNumber
        });
        await newMCQ.save();
        return newMCQ;
      })
    );

    // Return quiz without answers
    res.status(201).json({
      quizId: quiz._id,
      title: quiz.title,
      subject: quiz.subject,
      totalQuestions: quiz.totalQuestions,
      mcqs: savedMCQs.map(mcq => ({
        _id: mcq._id,
        question: mcq.question,
        options: mcq.options,
        questionNumber: mcq.questionNumber
      }))
    });
  } catch (error) {
    console.error('Generate batch MCQ error:', error);
    res.status(500).json({ message: 'Error generating MCQs' });
  }
});
}
module.exports = { generateMCQ, generateQuiz };
