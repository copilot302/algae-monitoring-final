# 🚀 Quick Start Guide - PhycoSense with MongoDB

## ⚡ Fastest Way to Get Started (3 Steps)

### Prerequisites Check ✓
```
✓ Node.js installed (check: node --version)
✓ Project downloaded/cloned
✓ Terminal/PowerShell available
```

---

## 🎯 STEP 1: Install MongoDB (5 minutes)

### Windows Installation (Recommended)

1. **Download MongoDB**
   ```
   https://www.mongodb.com/try/download/community
   ```

2. **Run Installer**
   - Select "Complete" installation
   - Keep "Install as Windows Service" checked ✓
   - Click through to finish

3. **Verify Installation**
   ```powershell
   mongod --version
   # Should show MongoDB version number
   ```

4. **Start MongoDB** (should auto-start, but if not):
   ```powershell
   net start MongoDB
   ```

✅ **MongoDB Ready!**

---

## 🎯 STEP 2: Start Backend (30 seconds)

### Option A: Double-Click Batch File 👆
```
📁 algae-monitoring/
    📄 start-backend.bat  ← Double-click this
```

### Option B: Terminal Command
```powershell
cd d:\algae-monitoring\algae-monitoring\server
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

### ✅ Success When You See:
```
✓ Server running on port 5000
✓ MongoDB Connected: localhost
```

**Keep this terminal open!** ⚠️

---

## 🎯 STEP 3: Start Frontend (30 seconds)

### Option A: Double-Click Batch File 👆
```
📁 algae-monitoring/
    📄 start-frontend.bat  ← Double-click this
```

### Option B: Terminal Command (NEW terminal)
```powershell
cd d:\algae-monitoring\algae-monitoring
npm start
```

### ✅ Success When You See:
```
✓ Compiled successfully!
✓ Browser opens automatically
✓ Dashboard loads at http://localhost:3000
```

---

## 🎉 YOU'RE DONE!

### What Should Be Happening Now:

```
┌─────────────────────────────┐
│  Terminal 1 (Backend)       │
│  "Server running..."        │  ← Keep open
│  "MongoDB Connected..."     │
└─────────────────────────────┘

┌─────────────────────────────┐
│  Terminal 2 (Frontend)      │
│  "Compiled successfully!"   │  ← Keep open
└─────────────────────────────┘

┌─────────────────────────────┐
│  Browser                    │
│  PhycoSense Dashboard       │  ← Auto-updates every 3sec
│  http://localhost:3000      │
└─────────────────────────────┘

┌─────────────────────────────┐
│  MongoDB Database           │
│  Storing data every 3sec    │  ← Check with Compass
└─────────────────────────────┘
```

---

## 🧪 Quick Verification (1 minute)

### Test 1: Backend Health
Open browser → `http://localhost:5000/api/health`
```json
✅ {"status":"OK","message":"PhycoSense API is running"}
```

### Test 2: Latest Data
Open browser → `http://localhost:5000/api/sensor-data/latest`
```json
✅ {
  "temperature": 22.5,
  "dissolvedOxygen": 7.2,
  ...
}
```

### Test 3: Dashboard Working
- ✅ Values update every 3 seconds
- ✅ Charts animate
- ✅ Risk assessment shows level
- ✅ No errors in browser console (F12)

### Test 4: Data Persisted
- ✅ Refresh page (F5)
- ✅ Data doesn't reset to initial values
- ✅ Charts still show historical trend

---

## 🎨 Visual System Status

### All Systems Go! ✅
```
┌────────────────────────────────────────┐
│                                        │
│   🌐 Frontend                          │
│   http://localhost:3000     [RUNNING]  │
│                ↕                       │
│   ⚙️  Backend                          │
│   http://localhost:5000     [RUNNING]  │
│                ↕                       │
│   💾 MongoDB                           │
│   localhost:27017           [RUNNING]  │
│                                        │
│   📊 Data Flow:  ✅ Active             │
│   🔄 Auto-Logging: Every 3 seconds     │
│   💿 Storage: Persistent               │
│                                        │
└────────────────────────────────────────┘
```

---

## 📱 Bonus: Mobile Access (Optional)

### Quick Mobile Setup (2 minutes)

1. **Find Your IP**
   ```powershell
   ipconfig
   # Look for: IPv4 Address . . . : 192.168.X.X
   ```

2. **Update API URL**
   - Open: `src/hooks/useSensorData.js`
   - Change line 3:
     ```javascript
     const API_URL = 'http://192.168.X.X:5000/api/sensor-data';
     ```
   - Save file

3. **Restart Frontend**
   - Stop frontend (Ctrl+C in terminal)
   - Run: `npm start`

4. **Access from Phone**
   - Connect phone to same WiFi
   - Open browser
   - Go to: `http://192.168.X.X:3000`
   - ✅ Dashboard works on mobile!

---

## 🆘 Troubleshooting

### Problem: Backend won't start

**Error:** "Port 5000 already in use"
```powershell
# Solution: Kill process
netstat -ano | findstr :5000
taskkill /PID <number> /F
```

**Error:** "MongoDB connection failed"
```powershell
# Solution: Start MongoDB
net start MongoDB
```

### Problem: Frontend won't start

**Error:** "npm not found"
```
Solution: Install Node.js from https://nodejs.org
```

**Error:** "Port 3000 already in use"
```
Solution: Close other React apps or use different port
```

### Problem: No data in database

**Check backend terminal:**
```
Should see: "MongoDB Connected: localhost"
If not, MongoDB isn't running
```

**Test manually:**
```powershell
curl http://localhost:5000/api/sensor-data/latest
# Should return sensor data JSON
```

---

## 📚 Documentation Map

```
START HERE → QUICK_START.md (this file)
             ↓
Need Setup Details? → MONGODB_SETUP.md
             ↓
Want Commands? → QUICK_REFERENCE.md
             ↓
Understand System? → ARCHITECTURE.md
             ↓
See What Changed? → WHATS_NEW.md
             ↓
Track Progress? → SETUP_CHECKLIST.md
             ↓
API Reference? → server/README.md
             ↓
Full Overview? → INTEGRATION_SUMMARY.md
```

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Install MongoDB | 5-10 min |
| Install Dependencies | 2 min |
| Start Backend | 30 sec |
| Start Frontend | 30 sec |
| Verify Everything | 2 min |
| **TOTAL** | **10-15 min** |

---

## 🎯 Success Checklist

After following this guide, you should have:

- [x] ✅ MongoDB installed and running
- [x] ✅ Backend server running (port 5000)
- [x] ✅ Frontend dashboard running (port 3000)
- [x] ✅ Data logging every 3 seconds
- [x] ✅ Dashboard displaying real-time data
- [x] ✅ Database storing sensor readings
- [x] ✅ API endpoints responding
- [x] ✅ No errors in console

---

## 🎓 What You've Accomplished

You now have:
- ✨ Full-stack web application
- ✨ Real-time monitoring dashboard
- ✨ REST API backend
- ✨ Persistent database storage
- ✨ Production-ready architecture
- ✨ Mobile-accessible interface

**Congratulations!** 🎉

---

## 🚀 Next Steps

### Explore the System
```bash
# View all data (last 20)
curl http://localhost:5000/api/sensor-data?limit=20

# Get statistics
curl http://localhost:5000/api/sensor-data/stats

# Export to Excel (use dashboard button)
```

### Learn More
- Read `ARCHITECTURE.md` for system design
- Review `QUICK_REFERENCE.md` for all commands
- Check `MONGODB_SETUP.md` for advanced setup

### Development
- Replace simulated data with real sensors
- Add user authentication
- Implement email alerts
- Deploy to production

---

## 💬 Support

**Need help?**
1. Check `QUICK_REFERENCE.md` for common commands
2. See `MONGODB_SETUP.md` for detailed troubleshooting
3. Review terminal output for error messages
4. Check browser console (F12) for frontend errors

---

## 📝 Quick Commands

```powershell
# Start MongoDB
net start MongoDB

# Start Backend
cd server; npm run dev

# Start Frontend  
npm start

# Health Check
curl http://localhost:5000/api/health

# View Latest Data
curl http://localhost:5000/api/sensor-data/latest
```

---

**You're all set!** The PhycoSense dashboard is now running with full MongoDB integration. 🌊🔬

**Happy Monitoring!** 🎉
