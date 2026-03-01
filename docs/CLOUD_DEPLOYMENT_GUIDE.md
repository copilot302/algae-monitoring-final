# 🚀 Cloud Deployment Guide - PhycoSense Algae Monitoring System

## Overview
This guide walks you through deploying your PhycoSense system to the cloud, making it accessible from anywhere with internet connectivity.

---

## 📋 Deployment Architecture

```
ESP32 Device → Cloud Backend API → MongoDB Atlas (Database)
                       ↓
                 ML Service → Predictions
                       ↓
                 Frontend Dashboard (React)
```

---

## 🎯 Recommended Cloud Platform Setup

### **Option 1: Render (Recommended - Free Tier Available)**
- ✅ Easy deployment
- ✅ Free tier for testing
- ✅ Auto-deploys from GitHub
- ✅ Supports Node.js, Python, and static sites

### **Option 2: Railway**
- ✅ Simple setup
- ✅ $5/month free credit
- ✅ Excellent MongoDB integration

### **Option 3: Heroku**
- ✅ Well-documented
- ⚠️ No longer has free tier

---

## 📦 Step-by-Step Deployment (Using Render + MongoDB Atlas)

### **Phase 1: Database Setup (MongoDB Atlas - FREE)**

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free account

2. **Create a Cluster**
   - Choose **FREE M0 Tier**
   - Select region closest to you
   - Cluster Name: `phycosense-cluster`

3. **Create Database User**
   - Go to: Database Access → Add New Database User
   - Username: `phycosense_admin`
   - Password: (Generate and save securely)
   - Role: **Read and write to any database**

4. **Whitelist IP Addresses**
   - Go to: Network Access → Add IP Address
   - Click: **Allow Access from Anywhere** (0.0.0.0/0)
   - (For production, restrict to specific IPs)

5. **Get Connection String**
   - Click: **Connect** → **Connect your application**
   - Copy connection string:
   ```
   mongodb+srv://phycosense_admin:<password>@phycosense-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

---

### **Phase 2: Backend Deployment (Render)**

1. **Prepare Backend for Deployment**
   
   Create `.env.example` in `/server` folder:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   PORT=5000
   NODE_ENV=production
   ```

   Create `render.yaml` in `/server` folder:
   ```yaml
   services:
     - type: web
       name: phycosense-backend
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: MONGODB_URI
           sync: false
         - key: PORT
           value: 5000
         - key: NODE_ENV
           value: production
   ```

2. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for cloud deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/phycosense.git
   git push -u origin main
   ```

3. **Deploy on Render**
   - Go to: https://render.com
   - Sign up / Login with GitHub
   - Click: **New** → **Web Service**
   - Connect your GitHub repo
   - Settings:
     - Name: `phycosense-backend`
     - Environment: `Node`
     - Build Command: `cd server && npm install`
     - Start Command: `cd server && npm start`
     - Instance Type: **Free**
   
4. **Set Environment Variables**
   - In Render dashboard → Environment
   - Add:
     - `MONGODB_URI` = Your Atlas connection string
     - `PORT` = 5000
     - `NODE_ENV` = production

5. **Deploy**
   - Click **Create Web Service**
   - Wait 5-10 minutes for deployment
   - Copy your backend URL: `https://phycosense-backend.onrender.com`

6. **Test API**
   ```bash
   curl https://phycosense-backend.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"PhycoSense API is running"}`

---

### **Phase 3: ML Service Deployment (Render)**

1. **Prepare ML Service**
   
   Create `render.yaml` in `/ml-service` folder:
   ```yaml
   services:
     - type: web
       name: phycosense-ml-service
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: gunicorn -b 0.0.0.0:$PORT ml_service:app
   ```

2. **Update requirements.txt**
   Add to `/ml-service/requirements.txt`:
   ```
   gunicorn==21.2.0
   ```

3. **Deploy on Render**
   - Click: **New** → **Web Service**
   - Connect same GitHub repo
   - Settings:
     - Name: `phycosense-ml-service`
     - Root Directory: `ml-service`
     - Environment: `Python`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `gunicorn -b 0.0.0.0:$PORT ml_service:app`
     - Instance Type: **Free**
   
4. **Deploy & Test**
   - Copy ML service URL: `https://phycosense-ml-service.onrender.com`

---

### **Phase 4: Frontend Deployment**

#### **Option A: Deploy on Render (Static Site)**

1. **Update API URL in Frontend**
   
   Create `.env.production` in root folder:
   ```env
   REACT_APP_API_URL=https://phycosense-backend.onrender.com/api
   REACT_APP_ML_SERVICE_URL=https://phycosense-ml-service.onrender.com
   ```

2. **Update Build Script**
   
   In main `package.json`, ensure build command exists:
   ```json
   "scripts": {
     "build": "webpack --mode production",
     "start": "webpack serve --mode development"
   }
   ```

3. **Deploy on Render**
   - Click: **New** → **Static Site**
   - Connect GitHub repo
   - Settings:
     - Name: `phycosense-dashboard`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`
   - Deploy
   - Copy frontend URL: `https://phycosense-dashboard.onrender.com`

#### **Option B: Deploy on Vercel (Faster, Recommended)**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd c:\PD2\algae-monitoring\algae-monitoring\algae-monitoring
   vercel
   ```
   - Follow prompts
   - Set environment variables when asked:
     - `REACT_APP_API_URL` = Your backend URL
   
3. **Production Deployment**
   ```bash
   vercel --prod
   ```

---

### **Phase 5: Update ESP32 Configuration**

1. **Update the Server URL in Arduino Code**
   
   In `phycosense_complete.ino`, line 25:
   ```cpp
   // OLD (Local):
   String serverUrl = "http://192.168.100.7:5000/api/sensor-data";
   
   // NEW (Cloud):
   String serverUrl = "https://phycosense-backend.onrender.com/api/sensor-data";
   ```

2. **Recompile & Upload to ESP32**
   - Open Arduino IDE
   - Upload updated code to ESP32
   - Open Serial Monitor to verify connection

3. **Verify Data Flow**
   - Check Serial Monitor for "✓ Success!"
   - Check dashboard for incoming data

---

## 🔒 Security Best Practices

### 1. **Environment Variables**
Never commit `.env` files. Always use:
- `.env.example` (template without real values)
- Platform environment variable settings

### 2. **CORS Configuration**
Update backend `server.js`:
```javascript
const allowedOrigins = [
  'https://phycosense-dashboard.onrender.com',
  'http://localhost:3000' // For local development
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

### 3. **API Rate Limiting**
Add to backend:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. **HTTPS Only**
- Render provides free SSL certificates
- Always use `https://` URLs in production

### 5. **MongoDB Security**
- Use strong passwords
- Enable MongoDB Atlas IP whitelist
- Regular backups

---

## 📊 Monitoring & Maintenance

### **Free Monitoring Tools**

1. **Render Dashboard**
   - View logs
   - Monitor uptime
   - Check resource usage

2. **MongoDB Atlas**
   - Database metrics
   - Query performance
   - Storage usage

3. **UptimeRobot** (Optional)
   - Free uptime monitoring
   - Get alerts if service goes down
   - https://uptimerobot.com

### **Health Check Endpoints**

Add to your monitoring:
- Backend: `https://phycosense-backend.onrender.com/api/health`
- ML Service: `https://phycosense-ml-service.onrender.com/health`

---

## 💰 Cost Breakdown

### **Free Tier (Sufficient for Testing & Small Deployments)**
- MongoDB Atlas: FREE (512MB storage)
- Render Backend: FREE (750 hours/month)
- Render ML Service: FREE (750 hours/month)
- Render Frontend: FREE (100GB bandwidth)
- **Total: $0/month**

⚠️ **Free tier limitations:**
- Services sleep after 15 minutes of inactivity
- Cold start takes ~30 seconds
- 750 hours/month ≈ 31 days if running 24/7

### **Paid Tier (For Production)**
- MongoDB Atlas: $9/month (M2 cluster)
- Render Backend: $7/month (always on)
- Render ML Service: $7/month (always on)
- Render Frontend: FREE
- **Total: ~$23/month**

---

## 🐛 Troubleshooting

### **ESP32 Can't Connect to Cloud Server**
- ✅ Check WiFi connection
- ✅ Verify server URL (must be HTTPS)
- ✅ Check Render logs for errors
- ✅ Test API with `curl` or Postman

### **Service Sleeping (Free Tier)**
- Free Render services sleep after 15 min inactivity
- First request takes 30-60 seconds to wake up
- Solution: Upgrade to paid plan or use cron job to ping every 10 minutes

### **CORS Errors**
- Check allowed origins in backend
- Ensure frontend URL is whitelisted

### **MongoDB Connection Errors**
- Verify connection string
- Check IP whitelist (0.0.0.0/0 for global access)
- Confirm database user credentials

---

## 🚀 Quick Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed on Render
- [ ] ML service deployed on Render
- [ ] Frontend deployed on Vercel/Render
- [ ] Environment variables configured
- [ ] ESP32 code updated with cloud URL
- [ ] ESP32 flashed and tested
- [ ] Dashboard accessible from internet
- [ ] Data flowing end-to-end
- [ ] Monitoring setup (optional)

---

## 📞 Next Steps

1. **Test thoroughly** - Verify all components work together
2. **Setup monitoring** - Use UptimeRobot for alerts
3. **Document URLs** - Save all your cloud URLs
4. **Backup strategy** - MongoDB Atlas auto-backup enabled
5. **Consider upgrading** - If you need 24/7 uptime

---

## 🔗 Useful Links

- Render Dashboard: https://dashboard.render.com
- MongoDB Atlas: https://cloud.mongodb.com
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repo: (your repo URL)

---

## 📝 Your Deployment URLs

Fill in after deployment:

```
Backend API:     https://_____________________.onrender.com
ML Service:      https://_____________________.onrender.com
Frontend:        https://_____________________.vercel.app
MongoDB:         mongodb+srv://___________________________
```

---

**Need Help?** 
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Vercel Docs: https://vercel.com/docs

**Ready to deploy? Start with Phase 1! 🚀**
