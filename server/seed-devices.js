/**
 * seed-devices.js
 * Migrates all keys from config/devices.json into MongoDB,
 * and adds any extra keys you specify in EXTRA_KEYS below.
 *
 * Run once from the server/ directory:
 *   node seed-devices.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const hashKey = (key) => crypto.createHash('sha256').update(key).digest('hex');

// ── Add any manually registered keys here ──────────────────────────────────
const EXTRA_KEYS = [
  { key: 'PHY-GHMY-9D9T', deviceId: 'ESP32-PROVISIONED', deviceName: 'My PhycoSense Device' },
  { key: 'PHY-C2HP-TK7T', deviceId: 'ESP32-PROVISIONED-2', deviceName: 'My PhycoSense Device' }
];
// ───────────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Device = require('./models/Device');

  // Load devices.json
  const devicesPath = path.join(__dirname, 'config/devices.json');
  let devicesJson = {};
  try {
    devicesJson = JSON.parse(fs.readFileSync(devicesPath, 'utf8'));
  } catch {
    console.log('No devices.json found, skipping file migration.');
  }

  // Merge file keys + extra keys
  const allEntries = [
    ...Object.entries(devicesJson).map(([key, info]) => ({ key, ...info })),
    ...EXTRA_KEYS
  ];

  // Deduplicate by key
  const seen = new Set();
  const unique = allEntries.filter(e => {
    if (seen.has(e.key)) return false;
    seen.add(e.key);
    return true;
  });

  for (const { key, deviceId, deviceName } of unique) {
    const hash = hashKey(key);

    const existsByKey = await Device.findOne({ accessKeyHash: hash });
    if (existsByKey) {
      console.log(`SKIP (key exists):     ${key}`);
      continue;
    }

    const existsById = await Device.findOne({ deviceId });
    if (existsById) {
      console.log(`SKIP (deviceId taken): ${key} → ${deviceId}`);
      continue;
    }

    await Device.create({ deviceId, deviceName, accessKey: key, accessKeyHash: hash });
    console.log(`REGISTERED:            ${key} → ${deviceId} (${deviceName})`);
  }

  await mongoose.disconnect();
  console.log('\nDone!');
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
