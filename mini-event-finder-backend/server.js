const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Mini Event Finder API is running!' });
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Port
const PORT = process.env.PORT || 5000;

// ✅ Connect to database first, then start the server
(async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
})();
