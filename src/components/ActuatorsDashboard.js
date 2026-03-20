import React, { useState } from 'react';
import Icon from './Icon';

const ActuatorsDashboard = ({
  lastAction,
  overallRisk,
  alertCount,
  mlServiceStatus,
  isConnected,
  latestPredictionConfidence
}) => {
  const actionText = (lastAction?.text || '').toLowerCase();

  const aeratorState = actionText.includes('aerator activated')
    ? 'Active'
    : actionText.includes('aerator deactivated')
      ? 'Inactive'
      : overallRisk === 'high'
        ? 'Standby High'
        : 'Standby';

  const probioticState = actionText.includes('probiotic')
    ? 'Dispensing'
    : overallRisk === 'moderate'
      ? 'Ready'
      : 'Idle';

  const [actuatorPower, setActuatorPower] = useState({
    aerationValve: aeratorState !== 'Inactive',
    probioticValve: probioticState !== 'Idle'
  });
  const [aeratorIntensity, setAeratorIntensity] = useState(aeratorState === 'Active' ? 75 : 45);

  const actuatorCards = [
    {
      key: 'aerationValve',
      name: 'Aeration Valve',
      icon: 'zap',
      state: aeratorState,
      detail: `Source: ${lastAction?.source || 'Rule-Based'}`
    },
    {
      key: 'probioticValve',
      name: 'Probiotic/Algaecide Valve',
      icon: 'droplets',
      state: probioticState,
      detail: `Risk mode: ${String(overallRisk).toUpperCase()}`
    }
  ];

  const getManualStateLabel = (key, fallbackState) => {
    if (key === 'aerationValve') {
      return actuatorPower.aerationValve ? `On • ${aeratorIntensity}%` : 'Off';
    }

    if (key in actuatorPower) {
      return actuatorPower[key] ? 'On' : 'Off';
    }

    return fallbackState;
  };

  const toggleActuator = (key, nextValue) => {
    setActuatorPower((previous) => ({
      ...previous,
      [key]: nextValue
    }));
  };

  return (
    <main className="dashboard actuators-page" aria-label="Actuators dashboard">
      <section className="actuators-header">
        <h2>Actuators Dashboard</h2>
        <p>Live status of control outputs for this device.</p>
        <p className="actuator-connection">Connection: {isConnected ? 'Online' : 'Offline'}</p>
      </section>

      <section className="actuators-grid">
        {actuatorCards.map((actuator) => (
          <article className="actuator-card" key={actuator.key}>
            <div className="actuator-card-head">
              <h3>
                <Icon name={actuator.icon} size={18} />
                {actuator.name}
              </h3>
              <span className="actuator-state">{getManualStateLabel(actuator.key, actuator.state)}</span>
            </div>
            <p className="actuator-detail">{actuator.detail}</p>

            <div className="actuator-controls">
              <button
                className={`actuator-toggle on ${actuatorPower[actuator.key] ? 'active' : ''}`}
                onClick={() => toggleActuator(actuator.key, true)}
                disabled={!isConnected}
              >
                ON
              </button>
              <button
                className={`actuator-toggle off ${!actuatorPower[actuator.key] ? 'active' : ''}`}
                onClick={() => toggleActuator(actuator.key, false)}
                disabled={!isConnected}
              >
                OFF
              </button>
            </div>

            {actuator.key === 'aerationValve' && (
              <div className="actuator-slider-wrap">
                <div className="actuator-slider-head">
                  <span>Aerator Intensity</span>
                  <strong>{aeratorIntensity}%</strong>
                </div>
                <input
                  className="actuator-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={aeratorIntensity}
                  onChange={(event) => setAeratorIntensity(Number(event.target.value))}
                  disabled={!isConnected || !actuatorPower.aerationValve}
                />
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
};

export default ActuatorsDashboard;
