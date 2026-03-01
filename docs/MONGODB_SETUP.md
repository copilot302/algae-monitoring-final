# PhycoSense - MongoDB Integration Setup Guide

## 🎯 MongoDB Integration Complete!

Your PhycoSense dashboard now includes full MongoDB integration for data logging and retrieval.

## 📁 Project Structure

```
algae-monitoring/
├── src/                          # React frontend
│   ├── hooks/
│   │   └── useSensorData.js     # Updated with MongoDB integration
│   └── App.js                   # Updated to log data automatically
├── server/                       # NEW: Backend API
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/
│   │   └── SensorData.js        # Data schema
│   ├── routes/
│   │   └── sensorData.js        # API endpoints
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env                     # Configuration
└── README.md
```

## 🚀 Getting Started

### Step 1: Install MongoDB

**Option A: Local MongoDB (Recommended for Development)**

1. Download MongoDB Community Edition:
   - Windows: https://www.mongodb.com/try/download/community
   - During installation, select "Complete" setup
   - Install as a Windows Service (checked by default)

2. Verify installation:
```powershell
mongod --version
```

**Option B: MongoDB Atlas (Cloud - Free Tier)**

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user (username/password)
4. Whitelist IP: 0.0.0.0/0 (allow from anywhere)
5. Get connection string
6. Update `server/.env` with your connection string

### Step 2: Configure Environment

The `.env` file in the `server` directory is already configured for local MongoDB:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/phycosense
```

If using MongoDB Atlas, replace with your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phycosense
```

### Step 3: Start the Servers

**Terminal 1 - Backend Server:**
```powershell
cd server
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

**Terminal 2 - Frontend Dashboard:**
```powershell
# From the main directory
npm start
```

The dashboard will open at `http://localhost:3000`

## 🔧 How It Works

### Automatic Data Logging

The dashboard now automatically logs sensor data to MongoDB every 3 seconds:

1. **useSensorData.js** generates sensor readings
2. **App.js** detects data changes and calls `logDataToDatabase()`
3. Data is saved to MongoDB with timestamp and risk level
4. On page load, the last 20 readings are fetched from the database

### API Endpoints

All endpoints are available at `http://localhost:5000/api/sensor-data`

**Log new data:**
```bash
POST /api/sensor-data
```

**Get historical data:**
```bash
GET /api/sensor-data?limit=100
GET /api/sensor-data?startDate=2025-01-01&endDate=2025-12-31
```

**Get latest reading:**
```bash
GET /api/sensor-data/latest
```

**Get statistics:**
```bash
GET /api/sensor-data/stats?startDate=2025-01-01
```

**Delete entry:**
```bash
DELETE /api/sensor-data/:id
```

## 📊 Database Schema

Each sensor reading is stored with:

```javascript
{
  temperature: 22.5,              // °C
  dissolvedOxygen: 3.8,          // mg/L
  ph: 8.7,                       // pH units
  electricalConductivity: 850,   // µS/cm
  turbidity: 35.2,               // NTU
  riskLevel: "Medium",           // Low/Medium/High
  timestamp: "2025-10-15T10:30:00Z",
  createdAt: "2025-10-15T10:30:00Z",
  updatedAt: "2025-10-15T10:30:00Z"
}
```

## 🧪 Testing the Integration

### 1. Check Server Health
```powershell
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"PhycoSense API is running"}
```

### 2. View Latest Data
Open your browser and navigate to:
```
http://localhost:5000/api/sensor-data/latest
```

### 3. View All Data
```
http://localhost:5000/api/sensor-data?limit=10
```

## 📱 Mobile Access

To access from mobile devices on your network:

1. Find your computer's IP address:
```powershell
ipconfig
# Look for IPv4 Address under your network adapter
```

2. Update the API URL in `src/hooks/useSensorData.js`:
```javascript
const API_URL = 'http://192.168.X.X:5000/api/sensor-data';
```

3. Access dashboard from mobile:
```
http://192.168.X.X:3000
```

## 🔍 Viewing Database Content

### Using MongoDB Compass (GUI)

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Navigate to `phycosense` database > `sensordatas` collection

### Using Command Line

```powershell
mongosh
use phycosense
db.sensordatas.find().sort({timestamp: -1}).limit(10)
```

## 🛠️ Troubleshooting

### Backend won't start

**Problem:** Port 5000 already in use
```
Solution: Change PORT in server/.env to 5001 or another port
Also update API_URL in src/hooks/useSensorData.js
```

**Problem:** MongoDB connection failed
```
Solution 1: Check if MongoDB service is running
  Windows: net start MongoDB
  
Solution 2: Verify connection string in .env
Solution 3: For Atlas, check network access and credentials
```

### Frontend can't connect to backend

**Problem:** CORS errors in browser console
```
Solution: Server already has CORS enabled
Check that both servers are running
Verify API_URL in useSensorData.js matches your backend
```

**Problem:** Data not appearing
```
Solution: Open browser console (F12) to check for errors
Verify backend is receiving requests
Check MongoDB has data: visit /api/sensor-data/latest
```

## 📈 Next Steps

### 1. Real Sensor Integration
Replace simulated data in `useSensorData.js` with actual sensor readings from your IoT devices.

### 2. Data Analysis
Use the `/api/sensor-data/stats` endpoint to analyze trends:
- Average values over time periods
- Min/max readings
- Risk level distribution

### 3. Alerts & Notifications
Add email/SMS alerts when risk levels exceed thresholds.

### 4. Historical Charts
Fetch and display data from specific date ranges.

### 5. Export to Excel
Export historical data from MongoDB to Excel for reports.

## 📝 Development Notes

- Data is logged every 3 seconds (configurable in `useSensorData.js`)
- Database keeps unlimited history (add cleanup job if needed)
- API supports filtering by date range for reports
- Frontend falls back to simulated data if backend is unavailable

## 🎓 Learning Resources

- MongoDB Docs: https://docs.mongodb.com/
- Express.js Guide: https://expressjs.com/
- Mongoose ODM: https://mongoosejs.com/

## ✅ Integration Checklist

- [x] Backend server structure created
- [x] MongoDB schema and models defined
- [x] REST API endpoints implemented
- [x] Frontend updated to use real API
- [x] Dependencies installed
- [ ] MongoDB installed and running
- [ ] Backend server started
- [ ] Frontend connected and logging data
- [ ] Data visible in MongoDB

---

**Need Help?** Check the server console and browser console for error messages. Most issues are related to MongoDB not running or connection string misconfiguration.
