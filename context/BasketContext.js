"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  // Helper function to get the storage key for the current user
  const getStorageKey = () => {
    const userId = session?.user?.id || "guest";
    return `basket-${userId}`;
  };

  // // Helper function to sync with localStorage
  // const syncLocalStorage = (key, value) => {
  //   localStorage.setItem(key, JSON.stringify(value));
  // };

  // Rehydrate basket and counts from localStorage for the current user
  useEffect(() => {
    const userId = session?.user?.id || "guest";
    const savedBasket = localStorage.getItem(`basket-${userId}`);
    const savedCounts = localStorage.getItem(`basket-${userId}-counts`);

    if (savedBasket) setBasket(JSON.parse(savedBasket));
    if (savedCounts) setCounts(JSON.parse(savedCounts));
  }, [session]);

  useEffect(() => {
    const userId = session?.user?.id || "guest";
    localStorage.setItem(`basket-${userId}`, JSON.stringify(basket));
    localStorage.setItem(`basket-${userId}-counts`, JSON.stringify(counts));
  }, [basket, counts, session]);

  // Add or update item in the basket with extras
  // const addToBasket = (item, extras = []) => {
  //   if (!item || !item._id) return;

  //   setBasket((prevBasket) => {
  //     const existingItemIndex = prevBasket.findIndex((i) => i._id === item._id);

  //     if (existingItemIndex !== -1) {
  //       // Update existing item by adding extras
  //       const updatedBasket = [...prevBasket];
  //       const existingItem = updatedBasket[existingItemIndex];
  //       updatedBasket[existingItemIndex] = {
  //         ...existingItem,
  //         count: existingItem.count + item.count,
  //         extras: mergeExtras(existingItem.extras, extras),
  //       };
  //       return updatedBasket;
  //     }

  //     // Add new item with extras
  //     return [...prevBasket, { ...item, extras }];
  //   });

  //   setCounts((prevCounts) => ({
  //     ...prevCounts,
  //     [item._id]: (prevCounts[item._id] || 0) + item.count,
  //   }));
  // };

  const addToBasket = (item, extras = []) => {
    if (!item || !item._id) return;

    setBasket((prevBasket) => [
      ...prevBasket,
      { ...item, extras, count: item.count || 1 }, // Add a new item
    ]);

    // Update counts for tracking purposes
    setCounts((prevCounts) => ({
      ...prevCounts,
      [item._id]: (prevCounts[item._id] || 0) + (item.count || 1),
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
    setBasket((prevBasket) => {
      // Find the first item matching the given itemId
      const itemIndex = prevBasket.findIndex((item) => item._id === itemId);

      if (itemIndex !== -1) {
        // Copy the current basket
        const updatedBasket = [...prevBasket];
        const item = updatedBasket[itemIndex];

        // Calculate the total price of the selected extras
        const extrasPrice = selectedExtras.reduce((sum, extraName) => {
          const extra = extrasList.find((e) => e.name === extraName);
          return sum + (extra ? extra.price : 0);
        }, 0);

        // Update the item's extras and price
        const updatedItem = {
          ...item,
          extras: selectedExtras,
          updatedPrice: (
            Number(item.price.replace(",", ".")) + extrasPrice
          ).toFixed(2),
        };

        // Replace the specific item in the basket
        updatedBasket[itemIndex] = updatedItem;

        return updatedBasket;
      }

      return prevBasket; // Return the basket unchanged if itemId is not found
    });
  };

  const removeFromBasket = (_id) => {
    if (!_id) return;

    setBasket((prevBasket) => {
      const indexToRemove = prevBasket.findIndex((item) => item._id === _id);
      if (indexToRemove !== -1) {
        return prevBasket.filter((_, index) => index !== indexToRemove);
      }
      return prevBasket;
    });

    setCounts((prevCounts) => {
      const updatedCounts = { ...prevCounts };
      if (updatedCounts[_id]) {
        updatedCounts[_id] -= 1;
        if (updatedCounts[_id] <= 0) delete updatedCounts[_id];
      }
      return updatedCounts;
    });
  };

  // Decrement item count in the basket
  const decrementFromBasket = (_id) => {
    if (!_id) return;

    setBasket((prevBasket) => {
      const indexToDecrement = prevBasket.findIndex((item) => item._id === _id);

      if (indexToDecrement !== -1) {
        const updatedBasket = [...prevBasket];
        const item = updatedBasket[indexToDecrement];

        // Decrease count
        if (item.count > 1) {
          updatedBasket[indexToDecrement] = { ...item, count: item.count - 1 };
        } else {
          // Remove item entirely if count is 1
          updatedBasket.splice(indexToDecrement, 1);
        }

        return updatedBasket;
      }
      return prevBasket;
    });

    setCounts((prevCounts) => {
      const updatedCounts = { ...prevCounts };
      if (updatedCounts[_id]) {
        updatedCounts[_id] -= 1;
        if (updatedCounts[_id] <= 0) delete updatedCounts[_id];
      }
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
