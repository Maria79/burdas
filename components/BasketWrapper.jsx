"use client";

import { useBasket } from "@/context/BasketContext";

const BasketWrapper = ({ userOrders }) => {
  const { addToBasket } = useBasket();

  const groupOrdersByBasket = (orders) => {
    const groups = {};

    orders.forEach((order) => {
      const basketKey = JSON.stringify(
        order.basket.map((item) => ({
          name: item.name,
          type: item.type,
          count: item.count,
          price: item.price,
        }))
      );

      if (!groups[basketKey]) {
        groups[basketKey] = [];
      }

      groups[basketKey].push(order);
    });

    return Object.values(groups).sort((a, b) => {
      const latestA = new Date(a[a.length - 1].createdAt);
      const latestB = new Date(b[b.length - 1].createdAt);
      return latestB - latestA;
    });
  };

  const groupedOrders = groupOrdersByBasket(userOrders);

  const handleAddToBasket = (basket) => {
    basket.forEach((item) => {
      addToBasket(item);
    });
  };

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Your Grouped Order History
      </h1>
      <div className="space-y-6">
        {groupedOrders.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="border border-gray-300 px-4 py-6 rounded-md shadow-md bg-white"
          >
            <div>
              <h2 className="font-semibold text-lg mb-2">Order Group:</h2>
              <div className="space-y-4">
                {group[0].basket.map((item, index) => (
                  <div key={index} className="px-3 rounded-md shadow-sm">
                    <div className="capitalize font-medium text-gray-700">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="capitalize">{item.type}</span> x{" "}
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold">
                Total Price: <span>€{group[0].totalPrice}</span>
              </p>
            </div>
            <div className="text-right mt-4">
              <button
                onClick={() => handleAddToBasket(group[0].basket)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md font-medium shadow-md hover:bg-blue-700 transition-all"
              >
                Volver a pedir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasketWrapper;
