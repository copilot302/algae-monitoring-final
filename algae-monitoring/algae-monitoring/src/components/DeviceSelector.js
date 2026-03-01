import React, { useState, useEffect } from 'react';
import Icon from './Icon';

const DeviceSelector = ({ selectedDevice, onDeviceChange }) => {
  const [devices, setDevices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
    // Refresh device list every 30 seconds
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('http://192.168.100.7:5000/api/sensor-data/devices');
      if (response.ok) {
        const data = await response.json();
        setDevices(data);
        
        // If no device is selected and devices exist, select the first one
        if (!selectedDevice && data.length > 0) {
          onDeviceChange(data[0].deviceId);
        }
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceSelect = (deviceId) => {
    onDeviceChange(deviceId);
    setIsOpen(false);
  };
  
  const getBatteryDisplay = (device) => {
    if (!device) return null;
    
    if (device.isUSBPowered) {
      return '🔌 USB';
    } else if (device.batteryPercentage !== null && device.batteryPercentage !== undefined) {
      const percentage = device.batteryPercentage;
      let emoji = '🔋';
      if (percentage < 20) emoji = '🪫';
      return `${emoji} ${percentage}%`;
    }
    return null;
  };

  const selectedDeviceData = devices.find(d => d.deviceId === selectedDevice);

  return (
    <div className="device-selector">
      <label className="device-selector-label">
        <Icon name="list" size={16} />
        <span>Device:</span>
      </label>
      
      <div className="dropdown">
        <button 
          className="dropdown-toggle"
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading || devices.length === 0}
        >
          <div className="selected-device">
            <span className="device-name">
              {loading ? 'Loading...' : 
               selectedDeviceData ? selectedDeviceData.deviceName : 
               'No devices available'}
            </span>
            {selectedDeviceData && (
              <div className="device-indicators">
                <span className={`device-status ${selectedDeviceData.status}`}>
                  {selectedDeviceData.status === 'online' ? '● Online' : '○ Offline'}
                </span>
                {getBatteryDisplay(selectedDeviceData) && (
                  <span className="battery-indicator">
                    {getBatteryDisplay(selectedDeviceData)}
                  </span>
                )}
              </div>
            )}
          </div>
          <Icon name="chevronDown" size={16} className={isOpen ? 'rotate' : ''} />
        </button>

        {isOpen && devices.length > 0 && (
          <div className="dropdown-menu">
            {devices.map(device => (
              <button
                key={device.deviceId}
                className={`dropdown-item ${device.deviceId === selectedDevice ? 'active' : ''}`}
                onClick={() => handleDeviceSelect(device.deviceId)}
              >
                <div className="device-item">
                  <div className="device-info">
                    <span className="device-name">{device.deviceName}</span>
                    <span className="device-id">{device.deviceId}</span>
                  </div>
                  <div className="device-meta">
                    <span className={`status-badge ${device.status}`}>
                      {device.status === 'online' ? '● Online' : '○ Offline'}
                    </span>
                    {getBatteryDisplay(device) && (
                      <span className="battery-badge">
                        {getBatteryDisplay(device)}
                      </span>
                    )}
                    <span className="last-update">
                      {new Date(device.lastUpdate).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceSelector;
