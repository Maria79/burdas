"use client";

import { useEffect, useState } from "react";

const TimeCounter = ({ createdAt }) => {
  const [timeSinceCreated, setTimeSinceCreated] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const createdTime = new Date(createdAt);

      const diffInSeconds = Math.max(0, Math.floor((now - createdTime) / 1000));

      const hours = Math.floor(diffInSeconds / 3600); // Calculate hours
      const minutes = Math.floor((diffInSeconds % 3600) / 60); // Remaining minutes
      const seconds = diffInSeconds % 60; // Remaining seconds

      setTimeSinceCreated(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [createdAt]);

  return <p>Recivido hace: {timeSinceCreated}</p>;
};

export default TimeCounter;
