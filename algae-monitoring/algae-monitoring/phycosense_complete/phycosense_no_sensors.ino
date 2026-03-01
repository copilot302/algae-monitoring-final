// PhycoSense - Minimal Version (No Sensors Required)
// For ESP32 without any sensors connected
// Only sends mock data to test connectivity

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- WiFi Credentials (UPDATE THESE) ---
const char* ssid = "Converge_2.4GHz_R6z9";
const char* password = "Retirado0706";
const char* serverUrl = "http://192.168.100.7:5000/api/sensor-data";

// --- Device Configuration (UPDATE FOR EACH DEVICE) ---
const char* deviceId = "POND-03";        // Change this: POND-01, POND-02, POND-03, etc.
const char* deviceName = "Pond 3 (No Sensors)";    // Change this name

// --- Battery Monitoring (Optional) ---
#define BATTERY_PIN 35
const float VOLTAGE_DIVIDER_RATIO = 2.0;
#define BATTERY_SAMPLES 10

float batteryVoltage = 0.0;
int batteryPercentage = 0;
bool isUSBPowered = false;

// --- Timing ---
unsigned long lastSend = 0;
const unsigned long sendInterval = 5000; // Send every 5 seconds

// Read Battery Voltage with averaging
float readBatteryVoltage()
{
    float sum = 0;
    for (int i = 0; i < BATTERY_SAMPLES; i++) {
        int raw = analogRead(BATTERY_PIN);
        sum += (raw / 4095.0) * 3.3 * VOLTAGE_DIVIDER_RATIO;
        delay(5);
    }
    return sum / BATTERY_SAMPLES;
}

// Calculate Battery Percentage
int calculateBatteryPercentage(float voltage)
{
    if (voltage > 4.5 || voltage < 0.5) {
        isUSBPowered = true;
        return 100;
    }
    
    isUSBPowered = false;
    
    if (voltage >= 4.2) return 100;
    if (voltage >= 4.0) return 80 + (int)((voltage - 4.0) * 100);
    if (voltage >= 3.8) return 60 + (int)((voltage - 3.8) * 100);
    if (voltage >= 3.6) return 40 + (int)((voltage - 3.6) * 100);
    if (voltage >= 3.4) return 20 + (int)((voltage - 3.4) * 100);
    if (voltage >= 3.0) return (int)((voltage - 3.0) * 50);
    return 0;
}

// WiFi Connection
void connectWiFi() {
    Serial.print("Connecting to WiFi: ");
    Serial.println(ssid);
    
    WiFi.begin(ssid, password);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\n✓ WiFi Connected!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
        Serial.print("Sending data to: ");
        Serial.println(serverUrl);
    } else {
        Serial.println("\n✗ WiFi Connection Failed - will retry");
    }
}

// Send Data to Server
void sendDataToServer() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("✗ WiFi disconnected - reconnecting...");
        connectWiFi();
        return;
    }
    
    HTTPClient http;
    StaticJsonDocument<256> doc;
    
    // Device identification
    doc["deviceId"] = deviceId;
    doc["deviceName"] = deviceName;
    
    // Mock sensor data (since no sensors connected)
    doc["temperature"] = 25.0;     // Room temperature default
    doc["ph"] = 7.0;               // Neutral pH
    doc["ec"] = 500;               // 500 µS/cm (low conductivity)
    doc["turbidity"] = 5.0;        // Clear water
    doc["dissolvedOxygen"] = 8.5;  // Good oxygen level
    
    // Battery/Power data (real if battery connected)
    doc["batteryVoltage"] = round(batteryVoltage * 100) / 100.0;
    doc["batteryPercentage"] = batteryPercentage;
    doc["isUSBPowered"] = isUSBPowered;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    Serial.print(">> Sending JSON: ");
    Serial.println(jsonString);
    
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
        Serial.print("✓ Success! Server responded with code: ");
        Serial.println(httpResponseCode);
        String response = http.getString();
        Serial.print("Response: ");
        Serial.println(response);
    } else {
        Serial.print("✗ Error! Code: ");
        Serial.print(httpResponseCode);
        Serial.print(" (");
        Serial.print(http.errorToString(httpResponseCode));
        Serial.println(")");
    }
    
    http.end();
}

void setup()
{
    Serial.begin(115200);
    delay(1000);
    
    Serial.println(F("\n=== PhycoSense Minimal (No Sensors) ==="));
    Serial.print("Device ID: ");
    Serial.println(deviceId);
    Serial.print("Device Name: ");
    Serial.println(deviceName);
    
    // Init Battery Monitoring
    pinMode(BATTERY_PIN, INPUT);
    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);
    
    // Initial battery reading
    batteryVoltage = readBatteryVoltage();
    batteryPercentage = calculateBatteryPercentage(batteryVoltage);
    Serial.print("Battery: ");
    Serial.print(batteryVoltage, 2);
    Serial.print("V (");
    if (isUSBPowered) {
        Serial.println("USB Powered)");
    } else {
        Serial.print(batteryPercentage);
        Serial.println("%)");
    }

    // Connect to WiFi
    connectWiFi();
    
    Serial.println(F("\nStarting data transmission (every 5 seconds)..."));
    Serial.println(F(""));
}

void loop()
{
    unsigned long now = millis();
    
    // Send data every 5 seconds
    if (now - lastSend >= sendInterval) {
        lastSend = now;
        
        // Update battery status
        batteryVoltage = readBatteryVoltage();
        batteryPercentage = calculateBatteryPercentage(batteryVoltage);
        
        // Display mock data
        Serial.println(F("\n--- MOCK DATA REPORT ---"));
        Serial.println(F("Temperature: 25.0 °C (Mock)"));
        Serial.println(F("pH: 7.0 (Mock)"));
        Serial.println(F("EC: 500 µS/cm (Mock)"));
        Serial.println(F("Turbidity: 5.0 NTU (Mock)"));
        Serial.print(F("Battery: "));
        if (isUSBPowered) {
            Serial.println(F("USB Powered"));
        } else {
            Serial.print(batteryVoltage, 2);
            Serial.print(F("V ("));
            Serial.print(batteryPercentage);
            Serial.println(F("%)"));
        }
        Serial.println(F("------------------------"));
        
        // Send to server
        sendDataToServer();
    }
    
    delay(100); // Small delay to prevent watchdog issues
}
