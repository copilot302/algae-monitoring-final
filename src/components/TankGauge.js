import React from 'react';

const TankGauge = ({ value, unit = '%', title = 'Level' }) => {
  // Ensure value is between 0-100
  const percentage = Math.max(0, Math.min(100, value));
  
  // Determine color based on level
  const getColor = (level) => {
    if (level >= 50) return '#4ade80'; // Green - OK
    if (level >= 20) return '#fbbf24'; // Yellow - Low
    return '#ef4444'; // Red - Critical
  };

  // Determine status text
  const getStatus = (level) => {
    if (level >= 50) return 'OK';
    if (level >= 20) return 'Low';
    return 'REFILL NOW!';
  };

  const fillColor = getColor(percentage);
  const status = getStatus(percentage);

  return (
    <div className="tank-gauge">
      <div className="tank-container">
        {/* Tank outline */}
        <div className="tank-outline">
          {/* Liquid fill */}
          <div 
            className="tank-fill" 
            style={{ 
              height: `${percentage}%`,
              backgroundColor: fillColor,
              boxShadow: `0 0 20px ${fillColor}40`
            }}
          >
            {/* Animated waves effect */}
            <div className="tank-wave"></div>
          </div>
          
          {/* Level markers */}
          <div className="tank-markers">
            <div className="marker marker-100"><span>100%</span></div>
            <div className="marker marker-75"><span>75%</span></div>
            <div className="marker marker-50"><span>50%</span></div>
            <div className="marker marker-25"><span>25%</span></div>
            <div className="marker marker-0"><span>0%</span></div>
          </div>
        </div>
        
        {/* Value display */}
        <div className="tank-value">
          <div className="tank-percentage">{percentage.toFixed(0)}{unit}</div>
          <div 
            className="tank-status" 
            style={{ color: fillColor }}
          >
            {status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TankGauge;
