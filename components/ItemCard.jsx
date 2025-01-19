"use client";

import Image from "next/image";
import itemImage from "@/assets/images/items/enrollado.jpg";
import AddAmountCounter from "./AddAmountCounter";
import { useSession } from "next-auth/react";

const ItemCard = ({ dish, count, setCount }) => {
  const { data: session } = useSession();
  return (
    <div className="border border-gray-300 w-full p-4 rounded-lg shadow-md bg-white">
      <div className="flex items-center">
        {/* Image Section */}
        <Image
          src={itemImage}
          alt={dish.name}
          sizes="50vw"
          className="rounded-md object-cover"
          style={{
            width: "25%",
            height: "auto",
          }}
        />

        {/* Content Section */}
        <div className="ml-4 flex-1">
          {/* Dish Name */}
          <h3 className="text-lg font-bold mb-4 capitalize text-gray-800">
            {dish.name}
          </h3>

          {/* Price and Counter */}
          <div className="flex justify-between items-center">
            <p className="text-sm sm:text-base text-gray-600">
              <span className="font-semibold">Precio:</span> {dish.price}€
            </p>
            {/* Counter Section */}
            {session && (
              <AddAmountCounter
                _id={dish._id}
                count={count}
                setCount={setCount}
                dish={dish}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
