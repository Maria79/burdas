"use client";

import { useEffect, useState } from "react";
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

const Recommendations = ({ orders }) => {
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [recommendedCombos, setRecommendedCombos] = useState([]);

  useEffect(() => {
    if (orders.length === 0) return;

    const itemSales = {};
    const comboSales = {};

    // Count occurrences of each item and find frequent combos
    orders.forEach((order) => {
      const items = order.basket.map((item) => ({
        name: item.name,
        type: item.type,
      }));

      // Count individual item sales
      items.forEach(({ name, type }) => {
        const key = `${name} (${type})`;
        itemSales[key] = (itemSales[key] || 0) + 1;
      });

      // Identify combo sales (items bought together)
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const combo = [
            `${items[i].name} (${items[i].type})`,
            `${items[j].name} (${items[j].type})`,
          ]
            .sort()
            .join(" & ");
          comboSales[combo] = (comboSales[combo] || 0) + 1;
        }
      }
    });

    // Sort and get top-selling items
    const sortedItems = Object.entries(itemSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) // Top 5 items
      .map(([name, count]) => ({ name, count }));

    // Sort and get best-selling combos
    const sortedCombos = Object.entries(comboSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3) // Top 3 combos
      .map(([combo, count]) => ({ combo, count }));

    setTopSellingItems(sortedItems);
    setRecommendedCombos(sortedCombos);
  }, [orders]);

  // Capitalize labels
  const capitalizeLabel = (label) =>
    label.replace(/\b\w/g, (char) => char.toUpperCase());

  const chartData = {
    labels: topSellingItems.map((item) => capitalizeLabel(item.name)),
    datasets: [
      {
        label: "Ventas",
        data: topSellingItems.map((item) => item.count),
        backgroundColor: [
          "#4CAF50", // Green
          "#FF9800", // Orange
          "#F44336", // Red
          "#2196F3", // Blue
          "#9C27B0", // Purple
        ],
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#555", font: { weight: "bold" } },
      },
      y: {
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
          📊 Recomendaciones de Ventas
        </h2>

        {/* Sales Chart */}
        <div className="h-64 mt-6">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Top Selling Items */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            📌 Productos Populares
          </h3>
          <ul className="mt-2 space-y-1">
            {topSellingItems.map((item) => (
              <li
                key={item.name}
                className="flex justify-between text-gray-600"
              >
                <span>{capitalizeLabel(item.name)}</span>
                <span className="font-medium">{item.count} vendidos</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Combos */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            🍽️ Combos Más Vendidos
          </h3>
          <ul className="mt-2 space-y-1">
            {recommendedCombos.length > 0 ? (
              recommendedCombos.map((combo) => (
                <li
                  key={combo.combo}
                  className="flex justify-between text-gray-600"
                >
                  <span>{capitalizeLabel(combo.combo)}</span>
                  <span className="font-medium">{combo.count} veces</span>
                </li>
              ))
            ) : (
              <li className="text-gray-400 italic">
                No hay combos recomendados aún.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
