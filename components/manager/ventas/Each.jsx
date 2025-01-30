"use client";

import { useState } from "react";
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

const Each = ({ groupedItems }) => {
  const [selectedType, setSelectedType] = useState(null);

  // Get all types (keys from groupedItems)
  const types = Object.keys(groupedItems);

  // Get data for selected type
  const selectedData = selectedType ? groupedItems[selectedType] : [];

  // Capitalize labels
  const capitalizeLabel = (label) =>
    label.replace(/\b\w/g, (char) => char.toUpperCase());

  // Extract labels and counts
  const labels = selectedData.map((item) => capitalizeLabel(item.name));
  const data = selectedData.map((item) => item.count);

  // Chart.js data
  const chartData = {
    labels,
    datasets: [
      {
        label: `Número de Pedidos (${
          selectedType ? capitalizeLabel(selectedType) : "Selecciona un tipo"
        })`,
        data,
        backgroundColor: "#574964",
        borderColor: "#9C27B0",
        borderWidth: 1,
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
          text: "Nombre",
        },
        ticks: { color: "#555", font: { weight: "bold" } },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Número de pedidos",
        },
        ticks: { color: "#555", font: { weight: "bold" } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto  p-2 md:p-6">
      <div className="bg-white shadow-md rounded-lg  p-2 md:p-6 border border-gray-200">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          📊 Pedidos por Tipo
        </h2>

        {/* Type Selector Buttons */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 text-xs md:text-sm font-medium rounded-md transition-all duration-300 ease-in-out shadow-sm 
                ${
                  selectedType === type
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                } 
                active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-indigo-500`}
            >
              {capitalizeLabel(type)}
            </button>
          ))}
        </div>

        {/* Chart Display */}
        {selectedType && (
          <div className="h-64 mt-6 bg-white shadow-md rounded-lg p-6">
            <Bar data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Each;
