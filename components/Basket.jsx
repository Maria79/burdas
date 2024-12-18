"use client";

import { useBasket } from "@/context/BasketContext";
import { useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Basket = () => {
  const [openBasket, setOpenBasket] = useState(false);
  const { basket, clearBasket } = useBasket();
  const router = useRouter();

  const toggleBasket = () => setOpenBasket((prev) => !prev);

  const handleAction = (action) => {
    if (action === "cancel") clearBasket();
    if (action === "pay") router.push("/pagar");
    setOpenBasket(false);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);

  const totalAmount = basket.reduce((total, item) => {
    const itemTotal = item.count * Number(item.price?.replace(",", ".") || 0);
    return total + itemTotal;
  }, 0);

  return (
    <>
      <div className="relative">
        <FaShoppingBasket
          onClick={toggleBasket}
          size={28}
          className="cursor-pointer"
        />
      </div>
      {openBasket && basket.length > 0 && (
        <div className="absolute w-[360px] -right-[14px] top-[40px] px-2 py-4 rounded-md bg-white  text-black border border-[#760e0d]">
          <h2 className="text-xl font-semibold mb-4">Tu pedido:</h2>
          {basket.map(({ _id, type, name, count, price }) => (
            <div key={_id} className="px-2 mb-2 flex justify-between">
              <p className="w-full text-sm truncate">
                - <span className="capitalize">{type}</span> _{" "}
                <span className="font-semibold capitalize">{name}</span>
                {count > 1 && ` x ${count}`}
              </p>
              <div className="text-sm">
                {formatPrice(count * Number(price?.replace(",", ".") || 0))}
              </div>
            </div>
          ))}
          <hr />
          <div className="px-2 mt-4 text-right font-semibold">
            Total: {formatPrice(totalAmount)}
          </div>
          <div className="flex justify-end space-x-4 pt-8">
            <button
              onClick={() => handleAction("cancel")}
              className="bg-[#c9c8c7] text-sm px-8 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAction("pay")}
              className="bg-[#93e0a4] text-sm px-8 py-2 rounded-md"
            >
              Pagar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Basket;
