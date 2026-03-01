# 🚂 Railway Quick Deployment Checklist

## ⏱️ Estimated Time: 30 minutes
## 💰 Cost: $0/month (covered by $5 free credit)

---

## Phase 1: Accounts Setup ✅

### MongoDB Atlas (5 min)
- [ ] Sign up at https://cloud.mongodb.com
- [ ] Create M0 FREE cluster
- [ ] Create database user (save username & password!)
- [ ] Network Access → Allow 0.0.0.0/0
- [ ] Get connection string
- [ ] Connection string saved: `mongodb+srv://...`

### Railway Account (2 min)
- [ ] Sign up at https://railway.app
- [ ] Connect with GitHub account
- [ ] Dashboard accessible

---

## Phase 2: GitHub Setup ✅

```powershell
cd c:\PD2\algae-monitoring\algae-monitoring\algae-monitoring
git init
git add .
git commit -m "Initial commit for Railway"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/phycosense.git
git push -u origin main
```

- [ ] Git repository initialized
- [ ] Code pushed to GitHub
- [ ] Repository URL: __________________________________

---

## Phase 3: Deploy Backend (10 min) ✅

### In Railway Dashboard:
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository
- [ ] Railway detects Node.js

### Configure Backend:
- [ ] Click service → Settings → Root Directory: `server`
- [ ] Start Command: `npm start`
- [ ] Build Command: `npm install`

### Add Environment Variables:
```
MONGODB_URI = mongodb+srv://your_connection_string
PORT = 5000
NODE_ENV = production
```
- [ ] Environment variables added
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 min)

### Generate Domain:
- [ ] Settings → Networking → Generate Domain
- [ ] Backend URL: https://_____________________________.up.railway.app

### Test Backend:
```powershell
curl https://YOUR_BACKEND_URL.up.railway.app/api/health
```
- [ ] Health check returns: `{"status":"OK"}`

---

## Phase 4: Deploy ML Service (5 min) ✅

### In Same Railway Project:
- [ ] Click "+ New" → GitHub Repo (same repo)
- [ ] Railway detects Python

### Configure ML Service:
- [ ] Settings → Root Directory: `ml-service`
- [ ] Start Command: `gunicorn -b 0.0.0.0:$PORT ml_service:app`
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Click "Deploy"

### Generate Domain:
- [ ] Settings → Networking → Generate Domain
- [ ] ML URL: https://_____________________________.up.railway.app

### Test ML Service:
```powershell
curl https://YOUR_ML_URL.up.railway.app/health
```
- [ ] Health check successful

---

## Phase 5: Deploy Frontend (5 min) ✅

### Create .env.production:
```env
REACT_APP_API_URL=https://YOUR_BACKEND_URL.up.railway.app/api
REACT_APP_ML_SERVICE_URL=https://YOUR_ML_URL.up.railway.app
```
- [ ] .env.production created with your URLs

### Deploy with Vercel:
```powershell
npm install -g vercel
cd c:\PD2\algae-monitoring\algae-monitoring\algae-monitoring
vercel
```

Follow prompts:
- [ ] Project name: phycosense-dashboard
- [ ] Build Command: npm run build
- [ ] Output Directory: dist
- [ ] Environment variable added: REACT_APP_API_URL

### Production Deploy:
```powershell
vercel --prod
```
- [ ] Frontend URL: https://_____________________________.vercel.app
- [ ] Frontend loads in browser

---

## Phase 6: Update ESP32 (5 min) ✅

### Update Arduino Code:
Open `phycosense_complete.ino`, line 25:
```cpp
String serverUrl = "https://YOUR_BACKEND_URL.up.railway.app/api/sensor-data";
```

- [ ] Server URL updated with Railway backend URL
- [ ] WiFi credentials correct
- [ ] Code uploaded to ESP32

### Test ESP32:
- [ ] Serial Monitor open (115200 baud)
- [ ] "✓ WiFi Connected!" appears
- [ ] "✓ Success! Code: 201" appears
- [ ] Data sending every 5 seconds

---

## Phase 7: End-to-End Testing ✅

### Dashboard Testing:
- [ ] Open frontend URL in browser
- [ ] Device dropdown shows "ESP32-SENSOR-01"
- [ ] Select device
- [ ] Temperature data displaying
- [ ] EC data displaying
- [ ] Turbidity data displaying
- [ ] Battery status showing
- [ ] Charts updating
- [ ] Export to Excel works

### Backend Testing:
- [ ] Railway logs show incoming requests
- [ ] No errors in logs
- [ ] MongoDB Atlas shows data entries

### Performance Check:
- [ ] Page loads in < 3 seconds
- [ ] No CORS errors in console
- [ ] Data updates smoothly

---

## Phase 8: Monitor (24 hours) ✅

### After 1 Day:
- [ ] Railway dashboard → Check usage
- [ ] Should be well under $5/month
- [ ] Backend uptime: 100%
- [ ] ML service uptime: 100%
- [ ] No errors in logs

### MongoDB Check:
- [ ] Atlas dashboard → Data explorer
- [ ] Sensor data entries present
- [ ] Storage usage < 100MB

---

## 📊 Your Deployment Info

```
=== PRODUCTION URLS ===
Backend:     https://________________________________.up.railway.app
ML Service:  https://________________________________.up.railway.app
Frontend:    https://________________________________.vercel.app

=== DATABASE ===
MongoDB:     mongodb+srv://_______________________________________

=== CREDENTIALS ===
Database User: ___________________
Device ID:     ESP32-SENSOR-01

=== GITHUB ===
Repository:    https://github.com/_________________/phycosense
```

---

## 💰 Cost Tracking

### Current Month Usage:
Check: Railway Dashboard → Project → Usage

```
Backend:     $______ / $5.00 credit
ML Service:  $______ / $5.00 credit
Total:       $______ / $5.00 credit
Remaining:   $______
```

**Expected**: $3-5/month (fully covered!)

---

## 🎯 Optional Enhancements

### Add Custom Domain:
- [ ] Buy domain (e.g., phycosense.com)
- [ ] Railway → Settings → Custom Domain
- [ ] Update DNS records
- [ ] Update ESP32 URL

### Setup Monitoring:
- [ ] UptimeRobot account
- [ ] Add health check monitors
- [ ] Email alerts configured

### Enable Auto-Deploy:
- [ ] Railway auto-deploys on git push (already enabled!)
- [ ] Test: Make a change, push, watch deploy

---

## 🐛 Troubleshooting

### Backend Issues:
```powershell
# View Railway logs
railway logs --service backend

# Check locally
cd server
npm install
npm start
```

### ML Service Issues:
```powershell
# Test locally
cd ml-service
pip install -r requirements.txt
python ml_service.py
```

### ESP32 Issues:
- ✅ URL must be HTTPS
- ✅ Check WiFi credentials
- ✅ Verify backend is online (Railway dashboard)
- ✅ Serial Monitor at 115200 baud

### Frontend Issues:
```powershell
# Test build locally
npm run build

# Check .env.production has correct URLs
```

---

## ✅ Success Criteria

You're fully deployed when:

- ✅ ESP32 sends data every 5 seconds
- ✅ Dashboard shows real-time updates
- ✅ No errors in Railway logs
- ✅ Monthly cost < $5 (covered by credit)
- ✅ Services never sleep
- ✅ Accessible from any device with internet

---

## 🎉 Congratulations!

Your PhycoSense system is now:
- 🌍 **Globally accessible**
- 🚀 **Production-ready**
- 💰 **Free to run** (under $5/month)
- ⚡ **Always online** (no cold starts)
- 🔄 **Auto-deploys** (git push → live)

**Total deployment time**: ~30 minutes  
**Monthly cost**: $0 (covered by credit)  
**Uptime**: 99.9%+

---

## 📞 Support Resources

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Vercel Docs: https://vercel.com/docs

---

**Ready? Start with Phase 1! 🚂**

---

## 🔄 Quick Commands Reference

### Deploy Updates:
```powershell
git add .
git commit -m "Your update message"
git push
# Railway auto-deploys!
```

### View Logs:
```powershell
# Install Railway CLI
npm install -g @railway/cli
railway login
railway link
railway logs
```

### Rollback (if needed):
1. Railway Dashboard → Service → Deployments
2. Click previous deployment
3. Click "Redeploy"

---

**Save this checklist! Check off items as you complete them.**
