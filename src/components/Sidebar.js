import React from 'react';
import DeviceSelector from './DeviceSelector';
import Icon from './Icon';

const Sidebar = ({
  selectedDevice,
  onDeviceChange,
  allowedDevices,
  deviceAliases,
  isConnected,
  freshnessLabel,
  lastAction,
  actionHistory,
  overallRisk,
  latestPredictionConfidence,
  alertCount,
  mlServiceStatus,
  isMlDriven,
  onExportData,
  onOpenSettings,
  onLogout,
  isCollapsed,
  onToggleCollapse
}) => {
  const riskClass = overallRisk === 'high'
    ? 'danger'
    : overallRisk === 'moderate'
      ? 'warning'
      : 'normal';

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`} aria-label="Dashboard sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Icon name="shield" size={16} />
        </div>
        <div className="sidebar-brand-text">
          <p className="sidebar-brand-name">PhycoSense</p>
          <p className="sidebar-brand-version">v1.2</p>
        </div>
      </div>

      <button
        className="sidebar-edge-toggle"
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Minimize sidebar'}
        title={isCollapsed ? 'Expand sidebar' : 'Minimize sidebar'}
      >
        <span className="sidebar-toggle-glyph">&lt;</span>
      </button>

      <section className="sidebar-section">
        <h3 className="sidebar-title">
          <Icon name="list" size={16} />
          <span className="sidebar-title-text">Device Context</span>
        </h3>
        <DeviceSelector
          selectedDevice={selectedDevice}
          onDeviceChange={onDeviceChange}
          allowedDevices={allowedDevices}
          deviceAliases={deviceAliases}
        />
        <p className="sidebar-meta">Connection: {isConnected ? 'Online' : 'Offline'}</p>
        <p className="sidebar-meta">Last update: {freshnessLabel}</p>
      </section>

      <section className="sidebar-section">
        <h3 className="sidebar-title">
          <Icon name="settings" size={16} />
          <span className="sidebar-title-text">Quick Actions</span>
        </h3>
        <div className="sidebar-actions">
          <button className="sidebar-btn" onClick={onExportData}>Export Data</button>
          <button className="sidebar-btn" onClick={onOpenSettings}>Settings</button>
          <button className="sidebar-btn danger" onClick={onLogout}>Sign Out</button>
        </div>
      </section>

      <section className="sidebar-section">
        <h3 className="sidebar-title">
          <Icon name="shield" size={16} />
          <span className="sidebar-title-text">Action Center</span>
        </h3>
        <p className="sidebar-action-value">{lastAction.text}</p>
        <p className="sidebar-meta">{lastAction.time} • {lastAction.source}</p>
        <span className={`kpi-status-badge ${lastAction.status.toLowerCase()}`}>{lastAction.status}</span>

        <div className="sidebar-history">
          {actionHistory.length === 0 && <p className="sidebar-meta">No action history yet</p>}
          {actionHistory.map((entry) => (
            <div key={entry.id} className="sidebar-history-item">
              <p>{entry.text}</p>
              <span>{entry.source}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="sidebar-section">
        <h3 className="sidebar-title">
          <Icon name="alertTriangle" size={16} />
          <span className="sidebar-title-text">Risk Snapshot</span>
        </h3>
        <p className={`sidebar-risk-badge ${riskClass}`}>{String(overallRisk).toUpperCase()}</p>
        <p className="sidebar-meta">ML confidence: {latestPredictionConfidence}</p>
        <p className="sidebar-meta">Source: {isMlDriven ? 'ML Recommendation' : 'Rule-Based'}</p>
      </section>

      <section className="sidebar-section">
        <h3 className="sidebar-title">
          <Icon name="alertTriangle" size={16} />
          <span className="sidebar-title-text">Alerts & Exceptions</span>
        </h3>
        <p className="sidebar-meta">Active alerts: {alertCount}</p>
        <p className="sidebar-meta">ML service: {mlServiceStatus}</p>
      </section>
    </aside>
  );
};

export default Sidebar;
