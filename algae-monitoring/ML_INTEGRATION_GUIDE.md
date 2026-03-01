# PhycoSense Machine Learning Integration Guide

## Overview

The PhycoSense ML system uses a Random Forest classifier to predict algae bloom risk based on real-time water quality sensor data. This guide covers setup, training, and integration with the monitoring system.

## Architecture

```
ESP32 Sensors → Backend API → ML Service (Flask) → Risk Prediction → Actuator Control
                     ↓
                  MongoDB
                     ↓
                Frontend Dashboard
```

## Components

### 1. ML Service (`ml_service.py`)
Flask API server that:
- Loads trained Random Forest model
- Accepts sensor data via HTTP POST
- Returns risk predictions (Normal/Moderate/High)
- Calculates PID-based actuator control actions

**Endpoints:**
- `GET /health` - Health check
- `POST /predict` - Risk prediction

### 2. Training Script (`train_model.py`)
Trains the Random Forest model on historical data with automatic risk labeling.

### 3. Actuator Control (`actuator_control.py`)
PID-based control system for aerators and dosing valves.

## Setup Instructions

### Prerequisites

```bash
# Install Python 3.8+
python --version

# Navigate to ml-service directory
cd ml-service

# Install dependencies
pip install -r requirements.txt
```

### Dependencies

- Flask 3.0.0 - Web framework
- scikit-learn 1.3.2 - Machine learning
- pandas 2.1.4 - Data processing
- openpyxl 3.1.2 - Excel file support
- joblib 1.3.2 - Model serialization

## Training the Model

### Step 1: Prepare Training Data

Create an Excel file with sensor readings:

**Columns Required:**
- `Timestamp` - Date/time of reading
- `Temperature (°C)` - Water temperature
- `Dissolved Oxygen (mg/L)` - DO level
- `pH Level` - pH measurement
- `Electrical Conductivity (µS/cm)` - EC reading
- `Turbidity (NTU)` - Turbidity measurement

**Example:** `phycosense-data.xlsx`

### Step 2: Run Training Script

```bash
# Train with default settings
python train_model.py --data phycosense-data.xlsx

# Specify output directory
python train_model.py --data data.xlsx --output models/
```

**Output Files:**
- `rf_model.joblib` - Trained Random Forest model
- `label_encoder.joblib` - Label encoder (Normal/Moderate/High)

### Risk Labeling Thresholds

The training script automatically labels data:

**High Risk:**
- DO < 2 mg/L OR
- Turbidity > 50 NTU OR
- pH > 9 OR
- EC > 1000 µS/cm OR
- Temperature > 25°C

**Moderate Risk:**
- DO < 5 mg/L OR
- Turbidity > 10 NTU OR
- pH > 8.5 OR
- EC > 800 µS/cm OR
- Temperature > 20°C

**Normal:**
- All parameters within safe ranges

## Running the ML Service

### Start ML Service

```bash
# Default port 5001
python ml_service.py
```

**Expected Output:**
```
==================================================
PhycoSense ML Service - Random Forest Risk Prediction
==================================================

✓ Models loaded successfully from ml-service
✓ ML Service ready to accept predictions

Starting Flask server on http://localhost:5001
==================================================
```

### Test ML Service

```bash
# Health check
curl http://localhost:5001/health

# Test prediction
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 22.5,
    "ph": 8.7,
    "ec": 850,
    "turbidity": 35.2,
    "dissolvedOxygen": 3.8
  }'
```

**Response:**
```json
{
  "risk": "Moderate",
  "confidence": 0.856,
  "action": {
    "aerator_pwm": 120,
    "aerator_state": "ON",
    "valve_state": "MICRODOSING",
    "reason": "Moderate risk detected. DO: 3.80 mg/L, Target: 5.0 mg/L"
  },
  "features": {
    "DO": 3.8,
    "Turbidity": 35.2,
    "pH": 8.7,
    "EC": 850,
    "Temp": 22.5
  }
}
```

## Backend Integration

### Update Backend Dependencies

```bash
cd server
npm install axios
```

### Environment Configuration

Add to `server/.env`:
```
ML_SERVICE_URL=http://localhost:5001
```

### How It Works

1. ESP32 sends sensor data to `POST /api/sensor-data`
2. Backend automatically calls ML service for prediction
3. Risk level and action recommendations saved to MongoDB
4. Frontend displays ML predictions in real-time

**Modified Files:**
- `server/routes/sensorData.js` - Calls ML service
- `server/models/SensorData.js` - Stores risk, confidence, action

## Frontend Integration

ML predictions automatically appear in the Risk Assessment card:

**Features:**
- ML badge indicator
- Risk level (Normal/Moderate/High)
- Prediction confidence percentage
- Recommended actuator actions
- Aerator PWM values
- Valve dosing recommendations

**Modified Files:**
- `src/components/RiskAssessment.js` - Displays ML predictions
- `src/hooks/useSensorData.js` - Fetches ML data from backend
- `src/App.js` - Passes ML predictions to components

## PID Controller Configuration

### Parameters

Located in `ml_service.py` and `actuator_control.py`:

```python
PIDController(
    Kp=40.0,     # Proportional gain
    Ki=0.0,      # Integral gain (disabled)
    Kd=0.0,      # Derivative gain (disabled)
    setpoint=5.0 # Target DO level (mg/L)
)
```

### Tuning Guide

**Increase Kp:**
- Faster response to DO changes
- May cause overshoot/oscillation

**Enable Ki:**
- Eliminates steady-state error
- Risk of integral windup

**Enable Kd:**
- Reduces overshoot
- Sensitive to noise

### Action Logic

**Normal Risk:**
- Aerator: OFF (PWM 0)
- Valve: CLOSED
- No intervention needed

**Moderate Risk:**
- Aerator: ON (PID-controlled PWM)
- Valve: MICRODOSING
- Automatic DO regulation

**High Risk:**
- Aerator: MAX_POWER (PWM 255)
- Valve: FULL_DOSING
- Alert triggered

## Complete System Startup

### Terminal 1: ML Service
```bash
cd ml-service
python ml_service.py
```

### Terminal 2: Backend
```bash
cd server
npm start
```

### Terminal 3: Frontend
```bash
cd ..
npm start
```

### Terminal 4: Actuator Control (Optional)
```bash
cd ml-service
python actuator_control.py --esp32-ip 192.168.1.128
```

## Troubleshooting

### Models Not Found

**Error:** `Model files not found`

**Solution:**
```bash
cd ml-service
python train_model.py --data phycosense-data.xlsx
```

### ML Service Unreachable

**Error:** Backend logs `ML service unavailable`

**Check:**
1. ML service running on port 5001
2. No firewall blocking localhost:5001
3. Correct `ML_SERVICE_URL` in `.env`

**Fallback:** Backend continues saving data without predictions

### Low Prediction Confidence

**Causes:**
- Insufficient training data
- Unbalanced dataset (too many Normal samples)
- Sensor readings outside training data range

**Solutions:**
1. Collect more diverse training data
2. Include more Moderate/High risk samples
3. Retrain with `class_weight='balanced'`

### PID Oscillation

**Symptoms:**
- Aerator PWM rapidly changing
- DO level unstable

**Solutions:**
1. Reduce Kp (try 20.0)
2. Add derivative term (Kd=5.0)
3. Increase update interval

## Model Retraining

Retrain periodically with new data:

```bash
# 1. Export data from MongoDB
# 2. Add to training dataset
# 3. Retrain
python train_model.py --data updated-data.xlsx

# 4. Restart ML service
python ml_service.py
```

## API Reference

### POST /predict

**Request:**
```json
{
  "temperature": 22.5,
  "ph": 8.7,
  "ec": 850,
  "turbidity": 35.2,
  "dissolvedOxygen": 3.8
}
```

**Response:**
```json
{
  "risk": "Moderate",
  "confidence": 0.856,
  "action": {
    "aerator_pwm": 120,
    "aerator_state": "ON",
    "valve_state": "MICRODOSING",
    "reason": "Moderate risk detected. DO: 3.80 mg/L, Target: 5.0 mg/L"
  },
  "features": {
    "DO": 3.8,
    "Turbidity": 35.2,
    "pH": 8.7,
    "EC": 850,
    "Temp": 22.5
  }
}
```

### GET /health

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "encoder_loaded": true
}
```

## Performance Metrics

**Model Performance (Expected):**
- Accuracy: 85-95%
- Prediction Time: <50ms
- Memory Usage: ~100MB

**System Performance:**
- ML Service Response: <100ms
- End-to-End Latency: <200ms
- Update Frequency: 5 seconds

## Security Considerations

**Production Deployment:**
1. Add authentication to ML service endpoints
2. Use HTTPS for ML service communication
3. Validate input data ranges
4. Rate limit prediction requests
5. Monitor for anomalous predictions

## Next Steps

1. ✅ Train initial model with historical data
2. ✅ Start ML service
3. ✅ Verify backend integration
4. ✅ Test frontend display
5. 🔄 Collect live data for model improvement
6. 🔄 Implement actuator control with ESP32
7. 🔄 Add alerting system for high-risk events
8. 🔄 Set up automated model retraining

## Support

For issues or questions:
- Check logs: ML service console output
- Verify model files: `rf_model.joblib`, `label_encoder.joblib`
- Test endpoints: Use curl or Postman
- Review training data: Ensure proper formatting

---

**Last Updated:** December 11, 2025
**PhycoSense Version:** 1.0.0
