const express = require('express');
const cors = require('cors')
const path = require('path');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();
app.use(cors())

app.get('/test', (req, res) => {
  res.json({ message: 'cors working'})
})
// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Import routes
const authRoutes = require('./routes/auth');
const mcqRoutes = require('./routes/mcq');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/mcq', mcqRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
