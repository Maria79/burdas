"use client";

import { useState, useEffect } from "react";
import FinishedOrderCard from "./FinishedOrderCard";

const FinishedOrdersCards = ({ initialOrders }) => {
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);

  // Fetch the latest orders from the server
  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setFilteredOrders(data.filter((order) => order.status.readyToPick)); // Only include orders where `readyToPick` is true
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Poll the server every  ...
  useEffect(() => {
    // Function to check if the current time is between 18:00 and 00:00
    const isWithinPollingHours = () => {
      const now = new Date();
      const currentHour = now.getHours();
      return currentHour >= 18 && currentHour < 24; // Between 18:00 and 00:00
    };

    const interval = setInterval(() => {
      if (isWithinPollingHours()) {
        fetchOrders(); // Fetch orders only if within polling hours
      }
    }, 5000); // seconds

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, []);

  const removeOrder = (orderId) => {
    setFilteredOrders((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId)
    );
  };

  const now = new Date();
  const latestOrders = filteredOrders.filter((order) => {
    const updatedAt = new Date(order.updatedAt);
    const diffInMinutes = (now - updatedAt) / (1000 * 60);
    return diffInMinutes <= 10;
  });
  const ordersBetween8And15Minutes = filteredOrders.filter((order) => {
    const updatedAt = new Date(order.updatedAt);
    const diffInMinutes = (now - updatedAt) / (1000 * 60);
    return diffInMinutes > 8 && diffInMinutes <= 15;
  });
  const ordersBetween15And30Minutes = filteredOrders.filter((order) => {
    const updatedAt = new Date(order.updatedAt);
    const diffInMinutes = (now - updatedAt) / (1000 * 60);
    return diffInMinutes > 15 && diffInMinutes <= 30;
  });
  const getBackgroundColor = (order) => {
    if (latestOrders.includes(order)) return "bg-green-100";
    if (ordersBetween8And15Minutes.includes(order)) return "bg-yellow-100";
    if (ordersBetween15And30Minutes.includes(order)) return "bg-red-100";
    return "bg-gray-100";
  };

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredOrders.map((order) => (
          <FinishedOrderCard
            key={order._id}
            order={order}
            backgroundColor={getBackgroundColor(order)}
            removeOrder={removeOrder}
            username={order.userId?.username || "Anonymous"}
          />
        ))}
      </div>
    </div>
  );
};

export default FinishedOrdersCards;
