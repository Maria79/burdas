"use client";

import { useBasket } from "@/context/BasketContext";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

const AddAmountCounter = ({ _id, dish }) => {
  const { counts, addToBasket, decrementFromBasket } = useBasket();
  const count = counts[_id] || 0; // Get count from context

  const handleIncrement = () => {
    addToBasket({
      _id,
      name: dish.name,
      type: dish.type,
      price: dish.price,
      count: 1,
    });
  };

  const handleDecrement = () => {
    if (count > 0) {
      decrementFromBasket(_id);
    }
  };

  return (
    <div className="self-end w-[85px] border border-gray-300 rounded-full flex justify-between items-center space-x-2">
      <FaMinusCircle
        onClick={handleDecrement}
        className="cursor-pointer"
        size={20}
      />
      <span>{count}</span>
      <FaPlusCircle
        onClick={handleIncrement}
        className="cursor-pointer"
        size={20}
      />
    </div>
  );
};

export default AddAmountCounter;
