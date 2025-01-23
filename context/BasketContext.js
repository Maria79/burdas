"use client";

import { createContext, useContext, useEffect, useState } from "react";

const extrasList = [
  { name: "Queso Asado", price: 2.0 },
  { name: "Queso Cheddar", price: 1.2 },
  { name: "Aguacate", price: 1.5 },
  { name: "Plátano Frito", price: 1.5 },
  { name: "Bacón", price: 1.2 },
  { name: "Pollo Crispy", price: 2.0 },
  { name: "Ensalada de Col Dulce", price: 1.6 },
  { name: "Postres", price: 1.6 },
];

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

  // Add or update item in the basket with extras
  const addToBasket = (item, extras = []) => {
    if (!item || !item._id) return;

    setBasket((prevBasket) => {
      const existingItemIndex = prevBasket.findIndex((i) => i._id === item._id);

      if (existingItemIndex !== -1) {
        // Update existing item by adding extras
        const updatedBasket = [...prevBasket];
        const existingItem = updatedBasket[existingItemIndex];
        updatedBasket[existingItemIndex] = {
          ...existingItem,
          count: existingItem.count + item.count,
          extras: mergeExtras(existingItem.extras, extras),
        };
        return updatedBasket;
      }

      // Add new item with extras
      return [...prevBasket, { ...item, extras }];
    });

    setCounts((prevCounts) => ({
      ...prevCounts,
      [item._id]: (prevCounts[item._id] || 0) + item.count,
    }));
  };

  const mergeExtras = (existingExtras = [], newExtras = []) => {
    const extrasMap = new Map();
    [...existingExtras, ...newExtras].forEach((extra) => {
      if (extrasMap.has(extra.name)) {
        extrasMap.set(extra.name, {
          name: extra.name,
          price: extra.price,
        });
      } else {
        extrasMap.set(extra.name, extra);
      }
    });
    return Array.from(extrasMap.values());
  };

  const addExtrasToItem = (itemId, selectedExtras) => {
    setBasket((prevBasket) =>
      prevBasket.map((item) => {
        if (item._id === itemId) {
          const extrasPrice = selectedExtras.reduce((sum, extraName) => {
            const extra = extrasList.find((e) => e.name === extraName);
            return sum + (extra ? extra.price : 0);
          }, 0);

          const updatedPrice = (
            Number(item.price.replace(",", ".")) + extrasPrice
          ).toFixed(2);

          return {
            ...item,
            extras: selectedExtras,
            updatedPrice, // Save the updated price
          };
        }
        return item;
      })
    );
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
      const itemExtrasPrice = (item.extras || []).reduce(
        (sum, extra) => sum + extra.price,
        0
      );
      const itemTotal =
        item.count *
        (Number(item.price?.replace(",", ".") || 0) + itemExtrasPrice);
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
        addExtrasToItem, // Added function
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

// Hook to use the BasketContext
export const useBasket = () => useContext(BasketContext);
