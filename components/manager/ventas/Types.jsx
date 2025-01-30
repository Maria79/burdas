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

const Types = ({ typeCounts }) => {
  const labels = Object.keys(typeCounts).map(
    (type) => type.charAt(0).toUpperCase() + type.slice(1)
  ); // Extract types as labels
  const data = Object.values(typeCounts); // Extract counts as data

  // Chart.js data
  const chartData = {
    labels,
    datasets: [
      {
        label: "Número de pedidos según tipo",
        data,
        backgroundColor: [
          "#FF6384", // Red
          "#36A2EB", // Blue
          "#FFCE56", // Yellow
          "#4CAF50", // Green
          "#9C27B0", // Purple
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
    maintainAspectRatio: false, // Allows custom height/width
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
          text: "Tipos de Comida",
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
    <div className="w-full max-w-4xl mx-auto p-2 md:p-6">
      <div className="bg-white shadow-md rounded-lg p-2 md:p-6 border border-gray-200">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          📊 Pedidos por Tipo de Comida
        </h2>

        {/* Chart Container */}
        <div className="h-[350px]">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Types;
