# ESP32 Hardware Integration Guide

## 📟 Hardware Setup Complete!

Your ESP32 code is ready to send real sensor data to the PhycoSense dashboard.

---

## 🔧 Required Libraries

Install these libraries in Arduino IDE:

1. **WiFi** (built-in with ESP32)
2. **HTTPClient** (built-in with ESP32)
3. **ArduinoJson** - Install via Library Manager:
   - Open Arduino IDE
   - Tools → Manage Libraries
   - Search "ArduinoJson"
   - Install by Benoit Blanchon

---

## ⚙️ Configuration Steps

### Step 1: Update WiFi Credentials

Open the file: [esp32_sensor_integration.ino](esp32_sensor_integration.ino)

Update these lines (around line 11-12):
```cpp
const char* ssid = "YOUR_WIFI_SSID";          // Your WiFi name
const char* password = "YOUR_WIFI_PASSWORD";   // Your WiFi password
```

### Step 2: Set Your Computer's IP Address

Find your computer's IP address:
```powershell
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.128)

Update line 16 in the .ino file:
```cpp
const char* serverUrl = "http://YOUR_IP_HERE:5000/api/sensor-data";
```
Example:
```cpp
const char* serverUrl = "http://192.168.1.128:5000/api/sensor-data";
```

### Step 3: Configure Sensor Pins

Update pin numbers based on your wiring (lines 19-21):
```cpp
const int PH_PIN = 34;        // Change to your pH sensor pin
const int EC_PIN = 35;        // Change to your EC sensor pin
const int TEMP_PIN = 32;      // Change to your temp sensor pin
```

---

## 📤 Upload to ESP32

1. Connect ESP32 via USB
2. Open `esp32_sensor_integration.ino` in Arduino IDE
3. Select:
   - **Board**: ESP32 Dev Module (Tools → Board)
   - **Port**: Your ESP32's COM port (Tools → Port)
4. Click **Upload** button

---

## 🎯 How It Works

### Data Flow:
```
ESP32 Sensors → WiFi → HTTP POST → Backend (Port 5000) → MongoDB → Dashboard (Port 3000)
```

### Data Format Sent:
```json
{
  "temperature": 25.5,
  "ph": 7.2,
  "turbidity": 15.0,
  "dissolvedOxygen": 8.5,
  "ec": 520.0
}
```

### Update Frequency:
- Sends data every **5 seconds** (configurable at line 24)
- Change `sendInterval` to adjust frequency

---

## 🧪 Testing

### Monitor ESP32 Serial Output:
1. Open **Serial Monitor** in Arduino IDE (Tools → Serial Monitor)
2. Set baud rate to **115200**
3. You should see:
```
=== PhycoSense ESP32 Sensor System ===
Connecting to WiFi: YourNetwork
✓ WiFi Connected!
IP Address: 192.168.1.xxx

--- Sensor Readings ---
Temperature: 25.3 °C
pH: 7.2
EC (Conductivity): 520 μS/cm

Sending to server... ✓ Success! Response code: 201
```

### Check Dashboard:
- Open http://localhost:3000
- You should see real-time data updating from your ESP32!

---

## 🔍 Troubleshooting

### ESP32 won't connect to WiFi:
- Double-check SSID and password
- Ensure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
- Move ESP32 closer to router

### "Connection refused" error:
- Verify backend server is running (check Terminal)
- Confirm IP address is correct
- Disable Windows Firewall temporarily to test

### "Error code: -1":
- Backend server not running
- Wrong IP address in ESP32 code
- Computer and ESP32 on different networks

### No data on dashboard:
- Check browser console for errors (F12)
- Verify backend shows "MongoDB Connected"
- Check Serial Monitor for successful POST messages

---

## 🎛️ Sensor Calibration

### For Real Sensors:

**pH Sensor Calibration:**
1. Use pH 4, 7, and 10 buffer solutions
2. Record voltage readings for each
3. Update conversion formula in `readPH()` function

**Temperature Sensor:**
- Adjust formula based on your sensor type (DS18B20, TMP36, etc.)
- See datasheet for conversion equations

**EC/Turbidity:**
- Calibrate with known standards
- Update conversion factors

---

## 🚀 Running Everything

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\Irish Ann Bobadilla\Downloads\algae-monitoring\algae-monitoring\algae-monitoring\server"
node server.js
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\Irish Ann Bobadilla\Downloads\algae-monitoring\algae-monitoring\algae-monitoring"
npm start
```

**ESP32:**
- Upload code
- Power on
- Watch Serial Monitor

**Dashboard:**
- Open http://localhost:3000
- Watch real-time data from your sensors!

---

## 📊 What You'll See

The dashboard will display:
- ✅ Real-time sensor readings updating every 5 seconds
- ✅ Historical data charts
- ✅ Risk assessment based on sensor values
- ✅ All data automatically saved to MongoDB
- ✅ Export capability for analysis

Your hardware is now fully integrated with the PhycoSense monitoring system! 🎉
