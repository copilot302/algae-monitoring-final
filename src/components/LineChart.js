import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ data, color = '#4dd0e1', unit = '' }) => {
  const chartRef = useRef();

  const chartData = {
    labels: Array.from({ length: data.length }, (_, i) => `${i * 5}min`),
    datasets: [
      {
        label: 'Value',
        data: data,
        borderColor: color,
        backgroundColor: `${color}12`,
        borderWidth: 1.8,
        fill: false,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: color,
        pointBorderColor: color,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'nearest',
        intersect: false,
        backgroundColor: 'rgba(20, 28, 36, 0.94)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.16)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(1)}${unit}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
          drawBorder: false,
        },
      },
      y: {
        display: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
          drawBorder: false,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      point: {
        hoverBackgroundColor: color,
      },
    },
  };

  return <Line ref={chartRef} data={chartData} options={options} />;
};

export default LineChart;