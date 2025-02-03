"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";

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
  const { data: session } = useSession();

  // Helper: get storage key for current user
  const getStorageKey = () => {
    const userId = session?.user?.id || "guest";
    return `basket-${userId}`;
  };

  // Rehydrate basket from localStorage for the current user
  useEffect(() => {
    const userId = session?.user?.id || "guest";
    const savedBasket = localStorage.getItem(`basket-${userId}`);
    if (savedBasket) setBasket(JSON.parse(savedBasket));
  }, [session]);

  // Sync basket to localStorage
  useEffect(() => {
    const userId = session?.user?.id || "guest";
    localStorage.setItem(`basket-${userId}`, JSON.stringify(basket));
  }, [basket, session]);

  /**
   * Always add a new basket item.
   * Each call generates a unique `basketItemId` so that even items with the same dish are independent.
   */
  const addToBasket = (item, extras = []) => {
    if (!item || !item._id) return;
    const basketItem = {
      ...item,
      basketItemId: uuidv4(), // Unique identifier for this entry
      extras,
      count: item.count || 1,
    };
    setBasket((prevBasket) => [...prevBasket, basketItem]);
  };

  /**
   * Update extras for a given basket item using its unique basketItemId.
   * The function recalculates the updated price based on selected extras.
   */
  const addExtrasToItem = (basketItemId, selectedExtras) => {
    setBasket((prevBasket) =>
      prevBasket.map((item) => {
        if (item.basketItemId === basketItemId) {
          const extrasPrice = selectedExtras.reduce((sum, extraName) => {
            const extra = extrasList.find((e) => e.name === extraName);
            return sum + (extra ? extra.price : 0);
          }, 0);
          const updatedPrice = (
            Number(item.price.replace(",", ".")) + extrasPrice
          ).toFixed(2);
          return { ...item, extras: selectedExtras, updatedPrice };
        }
        return item;
      })
    );
  };

  /**
   * Remove a basket item by its unique basketItemId.
   */
  const removeFromBasket = (basketItemId) => {
    if (!basketItemId) return;
    setBasket((prevBasket) =>
      prevBasket.filter((item) => item.basketItemId !== basketItemId)
    );
  };

  /**
   * Decrement the count of a specific basket item by its basketItemId.
   * If count becomes 0, the item is removed.
   */
  const decrementFromBasket = (basketItemId) => {
    if (!basketItemId) return;
    setBasket((prevBasket) => {
      const indexToDecrement = prevBasket.findIndex(
        (item) => item.basketItemId === basketItemId
      );
      if (indexToDecrement !== -1) {
        const updatedBasket = [...prevBasket];
        const item = updatedBasket[indexToDecrement];
        if (item.count > 1) {
          updatedBasket[indexToDecrement] = { ...item, count: item.count - 1 };
        } else {
          updatedBasket.splice(indexToDecrement, 1);
        }
        return updatedBasket;
      }
      return prevBasket;
    });
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const getTotalCount = () => basket.length;

  const getTotalPrice = () =>
    basket.reduce((total, item) => {
      const extrasPrice = (item.extras || []).reduce((sum, extraName) => {
        const extra = extrasList.find((e) => e.name === extraName);
        return sum + (extra ? extra.price : 0);
      }, 0);
      const priceNumber = Number(item.price.replace(",", ".")) + extrasPrice;
      return total + item.count * priceNumber;
    }, 0);

  return (
    <BasketContext.Provider
      value={{
        basket,
        addToBasket,
        removeFromBasket,
        decrementFromBasket,
        clearBasket,
        getTotalCount,
        getTotalPrice,
        addExtrasToItem,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => useContext(BasketContext);
