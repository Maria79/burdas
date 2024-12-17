"use client";

import Image from "next/image";
import itemImage from "@/assets/images/items/enrollado.jpg";
import AddAmountCounter from "./AddAmountCounter";
import { useSession } from "next-auth/react";

const ItemCard = ({ dish, count, setCount }) => {
  const { data: session } = useSession();
  return (
    <div className="border border-gray-300 w-full p-2 rounded-md shadow-md">
      <div className="flex">
        <Image
          src={itemImage}
          alt={dish.name}
          sizes="50vw"
          style={{
            width: "25%",
            height: "auto",
          }}
        />
        <div className="px-4 w-full">
          <div className="text-lg font-semibold mb-6 sm:mb-8">
            <h3 className="capitalize first-letter:capitalize">{dish.name}</h3>
          </div>
          <div className="flex flex-col sm:flex-row justify-between">
            <p className="mb-2 sm:mb-0">
              <span className="font-semibold">Precio: </span>
              {dish.price}€
            </p>
            {/* Pass the unique id to AddAmountCounter */}
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
