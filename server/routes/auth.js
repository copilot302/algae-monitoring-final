const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Load the pre-generated device key registry (like the printed code on a router/modem label)
const devicesPath = path.join(__dirname, '../config/devices.json');

const loadDevices = () => {
  try {
    return JSON.parse(fs.readFileSync(devicesPath, 'utf8'));
  } catch {
    return {};
  }
};

// Generate a unique PHY-XXXX-XXXX key
const generateKey = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = (len) => {
    const bytes = crypto.randomBytes(len);
    return Array.from(bytes).map(b => chars[b % chars.length]).join('');
  };
  return `PHY-${segment(4)}-${segment(4)}`;
};

// @route   POST /api/auth/verify-key
// @desc    Verify a device access key printed in the device manual
// @access  Public
router.post('/verify-key', (req, res) => {
  const { accessKey } = req.body;

  if (!accessKey || typeof accessKey !== 'string') {
    return res.status(400).json({ message: 'Access key is required' });
  }

  const devices = loadDevices();
  const key = accessKey.trim().toUpperCase();
  const device = devices[key];

  if (!device) {
    return res.status(401).json({ message: 'Invalid access key' });
  }

  res.json({
    authenticated: true,
    deviceId: device.deviceId,
    deviceName: device.deviceName
  });
});

// @route   POST /api/auth/register-device
// @desc    Called by ESP32 during WiFi provisioning to get its unique access key.
//          Generates a PHY-XXXX-XXXX key and saves it to devices.json.
//          The key is shown on the device's hotspot portal (192.168.4.1) so the
//          user can write it down — just like the printed code on a modem/router.
// @access  Public
router.post('/register-device', (req, res) => {
  const { deviceId, deviceName } = req.body;

  if (!deviceId) {
    return res.status(400).json({ message: 'deviceId is required' });
  }

  const devices = loadDevices();

  // If this deviceId is already registered, return its existing key (re-flash recovery)
  const existingEntry = Object.entries(devices).find(([, d]) => d.deviceId === deviceId);
  if (existingEntry) {
    return res.status(409).json({
      message: 'Device already registered',
      deviceId,
      accessKey: existingEntry[0]
    });
  }

  // Generate a unique key that isn't already in use
  let key;
  do {
    key = generateKey();
  } while (devices[key]);

  devices[key] = {
    deviceId,
    deviceName: deviceName || 'PhycoSense Device'
  };

  try {
    fs.writeFileSync(devicesPath, JSON.stringify(devices, null, 2));
  } catch (err) {
    console.error('Failed to save device:', err.message);
    return res.status(500).json({ message: 'Failed to register device' });
  }

  console.log(`Device registered: ${deviceId} → ${key}`);
  res.status(201).json({
    message: 'Device registered successfully',
    deviceId,
    deviceName: devices[key].deviceName,
    accessKey: key
  });
});

// @route   POST /api/auth/verify-keys
// @desc    Verify multiple saved access keys (for returning users)
// @access  Public
router.post('/verify-keys', (req, res) => {
  const { accessKeys } = req.body;

  if (!Array.isArray(accessKeys) || accessKeys.length === 0) {
    return res.status(400).json({ message: 'Access keys array is required' });
  }

  if (accessKeys.length > 20) {
    return res.status(400).json({ message: 'Too many keys (max 20)' });
  }

  const devices = loadDevices();
  const matched = accessKeys
    .map(k => devices[k.trim().toUpperCase()])
    .filter(Boolean);

  res.json({
    authenticated: matched.length > 0,
    devices: matched
  });
});

module.exports = router;
