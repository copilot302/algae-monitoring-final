# 🚀 Quick Setup - ESP32 to Dashboard Integration

## Your System Configuration

**Your Computer's IP:** `192.168.1.128`  
**Backend API:** `http://192.168.1.128:5000`  
**Frontend Dashboard:** `http://localhost:3000` or `http://192.168.1.128:3000`

---

## ⚡ 3-Step Setup

### 1️⃣ Configure ESP32 Code

Open: `esp32_sensor_integration.ino`

**Update WiFi (lines 11-12):**
```cpp
const char* ssid = "YOUR_WIFI_NAME";          // Your WiFi SSID
const char* password = "YOUR_WIFI_PASSWORD";   // Your WiFi password
```

**Server URL is already set (line 16):**
```cpp
const char* serverUrl = "http://192.168.1.128:5000/api/sensor-data";
```
✅ This matches your computer's IP!

**Update sensor pins if needed (lines 19-21):**
```cpp
const int PH_PIN = 34;        // Your pH sensor pin
const int EC_PIN = 35;        // Your EC/turbidity pin
const int TEMP_PIN = 32;      // Your temperature sensor pin
```

---

### 2️⃣ Upload to ESP32

1. Open Arduino IDE
2. Install **ArduinoJson** library (Tools → Manage Libraries)
3. Select Board: **ESP32 Dev Module**
4. Select your COM Port
5. Click **Upload** ⬆️
6. Open **Serial Monitor** (115200 baud)

---

### 3️⃣ Start Servers (Already Running!)

Backend is running ✅ on port 5000  
Frontend is running ✅ on port 3000

If stopped, restart with:
```powershell
# Terminal 1 - Backend
cd "c:\Users\Irish Ann Bobadilla\Downloads\algae-monitoring\algae-monitoring\algae-monitoring\server"
node server.js

# Terminal 2 - Frontend  
cd "c:\Users\Irish Ann Bobadilla\Downloads\algae-monitoring\algae-monitoring\algae-monitoring"
npm start
```

---

## 🎯 Testing

### ESP32 Serial Monitor Should Show:
```
=== PhycoSense ESP32 Sensor System ===
✓ WiFi Connected!
IP Address: 192.168.1.xxx

--- Sensor Readings ---
Temperature: 25.3 °C
pH: 7.2
EC (Conductivity): 520 μS/cm

Sending to server... ✓ Success! Response code: 201
```

### Dashboard Shows:
- Real-time data updating every 5 seconds
- Charts updating automatically
- Risk assessment based on values
- All data saved to MongoDB

---

## 🔧 Sensor Pin Reference

Default ESP32 ADC pins (change if needed):

| Sensor | Pin | Type |
|--------|-----|------|
| pH | GPIO 34 | Analog |
| EC/Turbidity | GPIO 35 | Analog |
| Temperature | GPIO 32 | Analog/Digital |

---

## 🐛 Quick Troubleshooting

**ESP32 won't connect to WiFi:**
- Check SSID/password spelling
- Use 2.4GHz WiFi (not 5GHz)
- Move closer to router

**"Connection refused" (-1):**
- Backend not running → restart server
- Wrong IP → verify with `ipconfig`
- Firewall blocking → temporarily disable

**No data on dashboard:**
- Check Serial Monitor for "Success! Response code: 201"
- Refresh dashboard (F5)
- Check browser console (F12) for errors

---

## 📱 Access Points

| Service | Local | Network |
|---------|-------|---------|
| Dashboard | http://localhost:3000 | http://192.168.1.128:3000 |
| Backend API | http://localhost:5000 | http://192.168.1.128:5000 |
| API Test | http://localhost:5000/api/health | http://192.168.1.128:5000/api/health |

---

## ✅ Checklist

- [ ] ArduinoJson library installed
- [ ] WiFi credentials updated in .ino file
- [ ] Server URL configured (192.168.1.128:5000)
- [ ] Sensor pins configured correctly
- [ ] Code uploaded to ESP32
- [ ] Serial Monitor showing WiFi connected
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Dashboard shows live data
- [ ] MongoDB storing data

---

🎉 **Ready to monitor your algae in real-time!**

For detailed instructions, see: [ESP32_INTEGRATION.md](ESP32_INTEGRATION.md)
