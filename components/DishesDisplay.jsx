"use client";

import { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import { useBasket } from "@/context/BasketContext";

const DishesDisplay = ({ dishes, typeParams }) => {
  const [counts, setCounts] = useState({});
  const { updateBasket } = useBasket();

  // Compute a unique key for localStorage based on the menu type
  const localStorageKey = `counts-${typeParams}`;

  // Load saved counts from localStorage only once on initial render
  useEffect(() => {
    const savedCounts = localStorage.getItem(localStorageKey);
    if (savedCounts) {
      try {
        const parsedCounts = JSON.parse(savedCounts);
        setCounts((prevCounts) => {
          // Only update state if the loaded value is different
          if (JSON.stringify(prevCounts) !== JSON.stringify(parsedCounts)) {
            return parsedCounts;
          }
          return prevCounts; // Avoid unnecessary state updates
        });
      } catch (error) {
        console.error("Failed to parse counts from localStorage:", error);
      }
    }
  }, [localStorageKey]); // This dependency ensures the effect runs only when the menu type changes

  // Save counts to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(counts).length > 0) {
      localStorage.setItem(localStorageKey, JSON.stringify(counts));
    }
  }, [counts, localStorageKey]); // Save changes only when counts or menu type changes

  return (
    <div className="px-0 sm:px-6 py-8">
      <div className="text-center sm:pt-16 mb-6 lg:mb-10">
        <h1 className="text-6xl font-semibold">Menu</h1>
      </div>
      <section className="px-4 mb-6">
        <h2 className="text-3xl font-semibold mb-4 capitalize">
          {typeParams.split("-").join(" ")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 xl:gap-4 py-6">
          {dishes.map((dish) => (
            <ItemCard
              key={dish._id}
              dish={dish}
              count={counts[dish._id] || 0} // Pass specific count
              setCount={(newCount) =>
                setCounts((prev) => ({
                  ...prev,
                  [dish._id]: newCount, // Update only the count for the specific id
                }))
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DishesDisplay;
