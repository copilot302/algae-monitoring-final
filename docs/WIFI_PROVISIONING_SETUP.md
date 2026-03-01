# WiFi Provisioning Setup Guide

## 🎯 What Was Implemented

Your PhycoSense system now has **WiFi Provisioning** - allowing customers to easily connect devices without modifying Arduino code!

### Changes Made:

1. **ESP32 Firmware** - WiFi provisioning with captive portal
2. **Backend API** - Device registration and management endpoints
3. **Dashboard** - Device setup page with instructions
4. **Database** - Device model for tracking all devices

---

## 📋 Prerequisites

### Arduino IDE Setup

Install required library:
1. Open Arduino IDE
2. Go to **Tools > Manage Libraries**
3. Search for: `WiFiManager`
4. Install: **WiFiManager by tzapu** (version 2.0.0 or higher)

That's it! No hardware changes needed.

---

## 🚀 Testing the Implementation

### Step 1: Upload Modified Firmware

1. Open `phycosense_complete.ino` in Arduino IDE
2. Connect your ESP32 via USB
3. Select correct board and port
4. Click **Upload**
5. Open Serial Monitor (115200 baud)

**Expected Output:**
```
╔═══════════════════════════════════════╗
║  PhycoSense Algae Monitoring System   ║
║         WiFi Provisioning v1.1        ║
╚═══════════════════════════════════════╝

Device ID: ESP32-A1B2C3
⚠ No configuration found - entering provisioning mode

╔════════════════════════════════════════╗
║   PROVISIONING MODE ACTIVATED          ║
╚════════════════════════════════════════╝
1. Connect to WiFi hotspot:
   SSID: PhycoSense-ESP32-A1B2C3
   Password: phyco123
2. Captive portal will open automatically
3. Enter your WiFi credentials & server URL
```

### Step 2: Start Backend Server

```bash
cd algae-monitoring/server
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected successfully
```

### Step 3: Start Frontend Dashboard

```bash
cd algae-monitoring
npm start
```

Dashboard opens at: http://localhost:3000

### Step 4: Provision Device

**On Phone or Laptop:**

1. **Connect to Device WiFi:**
   - WiFi Settings → Look for `PhycoSense-ESP32-XXXXXX`
   - Password: `phyco123`
   - Wait 5-10 seconds

2. **Setup Page Opens Automatically:**
   - If not, manually go to: `192.168.4.1`
   
3. **Fill in Configuration:**
   ```
   WiFi Network:    [Select your WiFi]
   WiFi Password:   [Your WiFi password]
   Server URL:      http://192.168.1.100:5000/api
   Device Name:     North Pond
   ```
   
   ⚠️ **Important:** Replace `192.168.1.100` with your computer's IP address!
   
   **To find your IP:**
   ```powershell
   ipconfig
   # Look for "IPv4 Address" under your WiFi adapter
   ```

4. **Click "Save" or "Connect"**
   - Device will reboot
   - Connect to your WiFi
   - Register with backend

5. **Check Serial Monitor:**
   ```
   ✓ Provisioning Complete!
      Device Name: North Pond
      Server URL: http://192.168.1.100:5000/api
   
   Connecting to WiFi...
   ✓ WiFi Connected!
   IP Address: 192.168.1.150
   
   ✓ Device registered! Response: 201
   ```

### Step 5: View Device on Dashboard

1. Go to dashboard: http://localhost:3000
2. Click **"📡 Device Setup"** button in header
3. Device appears in "Recently Added Devices" section
4. Switch back to **"📊 Dashboard"** to see live data

---

## 🔄 Testing Factory Reset

### Method 1: Serial Command
```
STATUS          # Check current config
RESET           # Factory reset
```

### Method 2: Button Hold (if BOOT button available)
- Hold BOOT button for 5+ seconds
- Device resets to provisioning mode

### Method 3: Code Command
In Serial Monitor, type:
```
RESET
```

---

## 📱 Testing Multiple Devices

Each ESP32 automatically gets unique ID from MAC address:
- Device 1: `ESP32-A1B2C3` → "North Pond"
- Device 2: `ESP32-D4E5F6` → "South Tank"
- Device 3: `ESP32-G7H8I9` → "East Lake"

All send data to the same backend!

---

## 🌐 Cloud Deployment (Optional)

### For Remote Access:

1. **Deploy Backend to Railway/Render:**
   - Get URL: `https://yourapp.railway.app`

2. **Configure Devices with Cloud URL:**
   ```
   Server URL: https://yourapp.railway.app/api
   ```

3. **Access Dashboard Anywhere:**
   - Cloud mode: Monitor all remote buoys
   - Local mode: Field work (offline capable)

---

## 🐛 Troubleshooting

### Device won't enter provisioning mode
**Solution:**
- Type `RESET` in Serial Monitor
- Or hold BOOT button for 5 seconds
- Or power cycle device

### Captive portal doesn't open
**Solution:**
- Manually open browser → go to `192.168.4.1`
- Disable mobile data on phone (if using phone)

### Can't connect to WiFi
**Possible Issues:**
- ❌ 5GHz WiFi (ESP32 only supports 2.4GHz)
- ❌ Wrong password
- ❌ WiFi too far away
- ❌ Enterprise WiFi (needs special config)

### Device not appearing on dashboard
**Check:**
1. Device LED solid green? (connected)
2. Serial Monitor shows "✓ Device registered"?
3. Backend server running?
4. Correct server URL during provisioning?
5. Refresh dashboard page

### Serial Monitor Commands
```
STATUS    - View current configuration
RESET     - Factory reset device
CAL       - Turbidity calibration
PH        - pH calibration
EC        - EC calibration
```

---

## 📊 API Endpoints (for testing)

### Device Management
```bash
# Register device (auto-called by ESP32)
POST /api/devices/register
{
  "deviceId": "ESP32-A1B2C3",
  "deviceName": "North Pond",
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "firmwareVersion": "1.1.0"
}

# Get all devices
GET /api/devices

# Get recent devices (last 24h)
GET /api/devices/recent/new

# Get specific device
GET /api/devices/ESP32-A1B2C3

# Update device info
PUT /api/devices/ESP32-A1B2C3
{
  "deviceName": "Updated Name",
  "location": "North Section"
}
```

### Testing with curl
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# List all devices
curl http://localhost:5000/api/devices

# Get recent devices
curl http://localhost:5000/api/devices/recent/new
```

---

## ✅ Success Checklist

- [ ] WiFiManager library installed
- [ ] Code uploaded to ESP32
- [ ] Backend server running
- [ ] Frontend dashboard running
- [ ] Device provisioned successfully
- [ ] Device appears on dashboard
- [ ] Live data showing on dashboard
- [ ] Factory reset tested

---

## 🎓 For Thesis Demonstration

### Demo Flow:
1. Show hardcoded approach (old way - requires programmer)
2. Show new provisioning (plug & play!)
3. Add second device in real-time
4. Show both devices on dashboard
5. Explain scalability benefits

### Key Points to Highlight:
✅ **User-friendly** - No technical knowledge needed  
✅ **Scalable** - Add unlimited devices  
✅ **Secure** - No hardcoded credentials  
✅ **Flexible** - Works with any WiFi network  
✅ **Cloud-ready** - Optional remote monitoring  
✅ **Resilient** - Offline capability with local server  

---

## 📞 Support

If you encounter issues:
1. Check Serial Monitor output
2. Verify IP addresses
3. Check firewall settings
4. Ensure 2.4GHz WiFi

**Next Steps:**
- Test with actual deployment
- Add more devices
- Deploy to cloud (optional)
- Field testing

---

**Implementation Complete! 🎉**

Your PhycoSense system now has professional-grade device provisioning!
