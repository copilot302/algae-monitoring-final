const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const sensorDataRoutes = require('./routes/sensorData');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/sensor-data', sensorDataRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    name: 'PhycoSense API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      sensorData: '/api/sensor-data',
      sensorDataByDevice: '/api/sensor-data/:deviceId'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PhycoSense API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
