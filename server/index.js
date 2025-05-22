const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const apiService = require('./services/apiService');
const apiRoutes = require('./routes/apiRoutes');
const connectDB = require('./config/db');
const { schedule } = require('./config/cronConfig');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
  

// Middleware
app.use(cors({
  origin:process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true 
}));

app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Schedule the API call
cron.schedule(schedule, async () => {
  console.log('Running scheduled events refresh...');
  try {
    await apiService.fetchAndCacheEvents();
    console.log('Events refreshed successfully');
  } catch (error) {
    console.error('Failed to refresh events:', error.message);
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initial data load
  try {
    await apiService.fetchAndCacheEvents();
    console.log('Initial event data loaded');
  } catch (error) {
    console.error('Initial load failed:', error.message);
  }
});