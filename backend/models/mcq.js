const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(v) {
        return v.length >= 4 && v.length <= 6;
      },
      message: 'MCQ must have between 4 and 6 options'
    }
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    validate: {
      validator: function(v) {
        return this.options.includes(v);
      },
      message: 'Answer must be one of the provided options'
    }
  },
  explanation: {
    type: String,
    required: [true, 'Explanation is required'],
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Create and export the MCQ model
const MCQ = mongoose.model('MCQ', mcqSchema);

module.exports = MCQ;
