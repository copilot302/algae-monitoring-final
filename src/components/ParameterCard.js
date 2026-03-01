import React from 'react';
import Icon from './Icon';
import LineChart from './LineChart';
import CircularGauge from './CircularGauge';
import { calculateTrend } from '../utils/trendAnalysis';

const ParameterCard = ({ 
  title, 
  icon, 
  value, 
  unit, 
  data, 
  riskLevel, 
  type = 'chart',
  min = 0,
  max = 100 
}) => {
  const trend = calculateTrend(data);
  
  const getRiskBadgeText = (risk) => {
    switch (risk) {
      case 'normal': return 'Normal';
      case 'moderate': return 'Moderate Risk';
      case 'high': return 'High Risk';
      default: return 'Normal';
    }
  };

  const getTrendIcon = (trendDirection) => {
    switch (trendDirection) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const getTrendText = (trendDirection) => {
    switch (trendDirection) {
      case 'up': return 'Rising';
      case 'down': return 'Decreasing';
      default: return 'Stable';
    }
  };

  return (
    <div className={`parameter-card ${riskLevel}`}>
      <div className="card-header">
        <h3>
          <Icon name={icon} size={20} />
          {title}
        </h3>
        <div className={`risk-badge ${riskLevel}`}>
          {getRiskBadgeText(riskLevel)}
        </div>
      </div>
      
      <div className="card-content">
        {type === 'gauge' ? (
          <div className="gauge-container">
            <CircularGauge 
              value={value} 
              min={min} 
              max={max} 
              unit={unit}
              title={title}
            />
          </div>
        ) : (
          <>
            <div className="value-display">
              <span className="value">{value.toFixed(1)}</span>
              <span className="unit">{unit}</span>
            </div>
            <div className="chart-container">
              <LineChart data={data} color="#4dd0e1" unit={unit} />
            </div>
          </>
        )}
        
        <div className="trend-indicator">
          <span className={`trend-icon ${trend}`}>
            {getTrendIcon(trend)}
          </span>
          <span className="trend-text">{getTrendText(trend)}</span>
        </div>
      </div>
    </div>
  );
};

export default ParameterCard;