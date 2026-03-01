import React from 'react';
import Icon from './Icon';

const Footer = ({ onExportData }) => {
  const handleSettingsClick = () => {
    alert('Settings panel would open here in a full implementation');
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="export-controls">
          <button className="btn-export" onClick={onExportData}>
            <Icon name="download" size={16} />
            Export Data
          </button>
          <button className="btn-settings" onClick={handleSettingsClick}>
            <Icon name="settings" size={16} />
            Settings
          </button>
        </div>
        <div className="footer-info">
          <p>&copy; 2025 PhycoSense - Algae Monitoring System</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;