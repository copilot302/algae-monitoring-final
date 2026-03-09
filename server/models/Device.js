const mongoose = require('mongoose');
const crypto = require('crypto');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  deviceName: {
    type: String,
    default: 'PhycoSense Device'
  },
  accessKey: {
    type: String,
    required: true,
    unique: true
  },
  accessKeyHash: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate a unique access key like PHY-XXXX-XXXX
deviceSchema.statics.generateAccessKey = function () {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars (0/O, 1/I)
  const segment = (len) => {
    const bytes = crypto.randomBytes(len);
    return Array.from(bytes).map(b => chars[b % chars.length]).join('');
  };
  return `PHY-${segment(4)}-${segment(4)}`;
};

// Hash an access key for secure storage comparison
deviceSchema.statics.hashKey = function (key) {
  return crypto.createHash('sha256').update(key).digest('hex');
};

module.exports = mongoose.model('Device', deviceSchema);
