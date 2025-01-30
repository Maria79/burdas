"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Extras = ({ extrasCount }) => {
  const labels = Object.keys(extrasCount).map(
    (extra) => extra.charAt(0).toUpperCase() + extra.slice(1)
  ); // Capitalize each label

  const data = Object.values(extrasCount); // Extract counts as data

  // Chart.js data
  const chartData = {
    labels,
    datasets: [
      {
        label: "Pedidos con Extras",
        data,
        backgroundColor: [
          "#FF5733", // Red
          "#36A2EB", // Blue
          "#FFC300", // Yellow
          "#4CAF50", // Green
          "#9C27B0", // Purple
          "#FF9800", // Orange
          "#E91E63", // Pink
        ],
        borderColor: "#ddd",
        borderWidth: 1.5,
        borderRadius: 5,
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: { size: 14, weight: "bold" },
          color: "#333",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} pedidos`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Extras",
          font: { weight: "bold" },
        },
        ticks: { color: "#555" },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Cantidad de Pedidos",
          font: { weight: "bold" },
        },
        ticks: { color: "#555" },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          🛠️ Pedidos con Extras
        </h2>

        {/* Chart Container */}
        <div className="h-[350px]">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Extras;
