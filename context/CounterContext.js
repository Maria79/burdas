"use client";

import { createContext, useContext, useState } from "react";

const CounterContext = createContext();

export const CounterProvider = ({ children }) => {
  const [counts, setCounts] = useState({}); // Keeps track of counts per id

  // Update count for a specific id
  const updateCount = (id, newCount) => {
    setCounts((prev) => ({
      ...prev,
      [id]: newCount, // Only update the specific id
    }));
  };

  return (
    <CounterContext.Provider value={{ counts, updateCount }}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = () => useContext(CounterContext);
