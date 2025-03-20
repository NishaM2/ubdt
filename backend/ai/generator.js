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

module.exports = { generateMCQ };
