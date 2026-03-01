# PhycoSense Backend Server

Backend API server for the PhycoSense algae monitoring dashboard with MongoDB integration.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env` file and update MongoDB connection string
   - For local MongoDB: `mongodb://localhost:27017/phycosense`
   - For MongoDB Atlas: Get connection string from your cluster

## Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST /api/sensor-data
Log new sensor data to the database

**Request Body:**
```json
{
  "temperature": 22.5,
  "dissolvedOxygen": 3.8,
  "ph": 8.7,
  "electricalConductivity": 850,
  "turbidity": 35.2,
  "riskLevel": "Medium"
}
```

### GET /api/sensor-data
Get sensor data with optional filters

**Query Parameters:**
- `limit` (default: 100) - Number of records to return
- `startDate` - Filter by start date
- `endDate` - Filter by end date

### GET /api/sensor-data/latest
Get the most recent sensor reading

### GET /api/sensor-data/stats
Get statistics for a time period

**Query Parameters:**
- `startDate` - Filter by start date
- `endDate` - Filter by end date

### DELETE /api/sensor-data/:id
Delete a specific sensor data entry

### GET /api/health
Health check endpoint

## Database Schema

**SensorData Model:**
```javascript
{
  temperature: Number,
  dissolvedOxygen: Number,
  ph: Number,
  electricalConductivity: Number,
  turbidity: Number,
  riskLevel: String (Low/Medium/High),
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - Mac/Linux: `sudo systemctl start mongod`

### Option 2: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP address
5. Get connection string and update `.env` file

## Testing the API

Use tools like Postman, Insomnia, or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Get latest data
curl http://localhost:5000/api/sensor-data/latest

# Get all data (limit 10)
curl http://localhost:5000/api/sensor-data?limit=10
```

## Integration with Frontend

The React frontend automatically connects to the API at `http://localhost:5000/api/sensor-data`. Ensure both servers are running:

1. Backend: `cd server && npm run dev` (port 5000)
2. Frontend: `cd .. && npm start` (port 3000)

## Troubleshooting

**Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network/firewall settings

**CORS Issues:**
- CORS is enabled for all origins by default
- For production, configure specific origins in `server.js`

**Port Already in Use:**
- Change PORT in `.env` file
- Update API_URL in frontend `useSensorData.js`
