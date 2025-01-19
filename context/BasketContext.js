"use client";

import { createContext, useContext, useEffect, useState } from "react";

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);
  const [counts, setCounts] = useState({});

  // Helper function to sync with localStorage
  const syncLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Rehydrate basket and counts from localStorage
  useEffect(() => {
    const savedBasket = localStorage.getItem("basket");
    const savedCounts = localStorage.getItem("counts");
    if (savedBasket) setBasket(JSON.parse(savedBasket));
    if (savedCounts) setCounts(JSON.parse(savedCounts));
  }, []);

  // Sync basket and counts to localStorage
  useEffect(() => {
    syncLocalStorage("basket", basket);
    syncLocalStorage("counts", counts);
  }, [basket, counts]);

  // Add or update item in the basket
  const addToBasket = (item) => {
    if (!item || !item._id) return;

    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((i) => i._id === item._id);
      if (existingItem) {
        return prevBasket.map((i) =>
          i._id === item._id ? { ...i, count: i.count + item.count } : i
        );
      }
      return [...prevBasket, item];
    });

    setCounts((prevCounts) => ({
      ...prevCounts,
      [item._id]: (prevCounts[item._id] || 0) + item.count,
    }));
  };

  const removeFromBasket = (_id) => {
    if (!_id) return;

    setBasket((prevBasket) => prevBasket.filter((item) => item._id !== _id));

    setCounts((prevCounts) => {
      const updatedCounts = { ...prevCounts };
      delete updatedCounts[_id];
      return updatedCounts;
    });
  };

  // Decrement item count in the basket
  const decrementFromBasket = (_id) => {
    if (!_id) return;

    setBasket((prevBasket) =>
      prevBasket
        .map((item) =>
          item._id === _id ? { ...item, count: item.count - 1 } : item
        )
        .filter((item) => item.count > 0)
    );

    setCounts((prevCounts) => {
      const updatedCounts = { ...prevCounts };
      if (updatedCounts[_id]) updatedCounts[_id] -= 1;
      if (updatedCounts[_id] <= 0) delete updatedCounts[_id];
      return updatedCounts;
    });
  };

  // Clear the basket and reset counts
  const clearBasket = () => {
    setBasket([]);
    setCounts({});
  };

  // Get total count of items in the basket
  const getTotalCount = () =>
    basket.reduce((total, item) => total + item.count, 0);

  // Get total price of items in the basket
  const getTotalPrice = () =>
    basket.reduce((total, item) => {
      const itemTotal = item.count * Number(item.price?.replace(",", ".") || 0);
      return total + itemTotal;
    }, 0);

  return (
    <BasketContext.Provider
      value={{
        basket,
        counts,
        addToBasket,
        removeFromBasket,
        decrementFromBasket,
        clearBasket,
        getTotalCount,
        getTotalPrice,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

// Hook to use the BasketContext
export const useBasket = () => useContext(BasketContext);
