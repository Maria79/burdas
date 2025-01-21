"use client";

import { useState, useEffect } from "react";
import OrderCard from "./OrderCard";

const OrdersCards = ({ initialOrders }) => {
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);

  // Fetch the latest orders from the server
  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setFilteredOrders(
          data.filter(
            (order) => order.status.received && !order.status.inProgress
          )
        );
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
    const createdAt = new Date(order.createdAt);
    const diffInMinutes = (now - createdAt) / (1000 * 60);
    return diffInMinutes <= 10;
  });
  const ordersBetween10And20Minutes = filteredOrders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    const diffInMinutes = (now - createdAt) / (1000 * 60);
    return diffInMinutes > 10 && diffInMinutes <= 20;
  });
  const ordersBetween20And30Minutes = filteredOrders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    const diffInMinutes = (now - createdAt) / (1000 * 60);
    return diffInMinutes > 20 && diffInMinutes <= 30;
  });
  const getBackgroundColor = (order) => {
    if (latestOrders.includes(order)) return "bg-green-100";
    if (ordersBetween10And20Minutes.includes(order)) return "bg-yellow-100";
    if (ordersBetween20And30Minutes.includes(order)) return "bg-red-100";
    return "bg-gray-100";
  };

  return (
    <div className="py-8 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filteredOrders.map((order) => (
          <OrderCard
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

export default OrdersCards;
