"use client"

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  tension: 0.4,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

const labels = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const values = [2, 0, 6, 3, 4, 8, 1, 11, 0, 5, 9, 3];

const newLabels = labels.filter((_, ind) => values[ind] !== 0);

const newValues = values.filter((val) => val !== 0);

const data = {
  labels: newLabels,
  datasets: [
    {
      label: '',
      data: newLabels.map((_, ind) => newValues[ind]),
      borderColor: '#BF372A',
      backgroundColor: '#DF372A',
    }
  ],
};

const UserRequestsChart = () => {
  return (
    <div className='flex flex-col justify-between w-full relative'>
      <h3 className='text-black font-RobotoBold text-xl mb-4 capitalize'>Blood Requests</h3>
      <Line options={options} data={data} />
    </div>
  )
}

export default UserRequestsChart