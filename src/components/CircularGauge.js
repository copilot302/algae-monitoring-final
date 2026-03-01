import React from 'react';

const CircularGauge = ({ value, min, max, unit, title }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 360;
  
  // Create color gradient based on value for pH and conductivity
  const getGaugeColor = () => {
    if (title === 'pH Level') {
      if (value < 6.5 || value > 8.5) return '#f44336'; // Red for extreme pH
      if (value < 7 || value > 8) return '#ff9800'; // Orange for moderate pH
      return '#4caf50'; // Green for optimal pH
    }
    
    // Default gradient for other parameters
    if (percentage < 33) return '#4caf50';
    if (percentage < 66) return '#ff9800';
    return '#f44336';
  };

  const gaugeColor = getGaugeColor();

  return (
    <div className="gauge">
      <div className="gauge-circle">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="20"
          />
          
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${(angle / 360) * 502.65} 502.65`}
            transform="rotate(-90 100 100)"
            className="gauge-progress"
          />
          
          {/* Center content */}
          <text
            x="100"
            y="95"
            textAnchor="middle"
            className="gauge-value-text"
            fill="#4dd0e1"
            fontSize="28"
            fontWeight="700"
          >
            {value.toFixed(1)}
          </text>
          
          {unit && (
            <text
              x="100"
              y="115"
              textAnchor="middle"
              className="gauge-unit-text"
              fill="#90a4ae"
              fontSize="14"
            >
              {unit}
            </text>
          )}
          
          <text
            x="100"
            y="135"
            textAnchor="middle"
            className="gauge-label-text"
            fill="#b0bec5"
            fontSize="10"
            textTransform="uppercase"
            letterSpacing="1px"
          >
            Current {title.split(' ')[0]}
          </text>
        </svg>
      </div>
      
      {title === 'pH Level' && (
        <div className="ph-scale">
          <div className="ph-markers">
            <span>0</span>
            <span>7</span>
            <span>14</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CircularGauge;