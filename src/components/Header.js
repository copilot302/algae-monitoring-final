import React from 'react';
import Icon from './Icon';

const Header = ({ isConnected, overallRisk }) => {
  const getRiskMessage = (risk) => {
    switch (risk) {
      case 'normal':
        return 'System Monitoring Active - All Parameters Normal';
      case 'moderate':
        return 'Caution: Potential Algae Bloom Formation Detected';
      case 'high':
        return 'Alert: High Risk Bloom Conditions Present';
      default:
        return 'System Monitoring Active';
    }
  };

  const getRiskAlertClass = (risk) => {
    switch (risk) {
      case 'moderate':
        return 'risk-alert warning';
      case 'high':
        return 'risk-alert danger';
      default:
        return 'risk-alert';
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="title">
          <Icon name="droplets" size={48} className="title-icon" />
          PhycoSense
        </h1>
        <p className="subtitle">Real-time Algae Monitoring Dashboard</p>
        <div className="status-indicator">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      <div className={getRiskAlertClass(overallRisk)}>
        <Icon name="alertTriangle" size={20} />
        <span>{getRiskMessage(overallRisk)}</span>
      </div>
    </header>
  );
};

export default Header;