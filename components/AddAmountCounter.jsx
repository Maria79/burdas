"use client";

import { useBasket } from "@/context/BasketContext";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

const AddAmountCounter = ({ _id, dish }) => {
  const { basket, addToBasket, decrementFromBasket } = useBasket();
  // Calculate count for this dish by filtering basket items that match dish._id
  const count = basket.filter((item) => item._id === _id).length;

  const handleIncrement = () => {
    // Each click creates a new independent basket entry
    addToBasket({
      _id,
      name: dish.name,
      type: dish.type,
      price: dish.price,
      count: 1,
    });
  };

  const handleDecrement = () => {
    // Remove one occurrence (the first one found) of this dish from the basket
    const basketItem = basket.find((item) => item._id === _id);
    if (basketItem) {
      decrementFromBasket(basketItem.basketItemId);
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
