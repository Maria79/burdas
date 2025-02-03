"use client";

import Image from "next/image";
import itemImage from "@/assets/images/items/enrollado.jpg";
import AddAmountCounter from "./AddAmountCounter";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const ItemCard = ({ dish }) => {
  const { data: session } = useSession();
  const [openDesript, setOpenDesript] = useState(false);
  const cardRef = useRef(null);

  // Toggle description when the container is clicked.
  // If it's already open, it will close.
  const handleToggleDescription = () => {
    setOpenDesript((prev) => !prev);
  };

  // Close the description if clicking outside of this card
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setOpenDesript(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={cardRef}
      className="border border-gray-300 w-full p-4 rounded-lg shadow-md bg-white"
    >
      <div className="relative flex items-center">
        {/* Image Section */}
        <Image
          src={itemImage}
          alt={dish.name}
          sizes="50vw"
          className="rounded-md object-cover"
          style={{ width: "25%", height: "auto" }}
        />

        {/* Content Section */}
        <div className="ml-4 flex-1">
          <div className="cursor-pointer" onClick={handleToggleDescription}>
            <h3 className="text-lg font-bold mb-4 capitalize text-gray-800">
              {dish.name}
            </h3>
          </div>
          {/* Description Section */}
          {openDesript && (
            <div className="absolute border border-gray-300 rounded-lg shadow-md bg-white p-4 z-10">
              <div className="text-sm sm:text-base text-gray-600">
                <p className="first-letter:capitalize">{dish.description}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="text-sm sm:text-base text-gray-600">
              <span className="font-semibold">Precio:</span> {dish.price}€
            </p>
            {session && <AddAmountCounter _id={dish._id} dish={dish} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
