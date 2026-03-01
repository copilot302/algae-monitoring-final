# PhycoSense System Architecture

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                               │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Web Browser / Mobile Device                                │   │
│  │  http://localhost:3000 or http://192.168.X.X:3000          │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND (Port 3000)                      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Components:                                                  │  │
│  │  • Header (System Status, Risk Overview)                     │  │
│  │  • ParameterCard (5 Cards with Charts)                       │  │
│  │  • RiskAssessment (Overall Risk Display)                     │  │
│  │  • Footer (Export, Info)                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Custom Hooks:                                                │  │
│  │                                                               │  │
│  │  useSensorData()                                              │  │
│  │  ├─ generateRealisticValue()   → Simulates sensor data       │  │
│  │  ├─ logDataToDatabase()        → POST to API                 │  │
│  │  └─ fetchHistoricalData()      → GET from API                │  │
│  │                                                               │  │
│  │  useRiskAssessment()                                          │  │
│  │  └─ calculateRisk()             → Random Forest algorithm     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Data Update: Every 3 seconds                                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  │ HTTP Requests
                                  │ (fetch API)
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     EXPRESS BACKEND (Port 5000)                      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Middleware:                                                  │  │
│  │  • CORS (Cross-Origin Resource Sharing)                      │  │
│  │  • express.json() (Parse JSON bodies)                        │  │
│  │  • Error Handler                                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  API Routes: /api/sensor-data                                 │  │
│  │                                                               │  │
│  │  POST   /                 → Create new sensor reading        │  │
│  │  GET    /                 → Get readings (with filters)      │  │
│  │  GET    /latest           → Get most recent reading          │  │
│  │  GET    /stats            → Get statistics                   │  │
│  │  DELETE /:id              → Delete specific reading          │  │
│  │                                                               │  │
│  │  GET    /api/health       → Health check                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Mongoose Models:                                             │  │
│  │                                                               │  │
│  │  SensorData Schema                                            │  │
│  │  ├─ temperature: Number                                       │  │
│  │  ├─ dissolvedOxygen: Number                                   │  │
│  │  ├─ ph: Number                                                │  │
│  │  ├─ electricalConductivity: Number                            │  │
│  │  ├─ turbidity: Number                                         │  │
│  │  ├─ riskLevel: String                                         │  │
│  │  ├─ timestamp: Date (indexed)                                 │  │
│  │  ├─ createdAt: Date (auto)                                    │  │
│  │  └─ updatedAt: Date (auto)                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  │ Mongoose ODM
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                                  │
│                                                                      │
│  Database: phycosense                                               │
│  Collection: sensordatas                                            │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Document Structure:                                          │  │
│  │                                                               │  │
│  │  {                                                            │  │
│  │    _id: ObjectId("..."),                                      │  │
│  │    temperature: 22.5,                                         │  │
│  │    dissolvedOxygen: 3.8,                                      │  │
│  │    ph: 8.7,                                                   │  │
│  │    electricalConductivity: 850,                               │  │
│  │    turbidity: 35.2,                                           │  │
│  │    riskLevel: "Medium",                                       │  │
│  │    timestamp: ISODate("2025-10-15T10:30:00.000Z"),           │  │
│  │    createdAt: ISODate("2025-10-15T10:30:00.123Z"),           │  │
│  │    updatedAt: ISODate("2025-10-15T10:30:00.123Z"),           │  │
│  │    __v: 0                                                     │  │
│  │  }                                                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Indexes:                                                           │
│  • _id (default)                                                    │
│  • timestamp (descending) - for efficient time-based queries       │
│                                                                      │
│  Storage: Local or MongoDB Atlas Cloud                              │
└─────────────────────────────────────────────────────────────────────┘


## Data Flow Diagram

### 1. Real-time Monitoring (Every 3 seconds)

┌──────────────┐
│ Timer Event  │
│ (3 seconds)  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ useSensorData Hook       │
│ generateRealisticValue() │
│                          │
│ Generates new values:    │
│ • Temperature            │
│ • Dissolved Oxygen       │
│ • pH                     │
│ • Electrical Conductivity│
│ • Turbidity              │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ App.js useEffect         │
│ Detects sensorData       │
│ change                   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ useRiskAssessment Hook   │
│                          │
│ Calculates:              │
│ • Individual risk levels │
│ • Overall risk level     │
│ (Low/Medium/High)        │
└──────┬───────────────────┘
       │
       ├────────────────────┐
       │                    │
       ▼                    ▼
┌──────────────┐    ┌──────────────────┐
│ Update UI    │    │ logDataToDatabase│
│ • Charts     │    │                  │
│ • Cards      │    │ POST /api/       │
│ • Risk Badge │    │ sensor-data      │
└──────────────┘    └────────┬─────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Express Route  │
                    │ Handler        │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Mongoose Model │
                    │ .save()        │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ MongoDB        │
                    │ Insert Document│
                    └────────────────┘


### 2. Historical Data Retrieval (On page load)

┌──────────────┐
│ Page Load    │
│ useEffect    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ fetchHistoricalData()    │
│                          │
│ GET /api/sensor-data     │
│ ?limit=20                │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Express Route Handler    │
│                          │
│ SensorData.find()        │
│ .sort({timestamp: -1})   │
│ .limit(20)               │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ MongoDB Query            │
│                          │
│ Returns 20 most recent   │
│ documents                │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Process Response         │
│                          │
│ • Reverse array          │
│ • Extract parameter data │
│ • Update dataHistory     │
│ • Set latest as current  │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Update UI                │
│                          │
│ • Populate charts        │
│ • Display current values │
│ • Show risk assessment   │
└──────────────────────────┘


## Network Architecture (Mobile Access)

┌─────────────────────────────────────────────────────────────┐
│                     Local Network                            │
│                     192.168.X.X                              │
│                                                              │
│  ┌────────────────────┐         ┌─────────────────────┐    │
│  │  Desktop/Laptop    │         │  Mobile Device      │    │
│  │  Development PC    │         │  Phone/Tablet       │    │
│  │                    │         │                     │    │
│  │  Running:          │◄───────►│  Browser:           │    │
│  │  • Frontend :3000  │   WiFi  │  192.168.X.X:3000   │    │
│  │  • Backend  :5000  │         │                     │    │
│  │  • MongoDB  :27017 │         └─────────────────────┘    │
│  └────────────────────┘                                     │
│           │                                                  │
│           │                                                  │
│           ▼                                                  │
│  ┌────────────────────┐                                     │
│  │  MongoDB Local     │                                     │
│  │  or Atlas Cloud    │                                     │
│  └────────────────────┘                                     │
└─────────────────────────────────────────────────────────────┘


## File Structure with Data Flow

algae-monitoring/
│
├── src/                            ← FRONTEND
│   ├── App.js                      ← Main component, coordinates data flow
│   ├── hooks/
│   │   ├── useSensorData.js        ← Data generation + API calls
│   │   └── useRiskAssessment.js    ← Risk calculation logic
│   ├── components/
│   │   ├── Header.js               ← Display connection status
│   │   ├── ParameterCard.js        ← Display individual parameters
│   │   ├── RiskAssessment.js       ← Display overall risk
│   │   └── Footer.js               ← Export functionality
│   └── utils/
│       └── dataExport.js           ← Excel export logic
│
├── server/                         ← BACKEND
│   ├── server.js                   ← Express app entry point
│   ├── config/
│   │   └── db.js                   ← MongoDB connection setup
│   ├── models/
│   │   └── SensorData.js           ← Mongoose schema definition
│   ├── routes/
│   │   └── sensorData.js           ← API endpoint handlers
│   └── .env                        ← Configuration (MongoDB URI, Port)
│
├── start-backend.bat               ← Quick start script
├── start-frontend.bat              ← Quick start script
├── MONGODB_SETUP.md                ← Setup instructions
└── INTEGRATION_SUMMARY.md          ← Overview document


## Technology Stack Details

┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
├─────────────────────────────────────────────────────────────┤
│ • React 18.2.0          - UI framework                      │
│ • Chart.js 4.4.0        - Data visualization                │
│ • react-chartjs-2 5.2.0 - React wrapper for Chart.js        │
│ • lucide-react 0.263.1  - Icon library                      │
│ • xlsx 0.18.5           - Excel export                      │
│ • Webpack 5             - Module bundler                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        Backend                               │
├─────────────────────────────────────────────────────────────┤
│ • Node.js               - Runtime environment               │
│ • Express 4.18.2        - Web framework                     │
│ • Mongoose 8.0.0        - MongoDB ODM                       │
│ • CORS 2.8.5            - Cross-origin support              │
│ • dotenv 16.3.1         - Environment variables             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        Database                              │
├─────────────────────────────────────────────────────────────┤
│ • MongoDB 7.0+          - NoSQL database                    │
│ • MongoDB Compass       - GUI tool (optional)               │
│ • MongoDB Atlas         - Cloud option (optional)           │
└─────────────────────────────────────────────────────────────┘


## Risk Assessment Algorithm Flow

Input: Sensor Data
  │
  ├─ Temperature (°C)
  ├─ Dissolved Oxygen (mg/L)
  ├─ pH Level
  ├─ Electrical Conductivity (µS/cm)
  └─ Turbidity (NTU)
  │
  ▼
┌─────────────────────────────────────────┐
│ Apply Thresholds (Random Forest Based)  │
│                                          │
│ For each parameter:                      │
│ • Low risk    = 0 points                 │
│ • Medium risk = 1 point                  │
│ • High risk   = 2 points                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Calculate Total Risk Score               │
│                                          │
│ Sum all individual risk points          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Determine Overall Risk Level             │
│                                          │
│ • 0-2 points   → Low Risk                │
│ • 3-5 points   → Medium Risk             │
│ • 6-10 points  → High Risk               │
└─────────────────┬───────────────────────┘
                  │
                  ▼
Output: 
  ├─ Individual risk levels per parameter
  ├─ Overall risk level
  └─ Saved to MongoDB with timestamp


## Deployment Architecture (Future)

┌─────────────────────────────────────────────────────────────┐
│                      Production Setup                        │
│                                                              │
│  ┌─────────────────┐         ┌──────────────────┐          │
│  │  Frontend       │         │  Backend         │          │
│  │  (Vercel/       │         │  (Heroku/        │          │
│  │   Netlify)      │◄───────►│   AWS/Azure)     │          │
│  │                 │  HTTPS  │                  │          │
│  │  Static Build   │         │  Node.js Server  │          │
│  └─────────────────┘         └────────┬─────────┘          │
│                                        │                    │
│                                        │ Mongoose           │
│                                        │                    │
│                              ┌─────────▼─────────┐          │
│                              │  MongoDB Atlas    │          │
│                              │  (Cloud Database) │          │
│                              │  • Auto-scaling   │          │
│                              │  • Backups        │          │
│                              │  • High Avail.    │          │
│                              └───────────────────┘          │
└─────────────────────────────────────────────────────────────┘
