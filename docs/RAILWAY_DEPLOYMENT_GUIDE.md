# 🚂 Railway Deployment Guide - PhycoSense

## Why Railway?
- ✅ **$5 FREE credit every month** (ongoing, not just trial)
- ✅ **No sleep time** - instant ESP32 responses
- ✅ **Auto-detects everything** - minimal configuration
- ✅ **Perfect for IoT** - always-on, low latency

---

## 📋 What We'll Deploy

```
ESP32 → Railway Backend API → MongoDB Atlas
              ↓
        Railway ML Service
              ↓
        Vercel Frontend
```

**Estimated Monthly Cost**: $3-5 (covered by free $5 credit!)

---

## 🚀 Step-by-Step Deployment (30 minutes)

### **Phase 1: Setup Accounts** (5 min)

#### 1.1 Create Railway Account
1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (easiest)
4. No credit card required!

#### 1.2 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (free forever)
3. Create **M0 FREE cluster**
4. Create database user & password (save it!)
5. Network Access → **Allow 0.0.0.0/0** (allow anywhere)
6. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/phycosense?retryWrites=true&w=majority
   ```

---

### **Phase 2: Push Code to GitHub** (5 min)

Open PowerShell in your project folder:

```powershell
cd c:\PD2\algae-monitoring\algae-monitoring\algae-monitoring

# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit for Railway deployment"
git branch -M main

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/phycosense.git
git push -u origin main
```

---

### **Phase 3: Deploy Backend on Railway** (10 min)

#### 3.1 Create New Project
1. In Railway dashboard: **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `phycosense` repository
4. Railway scans and detects Node.js ✅

#### 3.2 Configure Backend Service
1. Railway auto-detects `server/package.json`
2. Click **"Add variables"** button
3. Add these environment variables:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/phycosense?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
```

4. Click **"Settings"** → **"Environment"**
5. **Root Directory**: `server`
6. **Start Command**: `npm start`
7. **Build Command**: `npm install`

#### 3.3 Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- Click **"Settings"** → **"Networking"** → **"Generate Domain"**
- Copy your backend URL: `https://phycosense-backend.up.railway.app`

#### 3.4 Test Backend
```powershell
curl https://YOUR_BACKEND_URL.up.railway.app/api/health
```

Should return: `{"status":"OK","message":"PhycoSense API is running"}`

---

### **Phase 4: Deploy ML Service on Railway** (5 min)

#### 4.1 Add ML Service to Same Project
1. In same Railway project: Click **"+ New"**
2. Select **"GitHub Repo"** → Same repository
3. Railway detects Python ✅

#### 4.2 Configure ML Service
1. Click **"Settings"**
2. **Root Directory**: `ml-service`
3. **Start Command**: `gunicorn -b 0.0.0.0:$PORT ml_service:app`
4. **Build Command**: `pip install -r requirements.txt`

#### 4.3 Deploy
- Click **"Deploy"**
- Generate Domain: `https://phycosense-ml.up.railway.app`

#### 4.4 Test ML Service
```powershell
curl https://YOUR_ML_URL.up.railway.app/health
```

---

### **Phase 5: Deploy Frontend on Vercel** (5 min)

#### 5.1 Install Vercel CLI
```powershell
npm install -g vercel
```

#### 5.2 Create Production Environment File
Create `.env.production` in root folder:
```env
REACT_APP_API_URL=https://YOUR_BACKEND_URL.up.railway.app/api
REACT_APP_ML_SERVICE_URL=https://YOUR_ML_URL.up.railway.app
```

#### 5.3 Deploy
```powershell
cd c:\PD2\algae-monitoring\algae-monitoring\algae-monitoring
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? (choose your account)
- Link to existing project? **N**
- Project name: **phycosense-dashboard**
- Directory: **./** (current)
- Override settings? **Y**
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Development Command: (leave default)

Add environment variables when prompted:
- `REACT_APP_API_URL` = Your Railway backend URL

#### 5.4 Deploy to Production
```powershell
vercel --prod
```

Copy your frontend URL: `https://phycosense-dashboard.vercel.app`

---

### **Phase 6: Update ESP32** (5 min)

#### 6.1 Update Arduino Code
Open `phycosense_complete.ino` and change line 25:

```cpp
// OLD:
String serverUrl = "http://192.168.100.7:5000/api/sensor-data";

// NEW (use your actual Railway URL):
String serverUrl = "https://phycosense-backend.up.railway.app/api/sensor-data";
```

#### 6.2 Flash ESP32
1. Open Arduino IDE
2. Upload code to ESP32
3. Open Serial Monitor (115200 baud)
4. Verify connection:
   - "✓ WiFi Connected!"
   - "✓ Success! Code: 201"

---

## ✅ Verification Checklist

Test everything works:

- [ ] Backend health check: `curl https://YOUR_BACKEND.up.railway.app/api/health`
- [ ] ML service health: `curl https://YOUR_ML.up.railway.app/health`
- [ ] Frontend loads in browser
- [ ] ESP32 Serial Monitor shows "✓ Success!"
- [ ] Dashboard receives sensor data
- [ ] Can select device from dropdown
- [ ] Charts update with new data
- [ ] Export to Excel works

---

## 💰 Cost Monitoring

### Check Your Usage
1. Railway Dashboard → Your Project
2. Click **"Metrics"**
3. See current month usage

### Typical Monthly Costs
- **Backend API**: $2-3/month (light traffic)
- **ML Service**: $1-2/month (occasional use)
- **Frontend (Vercel)**: $0 (free forever)
- **MongoDB Atlas**: $0 (M0 free tier)

**Total: ~$3-5/month = Covered by $5 free credit! 🎉**

### If You Go Over $5
Railway will:
1. Email you a warning
2. Continue service (won't shut down)
3. Prompt for payment method

To reduce costs:
- Optimize queries
- Cache responses
- Review Railway metrics

---

## 🔧 Railway Configuration Files

### Backend (Optional)
Railway auto-detects, but you can add `railway.json` in `/server`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### ML Service (Optional)
Add `railway.json` in `/ml-service`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn -b 0.0.0.0:$PORT ml_service:app --timeout 120",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## 🐛 Troubleshooting

### Backend Won't Start
**Check logs:**
1. Railway Dashboard → Backend Service
2. Click **"Deployments"** → Latest deployment
3. View logs

**Common issues:**
- MongoDB URI incorrect → Double-check connection string
- Missing environment variables → Add in Railway dashboard
- Port binding → Railway sets `$PORT` automatically

### ML Service Python Errors
```powershell
# Test locally first:
cd ml-service
pip install -r requirements.txt
python ml_service.py
```

Check Railway logs for specific errors.

### ESP32 Can't Connect
- ✅ URL must be **HTTPS** (not HTTP)
- ✅ Railway domain should be `.up.railway.app`
- ✅ Check WiFi credentials
- ✅ Verify backend is running (check Railway dashboard)

### "CORS Error" in Frontend
Update `server/server.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: [
    'https://phycosense-dashboard.vercel.app',
    'http://localhost:3000'
  ]
}));
```

Redeploy backend:
```powershell
git add .
git commit -m "Fix CORS"
git push
```
Railway auto-deploys on push!

### Services Not Auto-Deploying
1. Railway Dashboard → Project Settings
2. Check **"Deploy triggers"**
3. Enable **"Watch Paths"** for specific folders

---

## 🎯 Railway Advantages Over Other Platforms

| Feature | Railway | Render (Free) | Heroku |
|---------|---------|---------------|--------|
| Monthly Cost | $5 credit | Free (sleeps) | No free tier |
| Sleep Time | ❌ None | ✅ 15 min | N/A |
| Auto Deploy | ✅ Yes | ✅ Yes | ✅ Yes |
| Setup Time | 20 min | 40 min | 30 min |
| IoT Friendly | ✅ Perfect | ⚠️ Cold starts | ✅ Good |
| Database Included | ✅ Optional | ❌ No | ❌ No |

---

## 📊 Monitoring & Management

### Railway Dashboard
- **Metrics**: CPU, RAM, Network usage
- **Logs**: Real-time application logs
- **Deployments**: History & rollback
- **Environment**: Variables management

### Set Up Alerts
1. Railway Dashboard → Project
2. **"Settings"** → **"Notifications"**
3. Add webhook URL or email for alerts

### Database Monitoring
MongoDB Atlas Dashboard:
- Real-time performance
- Query analytics
- Storage usage
- Backup status

---

## 🚀 Pro Tips

### 1. Auto-Deploy on Git Push
Railway automatically deploys when you push to GitHub:
```powershell
git add .
git commit -m "Update feature"
git push
```
No manual deploy needed! 🎉

### 2. Use Railway CLI (Optional)
```powershell
# Install
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Open dashboard
railway open
```

### 3. Environment Variables Organization
Create `.env.railway` locally (don't commit):
```env
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=production
```

### 4. Domain Configuration
Add custom domain:
1. Railway → Service → Settings → Networking
2. Click **"Custom Domain"**
3. Add your domain (e.g., `api.phycosense.com`)
4. Update DNS records as shown

---

## 🔒 Security Best Practices

### 1. Protect Environment Variables
- Never commit `.env` files
- Use Railway's environment variables
- Rotate MongoDB password periodically

### 2. Rate Limiting
Add to `server/server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per window
});

app.use('/api/', limiter);
```

### 3. HTTPS Only
Railway provides free SSL - always use HTTPS URLs.

### 4. MongoDB Security
- Use strong passwords
- Enable IP whitelist in Atlas (or 0.0.0.0/0 for Railway)
- Regular backups (Atlas automatic)

---

## 📝 Your Deployment URLs

Fill in after deployment:

```
Backend:     https://_________________________.up.railway.app
ML Service:  https://_________________________.up.railway.app
Frontend:    https://_________________________.vercel.app
MongoDB:     mongodb+srv://_________________________________________

Device ID:   ESP32-SENSOR-01
```

---

## 🎓 Next Steps

### After Successful Deployment:

1. **Test Thoroughly**
   - Let ESP32 run for 24 hours
   - Monitor Railway metrics
   - Check data in dashboard

2. **Documentation**
   - Save all URLs
   - Document any custom changes
   - Share access with team

3. **Optimization**
   - Review Railway usage after 1 week
   - Optimize if approaching $5/month
   - Consider caching strategies

4. **Scaling** (When Needed)
   - Railway scales automatically
   - Add more services if needed
   - Upgrade MongoDB cluster if storage fills

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **MongoDB Docs**: https://docs.atlas.mongodb.com
- **Vercel Docs**: https://vercel.com/docs

---

## 🎉 You're Done!

Your PhycoSense system is now:
- ✅ Accessible from anywhere
- ✅ Always online (no sleep)
- ✅ Costs $0/month (under $5 credit)
- ✅ Auto-deploys on git push
- ✅ Professional production setup

**Deployment time: ~30 minutes**  
**Monthly cost: $0 (covered by credit)**  

**Start with Phase 1! 🚂**
