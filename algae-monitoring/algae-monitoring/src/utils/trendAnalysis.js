export const calculateTrend = (dataArray) => {
  if (!dataArray || dataArray.length < 5) {
    return 'stable';
  }

  const recent = dataArray.slice(-5);
  const older = dataArray.slice(-10, -5);
  
  if (older.length === 0) {
    return 'stable';
  }

  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
  
  const changePercentage = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (changePercentage > 2) {
    return 'up';
  } else if (changePercentage < -2) {
    return 'down';
  } else {
    return 'stable';
  }
};