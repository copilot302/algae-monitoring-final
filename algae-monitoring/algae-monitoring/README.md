# PhycoSense: Real-time Algae Monitoring Dashboard

A modern, full-stack React-based web dashboard with MongoDB integration for monitoring water quality parameters to predict and prevent algae bloom formation.

## 🌊 Features

### Real-time Monitoring
- **Temperature** - Continuous temperature monitoring with trend analysis
- **Dissolved Oxygen** - Critical oxygen level tracking for aquatic health  
- **pH Level** - Circular gauge display for pH monitoring (0-14 scale)
- **Electrical Conductivity** - Water conductivity measurement in µS/cm
- **Turbidity** - Water clarity measurement in NTU

### MongoDB Integration (NEW! ✨)
- **Automatic Data Logging** - All sensor readings saved to MongoDB every 3 seconds
- **Historical Data** - Retrieve past readings with date filtering
- **REST API** - Full CRUD operations for sensor data
- **Statistics** - Aggregate data analysis (averages, min/max, trends)
- **Persistent Storage** - Never lose monitoring data

### Risk Assessment System
Three-tier risk classification system:
- **Normal (Green)** - No immediate algae bloom risk
- **Early Bloom Formation (Yellow)** - Moderate risk, monitor closely  
- **High Risk - Bloom Conditions (Red)** - Immediate action required

### 📊 Data Visualization
- Interactive line charts for trending parameters
- Circular gauges for pH and electrical conductivity
- Real-time value displays with units
- Trend indicators (rising, stable, decreasing)

### 🎨 Modern Interface
- Dark theme with gradient backgrounds
- Glassmorphism design elements
- Responsive grid layout
- Smooth animations and transitions
- Mobile-friendly responsive design

## Risk Assessment Thresholds

### Temperature
- **Normal**: 15-28°C
- **Moderate Risk**: 12-32°C (outside normal range)
- **High Risk**: Outside moderate range

### Dissolved Oxygen
- **Normal**: 6-12 mg/L
- **Moderate Risk**: 4-15 mg/L (outside normal range)
- **High Risk**: Below 4 mg/L or above 15 mg/L

### pH Level
- **Normal**: 6.5-8.5
- **Moderate Risk**: 6.0-9.0 (outside normal range)
- **High Risk**: Below 6.0 or above 9.0

### Electrical Conductivity
- **Normal**: 0.5-2.0 mS/cm
- **Moderate Risk**: 0.2-3.0 mS/cm (outside normal range)
- **High Risk**: Outside moderate range

### Turbidity
- **Normal**: 0-20 NTU
- **Moderate Risk**: 20-40 NTU
- **High Risk**: Above 40 NTU

## Technology Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **Chart.js** - Interactive data visualization
- **Lucide React** - Icon library
- **Webpack 5** - Module bundler
- **CSS3** - Modern styling with glassmorphism effects

### Backend (NEW! ✨)
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing

### Database (NEW! ✨)
- **MongoDB** - NoSQL database for sensor data storage
- **MongoDB Atlas** - Cloud database option (optional)

## Project Structure

```
algae-monitoring/
├── src/                          # React frontend
│   ├── components/               # React components
│   ├── hooks/                    # Custom hooks (with MongoDB integration)
│   ├── styles/                   # CSS files
│   └── utils/                    # Utility functions
├── server/                       # NEW: Backend API
│   ├── config/                   # Database configuration
│   ├── models/                   # MongoDB schemas
│   ├── routes/                   # API endpoints
│   ├── .env                      # Environment variables
│   └── server.js                 # Express server
├── public/                       # Static assets
├── webpack.config.js             # Webpack configuration
├── start-backend.bat            # Backend startup script
├── start-frontend.bat           # Frontend startup script
├── MONGODB_SETUP.md             # Database setup guide
├── INTEGRATION_SUMMARY.md       # Integration overview
├── ARCHITECTURE.md              # System architecture
├── QUICK_REFERENCE.md           # Quick command reference
└── README.md                    # This file
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Quick Start

**Option 1: Using Batch Files (Windows)**
1. Double-click `start-backend.bat` to start the API server
2. Double-click `start-frontend.bat` to start the dashboard
3. Dashboard opens at `http://localhost:3000`

**Option 2: Manual Start**

Terminal 1 - Backend:
```powershell
cd server
npm install
npm run dev
```

Terminal 2 - Frontend:
```powershell
npm install
npm start
```

### First Time Setup

1. **Install MongoDB**
   - Download from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (free cloud tier)
   - See `MONGODB_SETUP.md` for detailed instructions

2. **Configure Environment**
   - Navigate to `server/` directory
   - Update `.env` with your MongoDB connection string
   - Default: `mongodb://localhost:27017/phycosense`

3. **Install Dependencies**
   ```powershell
   npm install           # Frontend
   cd server
   npm install           # Backend
   ```

4. **Start Services**
   - Ensure MongoDB is running
   - Start backend server (port 5000)
   - Start frontend dashboard (port 3000)

### Detailed Documentation

📘 **[MongoDB Setup Guide](MONGODB_SETUP.md)** - Complete installation and configuration
📘 **[Integration Summary](INTEGRATION_SUMMARY.md)** - Features and system overview  
📘 **[Architecture Diagrams](ARCHITECTURE.md)** - System design and data flow
📘 **[Quick Reference](QUICK_REFERENCE.md)** - Commands and troubleshooting

## API Endpoints

### Sensor Data Endpoints
```
POST   /api/sensor-data           - Log new sensor reading
GET    /api/sensor-data           - Get readings (with filters)
GET    /api/sensor-data/latest    - Get most recent reading
GET    /api/sensor-data/stats     - Get statistics
DELETE /api/sensor-data/:id       - Delete specific entry
GET    /api/health                - Health check
```

### Example Usage
```bash
# Get latest reading
curl http://localhost:5000/api/sensor-data/latest

# Get last 50 readings
curl http://localhost:5000/api/sensor-data?limit=50

# Get statistics
curl http://localhost:5000/api/sensor-data/stats
```

## Data Export

The dashboard includes Excel export functionality:
- Current sensor readings
- Historical data (20 most recent points)
- Risk assessment levels
- Timestamp information
- Export to `.xlsx` format

## Mobile Access

1. Find your computer's IP address: `ipconfig`
2. Update API URL in `src/hooks/useSensorData.js`
3. Access dashboard: `http://YOUR_IP:3000`
4. See `MONGODB_SETUP.md` for detailed mobile setup

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Current Status

✅ **Completed Features**
- Real-time sensor data simulation
- Random Forest risk assessment algorithm
- Interactive Chart.js visualizations
- MongoDB integration with automatic logging
- REST API for data operations
- Historical data retrieval
- Mobile-responsive design
- Excel export functionality

⏳ **Future Enhancements**
- Real IoT sensor integration (replace simulation)
- Email/SMS alerts for high risk conditions
- User authentication and authorization
- Multi-location monitoring dashboard
- Advanced analytics and predictions
- Custom threshold configuration
- Data backup and recovery tools

## License

This project is created for educational and research purposes in algae monitoring and water quality assessment.

## Contact

For questions or contributions related to the PhycoSense algae monitoring system, please refer to your research team documentation.

---

**Note**: This dashboard currently uses simulated data for demonstration purposes. In a production environment, it should be connected to actual sensor hardware or data APIs.