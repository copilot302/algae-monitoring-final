/**
 * PhycoSense Device Key Generator
 * Run this before manufacturing/shipping a new unit to assign it a unique access key.
 *
 * Usage:
 *   node generate-keys.js <deviceId> [deviceName]
 *
 * Examples:
 *   node generate-keys.js TANK-04 "Tank 4"
 *   node generate-keys.js TANK-05
 *
 * The generated key (e.g. PHY-A3F2-KX91) is printed to the console.
 * Print it in the device manual / stick a label on the unit before shipping.
 */

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const devicesPath = path.join(__dirname, 'config/devices.json');

const generateKey = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars (0/O, 1/I)
  const segment = (len) => {
    const bytes = crypto.randomBytes(len);
    return Array.from(bytes).map(b => chars[b % chars.length]).join('');
  };
  return `PHY-${segment(4)}-${segment(4)}`;
};

const [,, deviceId, deviceName] = process.argv;

if (!deviceId) {
  console.log('Usage:   node generate-keys.js <deviceId> [deviceName]');
  console.log('Example: node generate-keys.js TANK-04 "Tank 4"');
  process.exit(1);
}

const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf8'));

// Check if this deviceId already has a key
const existing = Object.entries(devices).find(([, d]) => d.deviceId === deviceId);
if (existing) {
  console.log(`Device ${deviceId} is already registered.`);
  console.log(`Existing key: ${existing[0]}`);
  process.exit(0);
}

const key = generateKey();
devices[key] = {
  deviceId,
  deviceName: deviceName || 'PhycoSense Device'
};

fs.writeFileSync(devicesPath, JSON.stringify(devices, null, 2));

console.log('');
console.log('========================================');
console.log('       NEW DEVICE KEY GENERATED');
console.log('========================================');
console.log(`  Device ID   : ${deviceId}`);
console.log(`  Device Name : ${devices[key].deviceName}`);
console.log(`  Access Key  : ${key}`);
console.log('========================================');
console.log('');
console.log('ACTION REQUIRED: Print this key in the');
console.log('device manual or stick a label on the unit.');
console.log('');
