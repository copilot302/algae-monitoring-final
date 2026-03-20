import React, { useRef } from 'react';
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

const thresholdBandPlugin = {
  id: 'thresholdBand',
  beforeDraw: (chart, _args, options) => {
    if (!options || options.low == null || options.high == null) return;
    const { ctx, chartArea, scales } = chart;
    if (!chartArea || !scales?.y) return;

    const lowY = scales.y.getPixelForValue(options.low);
    const highY = scales.y.getPixelForValue(options.high);
    const top = Math.min(lowY, highY);
    const height = Math.abs(lowY - highY);

    ctx.save();
    ctx.fillStyle = options.fillColor || 'rgba(16, 185, 129, 0.12)';
    ctx.fillRect(chartArea.left, top, chartArea.right - chartArea.left, height);
    ctx.restore();
  }
};

const crosshairPlugin = {
  id: 'crosshair',
  afterDraw: (chart, _args, options) => {
    const active = chart.tooltip?.getActiveElements?.();
    if (!active || active.length === 0) return;

    const { ctx, chartArea } = chart;
    const x = active[0].element.x;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = options?.color || 'rgba(148, 163, 184, 0.5)';
    ctx.stroke();
    ctx.restore();
  }
};

const LineChart = ({ data, color = '#4dd0e1', unit = '', thresholds }) => {
  const chartRef = useRef();

  const chartData = {
    labels: Array.from({ length: data.length }, (_, i) => `${i * 5}min`),
    datasets: [
      {
        label: 'Value',
        data: data,
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2.2,
        fill: true,
        tension: 0.34,
        pointRadius: 0,
        pointHoverRadius: 4,
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
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: color,
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(1)}${unit}`;
          }
        }
      },
      thresholdBand: thresholds
        ? {
            low: thresholds.low,
            high: thresholds.high,
            fillColor: 'rgba(52, 211, 153, 0.12)'
          }
        : undefined,
      crosshair: {
        color: 'rgba(148, 163, 184, 0.45)'
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.12)',
          drawBorder: false,
        },
        ticks: {
          color: '#9fb0c9',
          font: {
            size: 10,
          },
          maxTicksLimit: 5,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.12)',
          drawBorder: false,
        },
        ticks: {
          color: '#9fb0c9',
          font: {
            size: 10,
          },
          callback: function(value) {
            return `${value.toFixed(1)}${unit}`;
          }
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

  return <Line ref={chartRef} data={chartData} options={options} plugins={[thresholdBandPlugin, crosshairPlugin]} />;
};

export default LineChart;