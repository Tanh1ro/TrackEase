import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const data = {
    labels: ['Food & Dining', 'Transportation', 'Entertainment', 'Utilities'],
    datasets: [
      {
        data: [18900, 5300, 10500, 1900],
        backgroundColor: [
          '#29577b',
          '#35c09c',
          '#f6ce49',
          '#f7a35c'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Expense Distribution',
        font: {
          size: 16,
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DonutChart;
  