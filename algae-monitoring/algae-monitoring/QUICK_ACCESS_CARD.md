# 🎴 PhycoSense - Quick Access Card

Print or bookmark this page for instant access to all resources!

---

## 🚀 START HERE

### Option 1: Super Fast Setup
```
📄 Read: QUICK_START.md
⏱️ Time: 10 minutes
✅ Result: Running system
```

### Option 2: Complete Setup
```
📄 Read: MONGODB_SETUP.md
⏱️ Time: 30 minutes
✅ Result: Full understanding + running system
```

---

## 📚 DOCUMENTATION MAP

| Need | File | Time |
|------|------|------|
| 🏃 **Quick Start** | QUICK_START.md | 10 min |
| 📖 **Full Setup** | MONGODB_SETUP.md | 30 min |
| ✅ **Track Progress** | SETUP_CHECKLIST.md | 20 min |
| 🎨 **Understand System** | ARCHITECTURE.md | 20 min |
| 📋 **Commands** | QUICK_REFERENCE.md | 10 min |
| 🎉 **What's New** | WHATS_NEW.md | 10 min |
| 📊 **Features** | INTEGRATION_SUMMARY.md | 15 min |
| 🗺️ **Navigation** | DOCUMENTATION_INDEX.md | 5 min |
| ✅ **Status** | COMPLETION_SUMMARY.md | 10 min |
| 📂 **Files** | PROJECT_STRUCTURE.md | 10 min |
| 🎯 **Overview** | MASTER_SUMMARY.md | 5 min |
| 🔌 **API** | server/README.md | 10 min |

---

## ⚡ QUICK COMMANDS

### Start Services
```powershell
# Backend (Terminal 1)
cd server
npm run dev

# Frontend (Terminal 2)
npm start
```

### Check Status
```bash
# Backend health
curl http://localhost:5000/api/health

# Latest data
curl http://localhost:5000/api/sensor-data/latest
```

### MongoDB
```powershell
# Start MongoDB
net start MongoDB

# MongoDB Shell
mongosh
use phycosense
db.sensordatas.find().limit(5)
```

---

## 🌐 ACCESS URLS

| Service | URL |
|---------|-----|
| **Dashboard** | http://localhost:3000 |
| **API** | http://localhost:5000 |
| **Health** | http://localhost:5000/api/health |
| **Latest Data** | http://localhost:5000/api/sensor-data/latest |
| **All Data** | http://localhost:5000/api/sensor-data?limit=20 |
| **Stats** | http://localhost:5000/api/sensor-data/stats |

---

## 🔧 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Backend won't start | Check MongoDB is running: `net start MongoDB` |
| Port 5000 in use | Change PORT in `server/.env` |
| Frontend errors | Ensure backend is running on port 5000 |
| No data saving | Check backend console for MongoDB connection |
| CORS errors | Restart backend server |

---

## 📦 KEY FILES

### Configuration
- **Backend Config**: `server/.env`
- **API URL**: `src/hooks/useSensorData.js` (line 3)
- **Risk Thresholds**: `src/hooks/useRiskAssessment.js`

### Important Code
- **API Routes**: `server/routes/sensorData.js`
- **Data Schema**: `server/models/SensorData.js`
- **Main Server**: `server/server.js`
- **Main App**: `src/App.js`

---

## 🎯 VERIFICATION CHECKLIST

After setup, verify:
- [ ] Backend terminal shows "MongoDB Connected"
- [ ] Frontend opens at http://localhost:3000
- [ ] No errors in browser console (F12)
- [ ] Values update every 3 seconds
- [ ] http://localhost:5000/api/health returns OK
- [ ] MongoDB contains data (use Compass)

---

## 🆘 GET HELP

1. **Commands** → QUICK_REFERENCE.md
2. **Setup Issues** → MONGODB_SETUP.md (Troubleshooting section)
3. **Understanding** → ARCHITECTURE.md
4. **API Questions** → server/README.md

---

## 📱 MOBILE ACCESS

```powershell
# 1. Get your IP
ipconfig
# Look for: 192.168.X.X

# 2. Update API URL
# Edit: src/hooks/useSensorData.js
const API_URL = 'http://192.168.X.X:5000/api/sensor-data';

# 3. Access from phone
http://192.168.X.X:3000
```

---

## 🎓 LEARNING PATHS

### Path 1: Quick (30 min)
```
QUICK_START.md → SETUP_CHECKLIST.md → Done!
```

### Path 2: Complete (90 min)
```
README.md → MONGODB_SETUP.md → ARCHITECTURE.md →
INTEGRATION_SUMMARY.md → QUICK_REFERENCE.md
```

### Path 3: Developer (2 hours)
```
All documentation files in order
```

---

## 🎉 WHAT YOU HAVE

✅ Full-stack application
✅ MongoDB database
✅ RESTful API (6 endpoints)
✅ Real-time monitoring
✅ Data persistence
✅ Mobile responsive
✅ Production ready
✅ 12 comprehensive guides

---

## 📊 QUICK STATS

- **Total Files**: 40+
- **Documentation**: 12 files, 15,000+ words
- **Code**: 1,700+ lines
- **API Endpoints**: 6
- **Setup Time**: ~15 minutes
- **Development Time**: ~13 hours

---

## 🚀 3-STEP QUICK START

### 1️⃣ Install MongoDB (5 min)
```
https://www.mongodb.com/try/download/community
→ Complete installation
→ Install as Windows Service
```

### 2️⃣ Start Backend (30 sec)
```
Double-click: start-backend.bat
Wait for: "MongoDB Connected"
```

### 3️⃣ Start Frontend (30 sec)
```
Double-click: start-frontend.bat
Browser opens automatically
```

---

## 💡 PRO TIPS

- Bookmark **QUICK_REFERENCE.md** for daily use
- Keep both terminals open while using
- Use MongoDB Compass to view database
- Press F12 in browser to see console
- Check backend terminal for errors first

---

## 📞 RESOURCE LINKS

### Official Docs
- MongoDB: https://docs.mongodb.com
- Express: https://expressjs.com
- React: https://react.dev
- Mongoose: https://mongoosejs.com

### Project Docs
- Main: README.md
- Setup: MONGODB_SETUP.md
- Commands: QUICK_REFERENCE.md
- Architecture: ARCHITECTURE.md

---

## ✅ SUCCESS WHEN...

- ✅ Two terminals running (backend + frontend)
- ✅ Dashboard loads and updates
- ✅ API responds to requests
- ✅ MongoDB contains data
- ✅ No errors in consoles
- ✅ Data persists after refresh

---

**READY TO START?**

1. Pick a learning path above
2. Read the guide (10-30 min)
3. Follow the steps
4. Verify it works
5. Start monitoring! 🌊🔬

---

**BOOKMARK THIS PAGE!** 📑

*Last Updated: October 2025*
*Version: 2.0 Full Stack*
*Status: Ready to Deploy ✅*
