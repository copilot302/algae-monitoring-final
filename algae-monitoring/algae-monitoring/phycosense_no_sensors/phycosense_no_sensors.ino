// PhycoSense - WiFi Provisioning Test Version (No Sensors Required)
// For ESP32 without any sensors connected
// Only sends mock data to test WiFi provisioning & connectivity
// Install library: WiFiManager by tzapu

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WiFiManager.h>  // https://github.com/tzapu/WiFiManager
#include <Preferences.h>

// --- WiFi Provisioning Configuration ---
Preferences preferences;
String g_deviceId = "";             // Auto-generated unique ID from MAC
String g_deviceName = "";           // User-configurable device name
String g_serverUrl = "";            // Server URL configured during provisioning
String g_backupServerUrl = "";      // Optional backup server

// Provisioning mode button (GPIO 0 = BOOT button)
#define PROVISION_BUTTON 0
#define PROVISION_HOLD_TIME 5000  // Hold for 5 seconds to reset

// Device status
bool isProvisioned = false;

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

// -------------------------------------------------------------------------
// --- WiFi Provisioning Functions ---
// -------------------------------------------------------------------------

// Generate unique device ID from MAC address
void generateDeviceId() {
    uint64_t chipid = ESP.getEfuseMac();
    g_deviceId = "ESP32-" + String((uint32_t)(chipid >> 24), HEX);
    g_deviceId.toUpperCase();
}

// Load saved configuration from flash memory
bool loadConfiguration() {
    preferences.begin("phycosense", true); // Read-only
    
    g_serverUrl = preferences.getString("serverUrl", "");
    g_deviceName = preferences.getString("deviceName", "");
    g_backupServerUrl = preferences.getString("backupUrl", "");
    
    preferences.end();
    
    if (g_serverUrl.length() > 0) {
        if (g_deviceName.length() == 0) {
            g_deviceName = g_deviceId; // Use device ID as fallback name
        }
        return true;
    }
    return false;
}

// Save configuration to flash memory
void saveConfiguration(String server, String name, String backup = "") {
    preferences.begin("phycosense", false); // Read-write
    
    preferences.putString("serverUrl", server);
    preferences.putString("deviceName", name);
    if (backup.length() > 0) {
        preferences.putString("backupUrl", backup);
    }
    
    preferences.end();
    
    Serial.println("✓ Configuration saved to flash memory");
}

// Clear all saved configuration (factory reset)
void clearConfiguration() {
    preferences.begin("phycosense", false);
    preferences.clear();
    preferences.end();
    
    // Also clear WiFiManager saved credentials
    WiFiManager wm;
    wm.resetSettings();
    
    Serial.println("✓ Configuration cleared - device reset to factory defaults");
    Serial.println("✓ WiFi credentials erased");
}

// Start WiFi provisioning mode (captive portal)
void startProvisioningMode() {
    Serial.println("\n╔════════════════════════════════════════╗");
    Serial.println("║   PROVISIONING MODE ACTIVATED          ║");
    Serial.println("╚════════════════════════════════════════╝");
    Serial.println("1. Connect to WiFi hotspot:");
    Serial.print("   SSID: PhycoSense-");
    Serial.println(g_deviceId);
    Serial.println("   Password: phyco123");
    Serial.println("2. Captive portal will open automatically");
    Serial.println("3. Enter your WiFi credentials & server URL");
    Serial.println("\nWaiting for configuration...\n");
    
    WiFiManager wm;
    
    // Custom parameters for server configuration
    WiFiManagerParameter custom_server("server", "Server URL", "", 100, 
        "placeholder=\"http://yourserver.com/api\"");
    WiFiManagerParameter custom_name("name", "Device Name", g_deviceId.c_str(), 40,
        "placeholder=\"My Test Device\"");
    WiFiManagerParameter custom_backup("backup", "Backup Server (Optional)", "", 100,
        "placeholder=\"http://192.168.1.100:5000/api\"");
    
    // Add HTML for better UI
    WiFiManagerParameter custom_html("<br/><p><b>PhycoSense Device Setup</b></p><p>Device ID: ");
    WiFiManagerParameter custom_html2(g_deviceId.c_str());
    WiFiManagerParameter custom_html3("</p>");
    
    wm.addParameter(&custom_html);
    wm.addParameter(&custom_html2);
    wm.addParameter(&custom_html3);
    wm.addParameter(&custom_server);
    wm.addParameter(&custom_name);
    wm.addParameter(&custom_backup);
    
    // Configuration
    wm.setConfigPortalTimeout(300); // 5 minutes timeout
    wm.setAPStaticIPConfig(IPAddress(192,168,4,1), IPAddress(192,168,4,1), IPAddress(255,255,255,0));
    
    String apName = "PhycoSense-" + g_deviceId;
    
    // Start captive portal
    if (!wm.autoConnect(apName.c_str(), "phyco123")) {
        Serial.println("✗ Provisioning timed out - restarting...");
        delay(3000);
        ESP.restart();
    }
    
    // WiFi connected! Now get custom parameters
    g_serverUrl = custom_server.getValue();
    g_deviceName = custom_name.getValue();
    g_backupServerUrl = custom_backup.getValue();
    
    // Set default values if empty
    if (g_serverUrl.length() == 0) {
        g_serverUrl = "http://192.168.1.100:5000/api/sensor-data";
        Serial.println("⚠ No server URL provided, using default");
    }
    if (g_deviceName.length() == 0) {
        g_deviceName = g_deviceId;
    }
    
    // Append /sensor-data if not present
    if (!g_serverUrl.endsWith("/sensor-data") && !g_serverUrl.endsWith("/sensor-data/")) {
        if (!g_serverUrl.endsWith("/")) g_serverUrl += "/";
        g_serverUrl += "sensor-data";
    }
    
    // Save configuration
    saveConfiguration(g_serverUrl, g_deviceName, g_backupServerUrl);
    
    Serial.println("\n✓ Provisioning Complete!");
    Serial.print("   Device Name: ");
    Serial.println(g_deviceName);
    Serial.print("   Server URL: ");
    Serial.println(g_serverUrl);
    if (g_backupServerUrl.length() > 0) {
        Serial.print("   Backup URL: ");
        Serial.println(g_backupServerUrl);
    }
    Serial.println();
    
    isProvisioned = true;
}

// Check if provision button is held (for factory reset)
void checkProvisionButton() {
    static unsigned long buttonPressStart = 0;
    static bool buttonWasPressed = false;
    
    if (digitalRead(PROVISION_BUTTON) == LOW) {
        if (!buttonWasPressed) {
            buttonPressStart = millis();
            buttonWasPressed = true;
            Serial.println("⚠ Provision button pressed - hold for 5 seconds to reset...");
        } else if (millis() - buttonPressStart >= PROVISION_HOLD_TIME) {
            Serial.println("\n✓ Factory reset triggered!");
            clearConfiguration();
            delay(1000);
            ESP.restart();
        }
    } else {
        buttonWasPressed = false;
    }
}

// Register device with backend
bool registerDevice() {
    if (WiFi.status() != WL_CONNECTED) {
        return false;
    }
    
    HTTPClient http;
    StaticJsonDocument<256> doc;
    
    // Extract base URL for registration endpoint
    String baseUrl = g_serverUrl;
    baseUrl.replace("/sensor-data", "/devices/register");
    
    doc["deviceId"] = g_deviceId;
    doc["deviceName"] = g_deviceName;
    doc["macAddress"] = WiFi.macAddress();
    doc["firmwareVersion"] = "1.1.0-TEST";
    doc["ipAddress"] = WiFi.localIP().toString();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    Serial.print("Registering device with backend: ");
    Serial.println(baseUrl);
    
    http.begin(baseUrl);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(10000);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
        Serial.print("✓ Device registered! Response: ");
        Serial.println(httpResponseCode);
        String response = http.getString();
        Serial.println(response);
        http.end();
        return true;
    } else {
        Serial.print("⚠ Registration failed (will retry): ");
        Serial.println(http.errorToString(httpResponseCode));
        http.end();
        return false;
    }
}

// Read Serial Command
int bufIndex = 0;
bool readSerial(char result[])
{
    while (Serial.available() > 0)
    {
        char inChar = Serial.read();
        if (inChar == '\n')
        {
            result[bufIndex] = '\0';
            Serial.flush();
            bufIndex = 0;
            return true;
        }
        if (inChar != '\r')
        {
            result[bufIndex] = inChar;
            bufIndex++;
        }
        delay(1);
    }
    return false;
}

// WiFi Connection (uses saved credentials from provisioning)
void connectWiFi() {
    if (!isProvisioned) {
        Serial.println("⚠ Device not provisioned - skipping WiFi connection");
        return;
    }
    
    Serial.println("Connecting to WiFi...");
    
    // WiFi credentials are already saved by WiFiManager
    WiFi.mode(WIFI_STA);
    WiFi.begin(); // Uses saved credentials
    
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
        Serial.print("Device ID: ");
        Serial.println(g_deviceId);
        Serial.print("Device Name: ");
        Serial.println(g_deviceName);
        Serial.print("Sending data to: ");
        Serial.println(g_serverUrl);
        
        // Register device with backend
        registerDevice();
    } else {
        Serial.println("\n✗ WiFi Connection Failed - will retry");
    }
}

// Send Data to Server (with fallback support)
void sendDataToServer() {
    if (!isProvisioned) {
        Serial.println("⚠ Device not provisioned - cannot send data");
        return;
    }
    
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("✗ WiFi disconnected - reconnecting...");
        connectWiFi();
        return;
    }
    
    HTTPClient http;
    StaticJsonDocument<256> doc;
    
    // Device identification
    doc["deviceId"] = g_deviceId;
    doc["deviceName"] = g_deviceName;
    
    // Mock sensor data (since no sensors connected)
    doc["temperature"] = 25.0 + random(-5, 5) * 0.1;  // 24.5-25.5°C
    doc["ph"] = 7.0 + random(-2, 2) * 0.1;            // 6.8-7.2 pH
    doc["ec"] = 500 + random(-50, 50);                // 450-550 µS/cm
    doc["turbidity"] = 5.0 + random(0, 10) * 0.1;     // 5.0-6.0 NTU
    doc["dissolvedOxygen"] = 8.5 + random(-3, 3) * 0.1;  // 8.2-8.8 mg/L
    
    // Battery/Power data (real if battery connected)
    doc["batteryVoltage"] = round(batteryVoltage * 100) / 100.0;
    doc["batteryPercentage"] = batteryPercentage;
    doc["isUSBPowered"] = isUSBPowered;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    Serial.print(">> Sending JSON: ");
    Serial.println(jsonString);
    
    // Try primary server
    http.begin(g_serverUrl.c_str());
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(10000);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
        Serial.print("✓ Success! Code: ");
        Serial.println(httpResponseCode);
        http.end();
        return;
    } else {
        Serial.print("✗ Primary server error: ");
        Serial.println(http.errorToString(httpResponseCode));
        http.end();
        
        // Try backup server if configured
        if (g_backupServerUrl.length() > 0) {
            Serial.println("Trying backup server...");
            http.begin(g_backupServerUrl.c_str());
            http.addHeader("Content-Type", "application/json");
            http.setTimeout(10000);
            
            httpResponseCode = http.POST(jsonString);
            if (httpResponseCode > 0) {
                Serial.print("✓ Backup server success! Code: ");
                Serial.println(httpResponseCode);
            } else {
                Serial.println("✗ Both servers failed - data not sent");
            }
            http.end();
        }
    }
}

void setup()
{
    Serial.begin(115200);
    delay(1000);
    
    Serial.println(F("\n╔═══════════════════════════════════════╗"));
    Serial.println(F("║  PhycoSense WiFi Provisioning Test  ║"));
    Serial.println(F("║     (No Sensors - Mock Data Only)     ║"));
    Serial.println(F("╚═══════════════════════════════════════╝\n"));
    
    // Init provision button
    pinMode(PROVISION_BUTTON, INPUT_PULLUP);
    
    // Generate unique device ID
    generateDeviceId();
    Serial.print("Device ID: ");
    Serial.println(g_deviceId);
    
    // Try to load saved configuration
    isProvisioned = loadConfiguration();
    
    if (!isProvisioned) {
        Serial.println("⚠ No configuration found - entering provisioning mode\n");
        startProvisioningMode();
    } else {
        Serial.println("✓ Configuration loaded from memory");
        Serial.print("  Device Name: ");
        Serial.println(g_deviceName);
        Serial.print("  Server URL: ");
        Serial.println(g_serverUrl);
        if (g_backupServerUrl.length() > 0) {
            Serial.print("  Backup URL: ");
            Serial.println(g_backupServerUrl);
        }
        Serial.println();
    }
    
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

    // Connect to WiFi (if provisioned)
    if (isProvisioned) {
        connectWiFi();
    }
    
    Serial.println(F("\n=== Commands ==="));
    Serial.println(F("  RESET  - Factory reset device"));
    Serial.println(F("  STATUS - Show device info"));
    Serial.println(F("  ⚠ Or hold BOOT button for 5 seconds\n"));
    
    Serial.println(F("Starting data transmission (every 5 seconds)..."));
    Serial.println(F(""));
}

void loop()
{
    unsigned long now = millis();
    
    // Check provision button for factory reset
    checkProvisionButton();
    
    // Handle serial commands
    char cmd[20];
    if (readSerial(cmd)) {
        strupr(cmd);
        String cmdStr = String(cmd);
        
        if (cmdStr == "RESET") {
            Serial.println(F("\n⚠ Factory reset initiated..."));
            clearConfiguration();
            delay(1000);
            ESP.restart();
        }
        else if (cmdStr == "STATUS") {
            Serial.println(F("\n╔══════════════════════════════════════╗"));
            Serial.println(F("║         DEVICE STATUS                ║"));
            Serial.println(F("╚══════════════════════════════════════╝"));
            Serial.print("Device ID:      ");
            Serial.println(g_deviceId);
            Serial.print("Device Name:    ");
            Serial.println(g_deviceName);
            Serial.print("Provisioned:    ");
            Serial.println(isProvisioned ? "Yes" : "No");
            Serial.print("WiFi Status:    ");
            Serial.println(WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected");
            if (WiFi.status() == WL_CONNECTED) {
                Serial.print("IP Address:     ");
                Serial.println(WiFi.localIP());
                Serial.print("Signal:         ");
                Serial.print(WiFi.RSSI());
                Serial.println(" dBm");
            }
            Serial.print("Server URL:     ");
            Serial.println(g_serverUrl);
            if (g_backupServerUrl.length() > 0) {
                Serial.print("Backup URL:     ");
                Serial.println(g_backupServerUrl);
            }
            Serial.print("Battery:        ");
            if (isUSBPowered) {
                Serial.println("USB Powered");
            } else {
                Serial.print(batteryVoltage, 2);
                Serial.print("V (");
                Serial.print(batteryPercentage);
                Serial.println("%)");
            }
            Serial.println(F("══════════════════════════════════════\n"));
        }
    }
    
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
        
        // Send to server (only if provisioned)
        if (isProvisioned) {
            sendDataToServer();
        } else {
            Serial.println("⚠ Device not provisioned - not sending data");
        }
    }
    
    delay(100); // Small delay to prevent watchdog issues
}
