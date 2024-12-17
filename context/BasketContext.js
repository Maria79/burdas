"use client";

import { createContext, useContext, useEffect, useState } from "react";

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);
  const [counts, setCounts] = useState({}); // Track counts globally

  // Rehydrate basket and counts from localStorage when the app loads
  useEffect(() => {
    const savedBasket = localStorage.getItem("basket");
    const savedCounts = localStorage.getItem("counts");
    if (savedBasket) setBasket(JSON.parse(savedBasket));
    if (savedCounts) setCounts(JSON.parse(savedCounts));
  }, []);

  // Save basket and counts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(basket));
    localStorage.setItem("counts", JSON.stringify(counts));
  }, [basket, counts]);

  // Add or update item count in the basket and global counts
  const addToBasket = (item) => {
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

  // Decrement item count in basket and global counts
  const decrementFromBasket = (_id) => {
    setBasket((prevBasket) =>
      prevBasket
        .map((item) =>
          item._id === _id ? { ...item, count: item.count - 1 } : item
        )
        .filter((item) => item.count > 0)
    );

    setCounts((prevCounts) => {
      const updatedCounts = { ...prevCounts };
      if (updatedCounts[_id] > 0) updatedCounts[_id] -= 1;
      if (updatedCounts[_id] === 0) delete updatedCounts[_id];
      return updatedCounts;
    });
  };

  // Clear basket and counts
  const clearBasket = () => {
    setBasket([]);
    setCounts({}); // Reset all counts to 0
  };

  return (
    <BasketContext.Provider
      value={{
        basket,
        counts,
        addToBasket,
        decrementFromBasket,
        clearBasket,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => useContext(BasketContext);
