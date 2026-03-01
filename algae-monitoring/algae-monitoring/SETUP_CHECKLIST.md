# MongoDB Integration Setup Checklist

Use this checklist to track your MongoDB integration setup progress.

## 📋 Pre-Setup Checklist

- [x] ✅ Backend code created (`/server` directory)
- [x] ✅ Frontend integration completed (useSensorData.js, App.js)
- [x] ✅ Backend dependencies installed (npm install complete)
- [x] ✅ Documentation created (5 comprehensive guides)
- [x] ✅ Startup scripts ready (batch files)
- [ ] ⏳ MongoDB installed
- [ ] ⏳ Backend server running
- [ ] ⏳ Frontend server running
- [ ] ⏳ Data logging verified

---

## Step 1: MongoDB Installation ⏳

Choose ONE option:

### Option A: Local MongoDB (Recommended for Development)
- [ ] Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
- [ ] Run installer (select "Complete" installation)
- [ ] Choose "Install as Windows Service" (checked by default)
- [ ] Complete installation
- [ ] Verify installation:
  ```powershell
  mongod --version
  ```
- [ ] Start MongoDB service:
  ```powershell
  net start MongoDB
  ```

### Option B: MongoDB Atlas (Cloud)
- [ ] Create account at https://www.mongodb.com/cloud/atlas
- [ ] Create a new free cluster
- [ ] Create database user (username + password)
- [ ] Add IP whitelist: 0.0.0.0/0 (allow from anywhere)
- [ ] Get connection string from Atlas dashboard
- [ ] Update `server/.env` with connection string

**MongoDB Installation Status:** ❌ Not Installed | ⏳ In Progress | ✅ Complete

---

## Step 2: Backend Configuration ⏳

- [ ] Navigate to `server/` directory
- [ ] Open `.env` file
- [ ] Verify/Update MongoDB connection string:
  - Local: `mongodb://localhost:27017/phycosense`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/phycosense`
- [ ] Save `.env` file

**Configuration Status:** ❌ Not Done | ✅ Complete

---

## Step 3: Start Backend Server ⏳

Choose ONE method:

### Method A: Using Batch File (Easy)
- [ ] Double-click `start-backend.bat`
- [ ] Wait for "Server running on port 5000"
- [ ] Wait for "MongoDB Connected: localhost" (or your host)
- [ ] Keep this terminal window open

### Method B: Manual Start
- [ ] Open PowerShell/Terminal
- [ ] Navigate to server directory:
  ```powershell
  cd server
  ```
- [ ] Enable script execution:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
- [ ] Start server:
  ```powershell
  npm run dev
  ```
- [ ] Wait for success messages
- [ ] Keep terminal open

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: localhost
```

**Backend Status:** ❌ Not Running | ⏳ Starting | ✅ Running

---

## Step 4: Verify Backend ⏳

- [ ] Open browser
- [ ] Navigate to: http://localhost:5000/api/health
- [ ] Expected response:
  ```json
  {"status":"OK","message":"PhycoSense API is running"}
  ```
- [ ] If successful, backend is working! ✅

**Backend Verification:** ❌ Failed | ⏳ Testing | ✅ Verified

---

## Step 5: Start Frontend Dashboard ⏳

Choose ONE method:

### Method A: Using Batch File (Easy)
- [ ] Double-click `start-frontend.bat`
- [ ] Wait for browser to open automatically
- [ ] Dashboard should load at http://localhost:3000

### Method B: Manual Start
- [ ] Open NEW PowerShell/Terminal (keep backend running)
- [ ] Navigate to project root:
  ```powershell
  cd d:\algae-monitoring\algae-monitoring
  ```
- [ ] Start frontend:
  ```powershell
  npm start
  ```
- [ ] Wait for browser to open
- [ ] Dashboard loads at http://localhost:3000

**Frontend Status:** ❌ Not Running | ⏳ Starting | ✅ Running

---

## Step 6: Verify Integration ⏳

### Browser Tests
- [ ] Dashboard loads without errors
- [ ] Open browser console (F12)
- [ ] No red error messages in console
- [ ] Sensor values update every 3 seconds
- [ ] Charts display data
- [ ] Risk assessment shows level

### API Tests
- [ ] Open new browser tab
- [ ] Navigate to: http://localhost:5000/api/sensor-data/latest
- [ ] Should show most recent sensor reading JSON
- [ ] Refresh page a few times
- [ ] Values should change (new data being logged)

### MongoDB Tests (Local MongoDB Only)

**Option 1: MongoDB Compass (GUI)**
- [ ] Open MongoDB Compass
- [ ] Connect to: mongodb://localhost:27017
- [ ] Expand "phycosense" database
- [ ] Open "sensordatas" collection
- [ ] Should see documents (1 every 3 seconds)
- [ ] Check timestamp field is updating

**Option 2: Command Line (mongosh)**
- [ ] Open terminal
- [ ] Run: `mongosh`
- [ ] Run: `use phycosense`
- [ ] Run: `db.sensordatas.countDocuments()`
- [ ] Should return number > 0
- [ ] Run: `db.sensordatas.find().sort({timestamp: -1}).limit(1)`
- [ ] Should show latest document

**Integration Verification:** ❌ Failed | ⏳ Testing | ✅ Verified

---

## Step 7: Final Validation ⏳

### Data Flow Test
- [ ] Watch dashboard for 30 seconds
- [ ] Count ~10 updates (every 3 seconds)
- [ ] Check MongoDB (should have ~10 new documents)
- [ ] Refresh dashboard page
- [ ] Historical data should persist (not reset)

### Network Test (Optional - Mobile Access)
- [ ] Find computer IP: `ipconfig`
- [ ] Update `src/hooks/useSensorData.js`:
  ```javascript
  const API_URL = 'http://YOUR_IP:5000/api/sensor-data';
  ```
- [ ] Restart frontend
- [ ] Access from mobile: http://YOUR_IP:3000
- [ ] Dashboard works on mobile device

**Final Validation:** ❌ Failed | ✅ Complete

---

## Troubleshooting

### Backend Won't Start

**Problem:** Port 5000 already in use
```
Solution:
1. Open server/.env
2. Change: PORT=5001
3. Update src/hooks/useSensorData.js:
   const API_URL = 'http://localhost:5001/api/sensor-data';
4. Restart backend
```

**Problem:** MongoDB connection failed
```
Solution (Local):
1. Check MongoDB service: sc query MongoDB
2. Start if needed: net start MongoDB
3. Retry backend start

Solution (Atlas):
1. Verify connection string in .env
2. Check username/password
3. Verify IP whitelist (0.0.0.0/0)
4. Test connection in MongoDB Compass
```

**Problem:** npm command not found
```
Solution:
1. Install Node.js from https://nodejs.org
2. Restart terminal
3. Verify: node --version
```

### Frontend Won't Start

**Problem:** npm command not found
```
Solution:
1. Ensure you're in project root (not /server)
2. Run: npm install
3. Retry: npm start
```

**Problem:** Port 3000 already in use
```
Solution:
1. Stop other React apps
2. Or change port in package.json scripts
```

### No Data in MongoDB

**Problem:** Documents not appearing
```
Solution:
1. Check backend console for errors
2. Verify API call in browser console (F12 → Network tab)
3. Test manually:
   curl -X POST http://localhost:5000/api/sensor-data \
     -H "Content-Type: application/json" \
     -d '{"temperature":25,"dissolvedOxygen":7,"ph":7,"electricalConductivity":500,"turbidity":10,"riskLevel":"Low"}'
4. Check MongoDB again
```

### CORS Errors

**Problem:** Browser shows CORS errors
```
Solution:
1. Verify backend is running
2. Check server.js has: app.use(cors())
3. Restart backend server
4. Clear browser cache (Ctrl+Shift+Delete)
```

---

## Quick Command Reference

```powershell
# Start MongoDB (Local)
net start MongoDB

# Check MongoDB Status
sc query MongoDB

# Backend Start (in /server directory)
npm run dev

# Frontend Start (in project root)
npm start

# Test Backend Health
curl http://localhost:5000/api/health

# View Latest Data
curl http://localhost:5000/api/sensor-data/latest

# MongoDB Shell
mongosh
use phycosense
db.sensordatas.find().limit(5)
```

---

## Success Criteria ✅

All of these should be TRUE:

- [ ] ✅ Two terminal windows running (backend + frontend)
- [ ] ✅ Backend shows "MongoDB Connected"
- [ ] ✅ Dashboard loads at http://localhost:3000
- [ ] ✅ No errors in browser console
- [ ] ✅ Values update every 3 seconds
- [ ] ✅ http://localhost:5000/api/health returns OK
- [ ] ✅ http://localhost:5000/api/sensor-data/latest shows data
- [ ] ✅ MongoDB contains sensor data documents
- [ ] ✅ Data persists after page refresh

**Overall Status:** ❌ Incomplete | ⏳ In Progress | ✅ COMPLETE!

---

## What's Next?

Once all checkboxes are ✅:

### Immediate Next Steps
- [ ] Explore other API endpoints (/stats, etc.)
- [ ] Export data to Excel
- [ ] Test on mobile device
- [ ] Review MongoDB data in Compass

### Development Tasks
- [ ] Replace simulated data with real sensors
- [ ] Add user authentication
- [ ] Implement email/SMS alerts
- [ ] Create custom date range reports
- [ ] Deploy to production server

### Learning Resources
- [ ] Read ARCHITECTURE.md for system design
- [ ] Review QUICK_REFERENCE.md for commands
- [ ] Explore MongoDB documentation
- [ ] Learn about Express.js routing

---

## Need Help?

1. **Setup Issues** → MONGODB_SETUP.md
2. **Commands** → QUICK_REFERENCE.md  
3. **Architecture** → ARCHITECTURE.md
4. **API Reference** → server/README.md
5. **What Changed** → WHATS_NEW.md

---

**Date Started:** ________________

**Date Completed:** ________________

**Notes:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
