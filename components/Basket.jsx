"use client";

import { useBasket } from "@/context/BasketContext";
import { useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Basket = () => {
  const [openBasket, setOpenBasket] = useState(false);
  const { basket, clearBasket } = useBasket();
  const router = useRouter();

  const handleBasket = () => {
    setOpenBasket(!openBasket);
  };

  const handleCancel = () => {
    clearBasket(); // Clear basket and reset counts
    setOpenBasket(false);
  };

  const handlePay = () => {
    setOpenBasket(false);
    router.push("/pagar");
  };

  return (
    <div>
      <div className="relative">
        <FaShoppingBasket
          onClick={handleBasket}
          size={24}
          className="cursor-pointer"
        />
        {openBasket && basket.length > 0 && (
          <div className="absolute w-[360px] bg-white -right-10 top-16 rounded-md text-black border border-[#760e0d] px-2 py-4">
            <h2 className="text-xl font-semibold mb-4">Tu pedido:</h2>
            {basket.map((item) => (
              <div key={item._id} className="px-2 mb-2">
                <div className="flex">
                  <p className="w-full text-nowrap text-sm">
                    - <span className="capitalize">{item.type}</span> _{" "}
                    <span className="font-semibold capitalize truncate inline-flex max-w-[170px]">
                      {item.name}
                    </span>{" "}
                    <span>{`${item.count > 1 ? `x ${item.count}` : ""}`}</span>
                  </p>
                  <div className="text-sm">
                    {item.count && item.price
                      ? new Intl.NumberFormat("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        }).format(
                          item.count * Number(item.price.replace(",", "."))
                        )
                      : "€0.00"}
                  </div>
                </div>
              </div>
            ))}
            <hr />
            <div className="px-2 mt-4 text-right font-semibold">
              Total:{" "}
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(
                basket.reduce((total, item) => {
                  const itemTotal =
                    item.count && item.price
                      ? item.count * Number(item.price.replace(",", "."))
                      : 0;
                  return total + itemTotal;
                }, 0) // Initial total is 0
              )}
            </div>
            <div className="flex justify-end space-x-4 w-full pt-8">
              <button
                onClick={handleCancel}
                className="bg-[#c9c8c7] text-sm px-8 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                className="bg-[#93e0a4] text-sm px-8 py-2 rounded-md"
              >
                Pagar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Basket;
