# 🚀 Quick Deployment Checklist

## Before You Start
- [ ] Read [CLOUD_DEPLOYMENT_GUIDE.md](CLOUD_DEPLOYMENT_GUIDE.md) completely
- [ ] Have GitHub account ready
- [ ] Have credit card ready (for verification, even for free tiers)

## Step 1: Database Setup (15 minutes)
- [ ] Create MongoDB Atlas account
- [ ] Create M0 (FREE) cluster
- [ ] Create database user with strong password
- [ ] Whitelist all IPs (0.0.0.0/0)
- [ ] Copy connection string
- [ ] Save connection string securely (password manager)

## Step 2: Prepare Code for Deployment (10 minutes)
- [ ] Create `.env` file in `/server` folder (copy from `.env.example`)
- [ ] Add your MongoDB URI to `/server/.env`
- [ ] Create `.env` file in root folder (copy from `.env.example`)
- [ ] Test locally one more time

## Step 3: Push to GitHub (5 minutes)
```bash
cd c:\PD2\algae-monitoring\algae-monitoring\algae-monitoring
git init
git add .
git commit -m "Initial commit for cloud deployment"
git branch -M main
# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/phycosense.git
git push -u origin main
```

- [ ] Code pushed to GitHub
- [ ] Repository is public (or private with proper access)

## Step 4: Deploy Backend (15 minutes)
- [ ] Sign up for Render.com
- [ ] Connect GitHub account
- [ ] Create new Web Service
- [ ] Select your repository
- [ ] Root Directory: `server`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Add environment variable: `MONGODB_URI`
- [ ] Add environment variable: `NODE_ENV=production`
- [ ] Deploy and wait
- [ ] Test health endpoint: `https://YOUR_BACKEND_URL.onrender.com/api/health`
- [ ] Copy backend URL: ___________________________

## Step 5: Deploy ML Service (15 minutes)
- [ ] In Render dashboard, create another Web Service
- [ ] Select same repository
- [ ] Root Directory: `ml-service`
- [ ] Environment: Python
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `gunicorn -b 0.0.0.0:$PORT ml_service:app`
- [ ] Deploy and wait
- [ ] Test health endpoint: `https://YOUR_ML_URL.onrender.com/health`
- [ ] Copy ML service URL: ___________________________

## Step 6: Deploy Frontend (15 minutes)

### Option A: Render Static Site
- [ ] Create `.env.production` file with backend URL
- [ ] In Render, create new Static Site
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`
- [ ] Deploy
- [ ] Copy frontend URL: ___________________________

### Option B: Vercel (Faster)
```bash
npm install -g vercel
cd c:\PD2\algae-monitoring\algae-monitoring\algae-monitoring
vercel
```
- [ ] Vercel CLI installed
- [ ] Ran `vercel` command
- [ ] Added environment variable: `REACT_APP_API_URL=YOUR_BACKEND_URL`
- [ ] Ran `vercel --prod`
- [ ] Copy frontend URL: ___________________________

## Step 7: Update ESP32 (10 minutes)
- [ ] Open `phycosense_complete.ino` in Arduino IDE
- [ ] Update line 25: `String serverUrl = "https://YOUR_BACKEND_URL.onrender.com/api/sensor-data";`
- [ ] Verify WiFi credentials are correct
- [ ] Upload to ESP32
- [ ] Open Serial Monitor (115200 baud)
- [ ] Verify "✓ WiFi Connected!"
- [ ] Verify "✓ Success! Code: 201"

## Step 8: Test End-to-End (15 minutes)
- [ ] Open frontend in browser
- [ ] Select your device ID
- [ ] Verify data is appearing
- [ ] Check temperature reading
- [ ] Check EC reading
- [ ] Check turbidity reading
- [ ] Check battery status
- [ ] Export data to Excel (test export function)

## Step 9: Monitor for 24 Hours
- [ ] Check if services stay online
- [ ] Monitor for any errors in Render logs
- [ ] Verify data collection is continuous
- [ ] Note: Free tier services sleep after 15 min inactivity

## Optional: Production Upgrades
- [ ] Setup custom domain
- [ ] Upgrade to paid Render plan ($7/month per service)
- [ ] Setup UptimeRobot monitoring
- [ ] Configure MongoDB automated backups
- [ ] Add rate limiting to API
- [ ] Setup email alerts

## Your Deployment URLs

```
Backend:   https://__________________________________.onrender.com
ML:        https://__________________________________.onrender.com
Frontend:  https://__________________________________.vercel.app
MongoDB:   mongodb+srv://_______________________________________________

Device ID: ESP32-SENSOR-01
```

## Common Issues & Solutions

### ❌ Backend won't start
- Check Render logs
- Verify MongoDB URI is correct
- Test MongoDB connection with MongoDB Compass

### ❌ ESP32 can't connect
- Must use HTTPS (not HTTP)
- Check WiFi credentials
- Verify backend URL is correct
- Check if backend is sleeping (free tier)

### ❌ No data showing in dashboard
- Check browser console for errors
- Verify API URL in `.env.production`
- Check if backend API is accessible
- Verify device ID matches

### ❌ Services keep sleeping
- This is normal for free tier
- First request wakes service (~30s)
- Upgrade to paid plan ($7/month) for always-on

## Next Steps After Deployment

1. **Document Everything**
   - Save all URLs
   - Save all credentials
   - Save this checklist with checkmarks

2. **Share with Team**
   - Send frontend URL
   - Provide device ID
   - Share access credentials

3. **Monitor Performance**
   - Check Render dashboard daily
   - Review MongoDB Atlas metrics
   - Watch for any errors

4. **Plan Upgrades**
   - When to upgrade to paid tier?
   - Do you need custom domain?
   - Consider redundancy/backups

---

**Estimated Total Time: 2-3 hours**

**Total Cost (Free Tier): $0/month**

**Ready? Start with Step 1! 🚀**
