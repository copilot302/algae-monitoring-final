# PhycoSense Quick Reference Card

## 🚀 Quick Start Commands

### Start the Application
```powershell
# Terminal 1 - Backend
cd server
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev

# Terminal 2 - Frontend  
npm start
```

### Alternative: Use Batch Files
```
Double-click: start-backend.bat
Double-click: start-frontend.bat
```

## 🌐 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:3000 | Main application |
| Backend API | http://localhost:5000 | REST API server |
| Health Check | http://localhost:5000/api/health | Server status |
| Latest Data | http://localhost:5000/api/sensor-data/latest | Most recent reading |
| All Data | http://localhost:5000/api/sensor-data?limit=20 | Get 20 records |

## 📊 API Endpoints Cheat Sheet

### GET Requests
```bash
# Get latest reading
curl http://localhost:5000/api/sensor-data/latest

# Get last 50 readings
curl http://localhost:5000/api/sensor-data?limit=50

# Get data for date range
curl "http://localhost:5000/api/sensor-data?startDate=2025-10-01&endDate=2025-10-15"

# Get statistics
curl http://localhost:5000/api/sensor-data/stats
```

### POST Request (Log Data)
```bash
curl -X POST http://localhost:5000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 22.5,
    "dissolvedOxygen": 7.5,
    "ph": 7.0,
    "electricalConductivity": 500,
    "turbidity": 10.0,
    "riskLevel": "Low"
  }'
```

### DELETE Request
```bash
# Delete specific entry (replace ID)
curl -X DELETE http://localhost:5000/api/sensor-data/507f1f77bcf86cd799439011
```

## 💾 MongoDB Commands

### Using MongoDB Compass (GUI)
```
Connection String: mongodb://localhost:27017
Database: phycosense
Collection: sensordatas
```

### Using Command Line (mongosh)
```javascript
// Connect to MongoDB
mongosh

// Switch to database
use phycosense

// View all collections
show collections

// Get latest 10 readings
db.sensordatas.find().sort({timestamp: -1}).limit(10)

// Count total documents
db.sensordatas.countDocuments()

// Find readings with high risk
db.sensordatas.find({riskLevel: "High"})

// Get average temperature
db.sensordatas.aggregate([
  {$group: {_id: null, avgTemp: {$avg: "$temperature"}}}
])

// Delete all data (careful!)
db.sensordatas.deleteMany({})

// Delete old data (before specific date)
db.sensordatas.deleteMany({
  timestamp: {$lt: new Date("2025-10-01")}
})
```

## 🔧 Common Fixes

### Backend Won't Start
```powershell
# Check if port is in use
netstat -ano | findstr :5000

# Kill process on port 5000 (if needed)
taskkill /PID <process_id> /F

# Change port in server/.env
PORT=5001
```

### MongoDB Not Running
```powershell
# Start MongoDB service
net start MongoDB

# Check MongoDB status
sc query MongoDB

# Or start manually
mongod --dbpath C:\data\db
```

### Frontend Can't Connect
```javascript
// Check API URL in src/hooks/useSensorData.js
const API_URL = 'http://localhost:5000/api/sensor-data';

// For network access, use your IP
const API_URL = 'http://192.168.X.X:5000/api/sensor-data';
```

### Clear Browser Cache
```
Press: Ctrl + Shift + Delete
Or: F12 → Network tab → Disable cache
```

## 📱 Mobile Access Setup

### Step 1: Find Your IP
```powershell
ipconfig
# Look for IPv4 Address: 192.168.X.X
```

### Step 2: Update Frontend
```javascript
// src/hooks/useSensorData.js
const API_URL = 'http://192.168.X.X:5000/api/sensor-data';
```

### Step 3: Restart Frontend
```powershell
npm start
```

### Step 4: Access from Mobile
```
Open browser on mobile device
Navigate to: http://192.168.X.X:3000
```

## 🔍 Debugging Tips

### Check Backend Logs
```
Look at Terminal 1 where backend is running
Errors will show here with stack traces
```

### Check Frontend Console
```
Press F12 in browser
Go to Console tab
Look for errors (red text)
Check Network tab for failed requests
```

### Test API Manually
```
Open browser
Navigate to: http://localhost:5000/api/health
Should see: {"status":"OK","message":"PhycoSense API is running"}
```

### Verify MongoDB Connection
```javascript
// In server/server.js, connection logs show:
✅ "MongoDB Connected: localhost"
❌ "Error: connect ECONNREFUSED"
```

## 📦 Package Management

### Install Dependencies
```powershell
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
```

### Update Dependencies
```powershell
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

### Clean Install
```powershell
# Remove and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

## 🎯 Testing Checklist

```
□ MongoDB is running (net start MongoDB)
□ Backend server started (cd server; npm run dev)
□ Backend shows "MongoDB Connected"
□ Frontend server started (npm start)
□ Dashboard opens in browser
□ No errors in browser console
□ Data updates every 3 seconds
□ API health check works (http://localhost:5000/api/health)
□ Database receives data (check MongoDB Compass)
□ Charts display correctly
□ Risk levels calculate properly
```

## 🎨 Parameter Thresholds

### Temperature (°C)
- **Low Risk**: 15-19.9 or 25.1-30
- **Medium Risk**: 20-25
- **High Risk**: <15 or >30

### Dissolved Oxygen (mg/L)
- **Low Risk**: 5-12
- **Medium Risk**: 2-4.9
- **High Risk**: <2

### pH Level
- **Low Risk**: 7-8.4
- **Medium Risk**: 6.5-6.9 or 8.5-9
- **High Risk**: <6.5 or >9

### Electrical Conductivity (µS/cm)
- **Low Risk**: 200-799 or 1001-1200
- **Medium Risk**: 800-1000
- **High Risk**: <200 or >1200

### Turbidity (NTU)
- **Low Risk**: 0-9.9 or 50.1-80
- **Medium Risk**: 10-50
- **High Risk**: >80

## 💡 Keyboard Shortcuts

### Browser DevTools
```
F12              - Open Developer Tools
Ctrl + Shift + C - Inspect Element
Ctrl + Shift + J - Open Console
Ctrl + R         - Reload Page
Ctrl + Shift + R - Hard Reload (clear cache)
```

### VS Code (for development)
```
Ctrl + `         - Open Terminal
Ctrl + P         - Quick File Open
Ctrl + Shift + F - Search in Files
Ctrl + /         - Toggle Comment
```

## 📋 File Locations

```
Configuration:
├── Frontend Config: package.json, webpack.config.js
├── Backend Config: server/package.json, server/.env
├── MongoDB Config: server/config/db.js
└── API Routes: server/routes/sensorData.js

Data Models:
└── server/models/SensorData.js

Business Logic:
├── src/hooks/useSensorData.js (data generation & API)
└── src/hooks/useRiskAssessment.js (risk calculation)

Documentation:
├── MONGODB_SETUP.md (setup guide)
├── INTEGRATION_SUMMARY.md (overview)
├── ARCHITECTURE.md (system design)
└── QUICK_REFERENCE.md (this file)
```

## 🆘 Get Help

### Check Logs
1. Backend terminal - server errors
2. Frontend terminal - build errors
3. Browser console - runtime errors
4. MongoDB logs - database errors

### Documentation
1. MONGODB_SETUP.md - Full setup instructions
2. INTEGRATION_SUMMARY.md - System overview
3. ARCHITECTURE.md - System design diagrams
4. server/README.md - API documentation

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot find module" | Missing dependency | Run `npm install` |
| "Port already in use" | Another app using port | Change port or kill process |
| "MongoDB connection failed" | MongoDB not running | Start MongoDB service |
| "CORS error" | Backend not running | Start backend server |
| "Cannot read property" | Data structure mismatch | Check API response format |

## 🎓 Learning Resources

- MongoDB: https://docs.mongodb.com/
- Express.js: https://expressjs.com/
- React Hooks: https://react.dev/reference/react
- Chart.js: https://www.chartjs.org/docs/
- Mongoose: https://mongoosejs.com/docs/

---

**Need more help?** Check the full documentation in MONGODB_SETUP.md or INTEGRATION_SUMMARY.md
