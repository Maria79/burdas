"use client";

import { useState, useEffect } from "react";
import OrderCard from "./OrderCard";

const OrdersCards = ({ initialOrders }) => {
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(false);

  // Fetch the latest orders from the server
  const fetchOrders = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  // Fetch orders on mount and poll during specified hours
  useEffect(() => {
    const isWithinPollingHours = () => {
      const now = new Date();
      const currentHour = now.getHours();
      return currentHour >= 18 && currentHour < 24; // Between 18:00 and 00:00
    };

    // Fetch orders initially
    fetchOrders();

    // Poll the server every 5 seconds during the specified hours
    const interval = setInterval(() => {
      if (isWithinPollingHours()) {
        fetchOrders();
      }
    }, 5000);

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
    <div className="py-8">
      {loading && (
        <div className="flex justify-center items-center my-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2">
        {!loading &&
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              backgroundColor={getBackgroundColor(order)}
              removeOrder={removeOrder}
              username={order.userId?.username || "Anonymous"}
            />
          ))}
      </div>
      {!loading && filteredOrders.length === 0 && (
        <div className="text-center mt-4">
          <p className="text-gray-500">No orders found.</p>
        </div>
      )}
    </div>
  );
};

export default OrdersCards;
