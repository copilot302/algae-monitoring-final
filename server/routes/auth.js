const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// @route   POST /api/auth/verify-key
// @desc    Verify a device access key and return allowed device IDs
// @access  Public
router.post('/verify-key', async (req, res) => {
  try {
    const { accessKey } = req.body;

    if (!accessKey || typeof accessKey !== 'string') {
      return res.status(400).json({ message: 'Access key is required' });
    }

    const keyHash = Device.hashKey(accessKey.trim().toUpperCase());
    const device = await Device.findOne({ accessKeyHash: keyHash, isActive: true });

    if (!device) {
      return res.status(401).json({ message: 'Invalid access key' });
    }

    res.json({
      authenticated: true,
      deviceId: device.deviceId,
      deviceName: device.deviceName
    });
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// @route   POST /api/auth/verify-keys
// @desc    Verify multiple access keys at once (for returning users with saved keys)
// @access  Public
router.post('/verify-keys', async (req, res) => {
  try {
    const { accessKeys } = req.body;

    if (!Array.isArray(accessKeys) || accessKeys.length === 0) {
      return res.status(400).json({ message: 'Access keys array is required' });
    }

    // Limit to prevent abuse
    if (accessKeys.length > 20) {
      return res.status(400).json({ message: 'Too many keys (max 20)' });
    }

    const hashes = accessKeys.map(k => Device.hashKey(k.trim().toUpperCase()));
    const devices = await Device.find({ accessKeyHash: { $in: hashes }, isActive: true });

    res.json({
      authenticated: devices.length > 0,
      devices: devices.map(d => ({
        deviceId: d.deviceId,
        deviceName: d.deviceName
      }))
    });
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// @route   POST /api/auth/register-device
// @desc    Register a new device and generate access key (called during manufacturing/setup)
// @access  Should be protected in production (e.g., admin key)
router.post('/register-device', async (req, res) => {
  try {
    const { deviceId, deviceName } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: 'deviceId is required' });
    }

    // Check if device already registered — return the key so a re-flashed device can recover it
    const existing = await Device.findOne({ deviceId });
    if (existing) {
      return res.status(409).json({
        message: 'Device already registered',
        deviceId,
        accessKey: existing.accessKey  // allow device to recover key after re-flash
      });
    }

    const accessKey = Device.generateAccessKey();
    const accessKeyHash = Device.hashKey(accessKey);

    const device = new Device({
      deviceId,
      deviceName: deviceName || 'PhycoSense Device',
      accessKey, // Stored for admin reference — shown only at creation
      accessKeyHash
    });

    await device.save();

    res.status(201).json({
      message: 'Device registered successfully',
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      accessKey // Return the key ONCE so it can be printed/given to the customer
    });
  } catch (error) {
    console.error('Device registration error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
